import { useEffect, useLayoutEffect, useRef, useState, type MutableRefObject, type PointerEvent } from 'react';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { Euler, Group, Mesh, PMREMGenerator, Quaternion, Vector3 } from 'three';
// Paket-Export von three verlangt die Endung; lokale Dateien bleiben ohne.
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLASS_IOR, GLASS_ROUGHNESS, type RotationQuaternion } from './sceneSupport';

/** Electric Blue – Spiegel von `--primary` in `src/index.css` (#3D5CFF, Branding). */
const BRAND_BLUE = '#3D5CFF';
/** Cyber Teal – Spiegel von `--teal` in `src/index.css` (#00D4AA, Branding). */
const BRAND_TEAL = '#00D4AA';

/** Kantenlänge eines Quaders in Szeneneinheiten. */
const BLOCK_SIZE = 1;
/** Abstand zwischen zwei Quadern. */
const BLOCK_GAP = 0.2;
/** Tiefe eines Quaders. */
const BLOCK_DEPTH = 0.35;
/** Kantenradius eines Quaders. */
const BLOCK_RADIUS = 0.12;
/** Unterteilung der Rundung (drei-Default: 4). */
const BLOCK_SMOOTHNESS = 4;
/** Abstand eines Quadermittelpunkts zur Logo-Mitte je Achse. */
const BLOCK_OFFSET = (BLOCK_SIZE + BLOCK_GAP) / 2;

/** Glas: volle Transmission. */
const GLASS_TRANSMISSION = 1;
/** Glas: angenommene Materialdicke für Brechung und Absorption. */
const GLASS_THICKNESS = 0.6;
/** Strecke, nach der das Licht im Glas auf die Tönungsfarbe abgeschwächt ist. */
const ATTENUATION_DISTANCE = 0.4;
/** Stärke der gedämpften Quader wie die 40-%-Abstufung im Logo. */
const MUTED_STRENGTH = 0.4;
/** Größere Strecke = schwächere Tönung; der Exponent der Absorption skaliert mit dem Kehrwert. */
const MUTED_ATTENUATION_DISTANCE = ATTENUATION_DISTANCE / MUTED_STRENGTH;

/** Öffnungswinkel der Kamera in Grad. */
const CAMERA_FOV = 35;
/** Kantenlänge des gesamten Logos (zwei Quader plus Abstand). */
const LOGO_EXTENT = 2 * BLOCK_SIZE + BLOCK_GAP;
/** Canvas-Größe relativ zum Hero-Container (`-inset-1/4` in HeroVisual): Platz für Drehung und Drift. */
const CANVAS_SCALE = 1.5;
/**
 * Anteil des Containers, den das ungedrehte Logo füllt. Das SVG füllt 88/120 ≈ 0,73; etwas mehr,
 * weil die hellen Glaskanten optisch kleiner wirken als die vollen SVG-Flächen.
 */
const LOGO_FILL_OF_CONTAINER = 0.8;
/** Kameraabstand, bei dem das Logo genau `LOGO_FILL_OF_CONTAINER` des Containers einnimmt. */
const CAMERA_DISTANCE =
  LOGO_EXTENT / (LOGO_FILL_OF_CONTAINER / CANVAS_SCALE) / (2 * Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180));
/** Sigma der PMREM-Unschärfe für die Raum-Umgebung (three.js-Beispielwert). */
const ENVIRONMENT_BLUR_SIGMA = 0.04;

/** Startdrehung um Y in Radiant – zeigt die Tiefe, ohne das Logo unkenntlich zu machen. */
const INITIAL_TURN_Y_RAD = 0.24;
/**
 * Langsames Pendeln um Y statt Dauerdrehung: Eine volle Drehung zeigt die Rückseite, und die
 * erscheint dem Betrachter spiegelverkehrt (Farben links/rechts vertauscht).
 */
const SWAY_AMPLITUDE_RAD = 0.35;
/** Periodendauer des Pendelns in Sekunden. */
const SWAY_PERIOD_S = 8;
/** Wie schnell das Logo nach dem Loslassen zur Ruhelage zurückkehrt (pro Sekunde). */
const RETURN_RATE_PER_S = 1.5;
/** Obergrenze für das Frame-Delta in Sekunden, damit nach einer Pause nichts springt. */
const MAX_FRAME_DELTA_S = 0.1;
/** Drehung pro gezogenem Pixel in Radiant. */
const DRAG_SENSITIVITY = 0.008;
/** Obergrenze der Winkelgeschwindigkeit in Radiant pro Sekunde. */
const MAX_ANGULAR_SPEED = 8;
/** Abklingrate der Trägheit pro Sekunde (exponentiell). */
const INERTIA_DECAY_PER_S = 3;
/** Maximaler Drift: Quader rücken um diesen Anteil ihres Abstands nach außen. */
const MAX_DRIFT = 0.15;
/** Winkelgeschwindigkeit, ab der der volle Drift erreicht ist (Radiant pro Sekunde). */
const DRIFT_FULL_SPEED = 4;
/** Wie schnell der Drift seinem Ziel folgt (pro Sekunde). */
const DRIFT_RESPONSE_PER_S = 6;
/** Mindestabstand zwischen zwei Rotationsmeldungen an das Panel in Sekunden. */
const ROTATION_REPORT_INTERVAL_S = 0.1;

const AXIS_X = new Vector3(1, 0, 0);
const AXIS_Y = new Vector3(0, 1, 0);

type Block = {
  position: [number, number, number];
  color: string;
  attenuationDistance: number;
};

/** 2×2-Raster wie `public/lds-icon.svg`: oben links Blue, Diagonale gedämpft, unten rechts Teal. */
const BLOCKS: ReadonlyArray<Block> = [
  { position: [-BLOCK_OFFSET, BLOCK_OFFSET, 0], color: BRAND_BLUE, attenuationDistance: ATTENUATION_DISTANCE },
  { position: [BLOCK_OFFSET, BLOCK_OFFSET, 0], color: BRAND_BLUE, attenuationDistance: MUTED_ATTENUATION_DISTANCE },
  { position: [-BLOCK_OFFSET, -BLOCK_OFFSET, 0], color: BRAND_BLUE, attenuationDistance: MUTED_ATTENUATION_DISTANCE },
  { position: [BLOCK_OFFSET, -BLOCK_OFFSET, 0], color: BRAND_TEAL, attenuationDistance: ATTENUATION_DISTANCE },
];

/** Zustand des Ziehens; per Ref geteilt, damit Pointer-Events kein React-Rendering auslösen. */
type DragState = {
  isDragging: boolean;
  lastX: number;
  lastY: number;
  /** Seit dem letzten Frame gezogene Drehung um X bzw. Y in Radiant. */
  pendingX: number;
  pendingY: number;
  /** Winkelgeschwindigkeit um X bzw. Y in Radiant pro Sekunde (Trägheit). */
  velocityX: number;
  velocityY: number;
};

type LogoSceneProps = {
  isMotionEnabled: boolean;
  /** Außerhalb des Viewports pausiert die Render-Schleife komplett. */
  isOnScreen: boolean;
  onReady: () => void;
  onRotationChange?: (q: RotationQuaternion) => void;
};

/** Unsichtbar: gar nicht rendern; sonst dauerhaft nur mit Bewegung, ohne Bewegung nur bei Interaktion. */
const getFrameloop = (isMotionEnabled: boolean, isOnScreen: boolean): 'always' | 'demand' | 'never' => {
  if (!isOnScreen) return 'never';
  return isMotionEnabled ? 'always' : 'demand';
};

const clampSpeed = (speed: number): number => Math.max(-MAX_ANGULAR_SPEED, Math.min(MAX_ANGULAR_SPEED, speed));

/** Lokale Umgebung aus `RoomEnvironment` – kein Download, keine HDR-Datei. */
function RoomLighting() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    const generator = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const texture = generator.fromScene(room, ENVIRONMENT_BLUR_SIGMA).texture;
    scene.environment = texture;
    room.dispose();
    generator.dispose();
    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [gl, scene]);

  return null;
}

type LogoBlocksProps = {
  isMotionEnabled: boolean;
  dragRef: MutableRefObject<DragState>;
  onReadyRef: MutableRefObject<() => void>;
  onRotationChangeRef: MutableRefObject<((q: RotationQuaternion) => void) | undefined>;
};

function LogoBlocks({ isMotionEnabled, dragRef, onReadyRef, onRotationChangeRef }: LogoBlocksProps) {
  const groupRef = useRef<Group>(null);
  const blockRefs = useRef<Array<Mesh | null>>([]);
  const driftRef = useRef<number>(0);
  const hasReportedReadyRef = useRef<boolean>(false);
  const sinceRotationReportRef = useRef<number>(ROTATION_REPORT_INTERVAL_S);
  // Hilfsobjekte wiederverwenden statt pro Frame neu anzulegen.
  const [turn] = useState<Quaternion>(() => new Quaternion());
  const [target] = useState<Quaternion>(() => new Quaternion());
  const [rest] = useState<Quaternion>(() => new Quaternion().setFromEuler(new Euler(0, INITIAL_TURN_Y_RAD, 0)));
  const swayTimeRef = useRef<number>(0);

  useLayoutEffect(() => {
    groupRef.current?.quaternion.copy(rest);
  }, [rest]);

  useFrame((_state, frameDelta) => {
    const group = groupRef.current;
    if (group === null) return;
    const drag = dragRef.current;
    const delta = Math.min(frameDelta, MAX_FRAME_DELTA_S);

    let angleX = drag.pendingX;
    let angleY = drag.pendingY;
    drag.pendingX = 0;
    drag.pendingY = 0;

    if (drag.isDragging && delta > 0) {
      drag.velocityX = clampSpeed(angleX / delta);
      drag.velocityY = clampSpeed(angleY / delta);
    }
    if (!drag.isDragging && isMotionEnabled) {
      angleX += drag.velocityX * delta;
      angleY += drag.velocityY * delta;
      const decay = Math.exp(-INERTIA_DECAY_PER_S * delta);
      drag.velocityX *= decay;
      drag.velocityY *= decay;
    }
    if (!isMotionEnabled) {
      drag.velocityX = 0;
      drag.velocityY = 0;
    }

    // Drehung im Weltraum: horizontal ziehen dreht um Y, vertikal um X.
    group.quaternion.premultiply(turn.setFromAxisAngle(AXIS_Y, angleY));
    group.quaternion.premultiply(turn.setFromAxisAngle(AXIS_X, angleX));

    // Ohne Ziehen zieht eine Feder zur pendelnden Ruhelage – die Vorderseite bleibt sichtbar.
    if (!drag.isDragging && isMotionEnabled) {
      swayTimeRef.current += delta;
      const swayAngle = SWAY_AMPLITUDE_RAD * Math.sin((swayTimeRef.current * 2 * Math.PI) / SWAY_PERIOD_S);
      target.copy(rest).premultiply(turn.setFromAxisAngle(AXIS_Y, swayAngle));
      group.quaternion.slerp(target, 1 - Math.exp(-RETURN_RATE_PER_S * delta));
    }

    // Beim Drehen driften die Quader auseinander und kehren in Ruhe zurück.
    const speed = Math.hypot(drag.velocityX, drag.velocityY);
    const driftTarget = isMotionEnabled ? Math.min(speed / DRIFT_FULL_SPEED, 1) * MAX_DRIFT : 0;
    driftRef.current += (driftTarget - driftRef.current) * (1 - Math.exp(-DRIFT_RESPONSE_PER_S * delta));
    const spread = 1 + driftRef.current;
    BLOCKS.forEach((block, index) => {
      const mesh = blockRefs.current[index];
      if (!mesh) return;
      mesh.position.set(block.position[0] * spread, block.position[1] * spread, block.position[2]);
    });

    if (!hasReportedReadyRef.current) {
      hasReportedReadyRef.current = true;
      onReadyRef.current();
    }

    const report = onRotationChangeRef.current;
    if (report === undefined) return;
    sinceRotationReportRef.current += delta;
    if (sinceRotationReportRef.current < ROTATION_REPORT_INTERVAL_S) return;
    sinceRotationReportRef.current = 0;
    const { x, y, z, w } = group.quaternion;
    report([x, y, z, w]);
  });

  return (
    <group ref={groupRef}>
      {BLOCKS.map((block, index) => (
        <RoundedBox
          key={block.position.join(',')}
          ref={(mesh: Mesh | null) => {
            blockRefs.current[index] = mesh;
          }}
          args={[BLOCK_SIZE, BLOCK_SIZE, BLOCK_DEPTH]}
          radius={BLOCK_RADIUS}
          smoothness={BLOCK_SMOOTHNESS}
          position={block.position}
        >
          <meshPhysicalMaterial
            transmission={GLASS_TRANSMISSION}
            thickness={GLASS_THICKNESS}
            roughness={GLASS_ROUGHNESS}
            ior={GLASS_IOR}
            attenuationColor={block.color}
            attenuationDistance={block.attenuationDistance}
          />
        </RoundedBox>
      ))}
    </group>
  );
}

/**
 * Das Logo als vier Glas-Quader. Default-Export für `React.lazy`; landet in einem eigenen Chunk.
 * Bei Kontextverlust wirft die Komponente, damit die Error-Boundary dauerhaft auf das SVG schaltet.
 */
export default function LogoScene({ isMotionEnabled, isOnScreen, onReady, onRotationChange }: LogoSceneProps) {
  const [isContextLost, setIsContextLost] = useState<boolean>(false);
  const dragRef = useRef<DragState>({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    pendingX: 0,
    pendingY: 0,
    velocityX: 0,
    velocityY: 0,
  });
  const onReadyRef = useRef(onReady);
  const onRotationChangeRef = useRef(onRotationChange);
  const invalidateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
    onRotationChangeRef.current = onRotationChange;
  }, [onReady, onRotationChange]);

  if (isContextLost) throw new Error('WebGL context lost');

  const onCreated = (state: RootState) => {
    invalidateRef.current = () => state.invalidate();
    state.gl.domElement.addEventListener('webglcontextlost', () => setIsContextLost(true), { once: true });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const drag = dragRef.current;
    drag.isDragging = true;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.isDragging) return;
    drag.pendingY += (event.clientX - drag.lastX) * DRAG_SENSITIVITY;
    drag.pendingX += (event.clientY - drag.lastY) * DRAG_SENSITIVITY;
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    invalidateRef.current?.();
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    dragRef.current.isDragging = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    invalidateRef.current?.();
  };

  return (
    <div
      aria-hidden="true"
      data-cursor="drag"
      className="h-full w-full touch-pan-y"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, CAMERA_DISTANCE], fov: CAMERA_FOV }}
        frameloop={getFrameloop(isMotionEnabled, isOnScreen)}
        onCreated={onCreated}
      >
        <RoomLighting />
        <LogoBlocks
          isMotionEnabled={isMotionEnabled}
          dragRef={dragRef}
          onReadyRef={onReadyRef}
          onRotationChangeRef={onRotationChangeRef}
        />
      </Canvas>
    </div>
  );
}
