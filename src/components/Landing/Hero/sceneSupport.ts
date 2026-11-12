/** Mindestbreite des Viewports für die 3D-Szene in Pixeln: ab Tablet-Breite. */
export const MIN_3D_VIEWPORT_WIDTH = 768;

/** Glas: Rauheit; geteilt zwischen 3D-Szene und Material-Panel. */
export const GLASS_ROUGHNESS = 0.1;
/** Glas: Brechungsindex; geteilt zwischen 3D-Szene und Material-Panel. */
export const GLASS_IOR = 1.45;
/** Untergrenze des Brechungsindex in three.js (Vakuum). */
export const MIN_IOR = 1.0;
/** Obergrenze des Brechungsindex in three.js (`MeshPhysicalMaterial.ior`). */
export const MAX_IOR = 2.333;

/** Media-Query für Geräte mit feinem Zeiger (Maus, Trackpad). */
const FINE_POINTER_QUERY = '(pointer: fine)';

/** Faktor für die Rundung auf zwei Nachkommastellen. */
const ROUNDING_FACTOR = 100;

/** Trennzeichen zwischen den Werten im Material-Panel (zwei Leerzeichen). */
const ROTATION_SEPARATOR = '  ';

export type SceneEnvironment = {
  isPointerFine: boolean;
  viewportWidth: number;
  hasWebGL2: boolean;
};

/** Rotation als Quaternion `[x, y, z, w]`. */
export type RotationQuaternion = [number, number, number, number];

/** 3D nur mit feinem Zeiger, ab Tablet-Breite und mit WebGL2 – sonst bleibt das SVG. */
export const canRender3D = ({ isPointerFine, viewportWidth, hasWebGL2 }: SceneEnvironment): boolean => {
  if (!isPointerFine) return false;
  if (viewportWidth < MIN_3D_VIEWPORT_WIDTH) return false;
  return hasWebGL2;
};

/** Prüft WebGL2 über einen Wegwerf-Canvas und gibt den Kontext danach sofort wieder frei. */
const detectWebGL2 = (): boolean => {
  try {
    const context = document.createElement('canvas').getContext('webgl2');
    if (context === null) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
};

/** Liest die Geräteeigenschaften aus dem DOM (nicht getestet). */
export const detectSceneEnvironment = (): SceneEnvironment => ({
  isPointerFine: window.matchMedia(FINE_POINTER_QUERY).matches,
  viewportWidth: window.innerWidth,
  hasWebGL2: detectWebGL2(),
});

/** Ein Wert im Mono-Format des Panels: `.12`, `-.12`, `1.0`. */
const formatComponent = (value: number): string => {
  // `|| 0` macht aus -0 eine 0, damit keine „-.00“ erscheint.
  const rounded = Math.round(value * ROUNDING_FACTOR) / ROUNDING_FACTOR || 0;
  const sign = rounded < 0 ? '-' : '';
  const magnitude = Math.abs(rounded);
  if (magnitude >= 1) return `${sign}${magnitude.toFixed(1)}`;
  return `${sign}${magnitude.toFixed(2).slice(1)}`;
};

/** Quaternion als Zeile des Material-Panels, z. B. `.00  .12  .00  1.0`. */
export const formatRotation = (rotation: RotationQuaternion): string =>
  rotation.map(formatComponent).join(ROTATION_SEPARATOR);
