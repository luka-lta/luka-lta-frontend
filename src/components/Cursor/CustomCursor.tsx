import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMotion } from '@/lib/motion/MotionProvider';
import { parseCursorVariant, type CursorVariant } from './cursorVariant';

const FINE_POINTER_QUERY = '(pointer: fine)';
const CURSOR_TARGET_SELECTOR = '[data-cursor], a, button';

/** Anteil der Restdistanz, der pro Frame zurückgelegt wird (Nachlauf). */
const LERP_FACTOR = 0.2;
/** Unterhalb dieser Distanz in px gilt der Cursor als angekommen und die Schleife ruht. */
const SETTLE_DISTANCE = 0.1;

/** Durchmesser je Variante in px. */
const SIZE_BY_VARIANT: Record<CursorVariant, number> = {
  default: 12,
  link: 40,
  open: 72,
  drag: 72,
};

const resolveVariant = (target: EventTarget | null): CursorVariant => {
  if (!(target instanceof Element)) return 'default';
  const element = target.closest(CURSOR_TARGET_SELECTOR);
  if (element === null) return 'default';
  const explicit = parseCursorVariant(element.getAttribute('data-cursor'));
  if (explicit !== 'default') return explicit;
  return element.matches('a, button') ? 'link' : 'default';
};

export default function CustomCursor() {
  const { isMotionEnabled } = useMotion();
  const [hasFinePointer, setHasFinePointer] = useState<boolean>(() => window.matchMedia(FINE_POINTER_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER_QUERY);
    const onChange = (event: MediaQueryListEvent) => setHasFinePointer(event.matches);
    setHasFinePointer(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  if (!isMotionEnabled || !hasFinePointer) return null;
  return <CursorLayer />;
}

function CursorLayer() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const positionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let hasPosition = false;
    let frameId = 0;

    const render = () => {
      frameId = 0;
      const node = positionRef.current;
      if (node === null) return;
      current.x += (target.x - current.x) * LERP_FACTOR;
      current.y += (target.y - current.y) * LERP_FACTOR;
      node.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      const isSettled =
        Math.abs(target.x - current.x) < SETTLE_DISTANCE && Math.abs(target.y - current.y) < SETTLE_DISTANCE;
      if (!isSettled) frameId = requestAnimationFrame(render);
    };
    const schedule = () => {
      if (frameId === 0) frameId = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!hasPosition) {
        // Erster Kontakt: ohne Anflug vom Fensterrand starten
        hasPosition = true;
        current.x = target.x;
        current.y = target.y;
        setIsVisible(true);
      }
      schedule();
    };
    const onPointerOver = (event: PointerEvent) => setVariant(resolveVariant(event.target));
    const onDocumentLeave = () => setIsVisible(false);
    const onDocumentEnter = () => setIsVisible(hasPosition);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onDocumentLeave);
    document.documentElement.addEventListener('pointerenter', onDocumentEnter);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.documentElement.removeEventListener('pointerleave', onDocumentLeave);
      document.documentElement.removeEventListener('pointerenter', onDocumentEnter);
      if (frameId !== 0) cancelAnimationFrame(frameId);
    };
  }, []);

  const size = SIZE_BY_VARIANT[variant];
  const isDot = variant === 'default';
  const label = variant === 'open' ? t('cursor.open') : variant === 'drag' ? t('cursor.drag') : null;

  return (
    <div
      ref={positionRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] will-change-transform"
    >
      <div
        style={{ width: size, height: size }}
        className={`-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-teal transition-[width,height,opacity,background-color] duration-200 ease-out ${
          isDot ? 'bg-teal' : 'bg-transparent'
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {label !== null && <span className="font-mono text-[10px] uppercase tracking-widest text-teal">{label}</span>}
      </div>
    </div>
  );
}
