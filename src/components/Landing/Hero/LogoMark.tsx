import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Kantenlänge eines Quadrats im 120er-Raster von `public/lds-icon.svg`. */
const SQUARE_SIZE = 40;
/** Eckenradius der Quadrate wie im Icon. */
const SQUARE_RADIUS = 6;
/** Deckkraft der beiden gedämpften Quadrate (40-%-Abstufung des Logos). */
const MUTED_OPACITY = 0.4;
/** Kontur-Deckkraft der gedämpften Quadrate; etwas kräftiger, damit die Linie sichtbar bleibt. */
const MUTED_STROKE_OPACITY = 0.6;
/** Strichstärke der Kontur in viewBox-Einheiten. */
const STROKE_WIDTH = 1.5;
/** Dauer, in der ein Quadrat seine Kontur zeichnet (Sekunden). */
const DRAW_DURATION_S = 0.9;
/** Versatz zwischen den Quadraten (Sekunden); 3 × 0,15 + 0,9 = 1,35 s < 1,5 s. */
const DRAW_STAGGER_S = 0.15;

type Square = {
  x: number;
  y: number;
  color: string;
  opacity: number;
};

/** Die vier Quadrate exakt wie in `public/lds-icon.svg`, Farben über die Theme-Tokens. */
const SQUARES: ReadonlyArray<Square> = [
  { x: 16, y: 16, color: 'hsl(var(--primary))', opacity: 1 },
  { x: 64, y: 16, color: 'hsl(var(--primary))', opacity: MUTED_OPACITY },
  { x: 16, y: 64, color: 'hsl(var(--primary))', opacity: MUTED_OPACITY },
  { x: 64, y: 64, color: 'hsl(var(--teal))', opacity: 1 },
];

/** Abgerundetes Rechteck als Pfad – `pathLength` auf `<rect>` wird nicht überall unterstützt. */
const toRoundedSquarePath = ({ x, y }: Square): string => {
  const r = SQUARE_RADIUS;
  const end = SQUARE_SIZE - r;
  return [
    `M ${x + r} ${y}`,
    `H ${x + end}`,
    `A ${r} ${r} 0 0 1 ${x + SQUARE_SIZE} ${y + r}`,
    `V ${y + end}`,
    `A ${r} ${r} 0 0 1 ${x + end} ${y + SQUARE_SIZE}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + end}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    'Z',
  ].join(' ');
};

type LogoMarkProps = {
  variant: 'solid' | 'outline';
  /** Nur bei `outline`: Konturen zeichnen sich per stroke-dasharray-Animation. */
  isDrawing?: boolean;
  className?: string;
};

/** Das Luka-Dev-Studio-Zeichen ohne Hintergrund. Rein dekorativ. */
export default function LogoMark({ variant, isDrawing = false, className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={cn('block', className)}
    >
      {SQUARES.map((square, index) => {
        if (variant === 'solid') {
          return (
            <rect
              key={`${square.x}-${square.y}`}
              x={square.x}
              y={square.y}
              width={SQUARE_SIZE}
              height={SQUARE_SIZE}
              rx={SQUARE_RADIUS}
              fill={square.color}
              opacity={square.opacity}
            />
          );
        }
        return (
          <motion.path
            key={`${square.x}-${square.y}`}
            d={toRoundedSquarePath(square)}
            fill="none"
            stroke={square.color}
            strokeOpacity={square.opacity === 1 ? 1 : MUTED_STROKE_OPACITY}
            strokeWidth={STROKE_WIDTH}
            strokeLinejoin="round"
            initial={isDrawing ? { pathLength: 0 } : false}
            animate={{ pathLength: 1 }}
            transition={{ duration: DRAW_DURATION_S, delay: index * DRAW_STAGGER_S, ease: 'easeInOut' }}
          />
        );
      })}
    </svg>
  );
}
