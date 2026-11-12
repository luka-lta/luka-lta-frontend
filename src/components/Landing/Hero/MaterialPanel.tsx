import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { GLASS_IOR, GLASS_ROUGHNESS, MAX_IOR, MIN_IOR } from './sceneSupport';

/** Umrechnung eines Anteils (0…1) in Prozent für die Balkenbreite. */
const PERCENT = 100;
/** Balkenanteil Rauheit (0…1). */
const ROUGHNESS_FILL = GLASS_ROUGHNESS;
/** Balkenanteil Brechungsindex innerhalb des three.js-Bereichs (0…1). */
const IOR_FILL = (GLASS_IOR - MIN_IOR) / (MAX_IOR - MIN_IOR);

type MaterialBarProps = {
  label: string;
  value: string;
  fill: number;
};

function MaterialBar({ label, value, fill }: MaterialBarProps) {
  return (
    <div className="mt-3">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="mt-1.5 h-px w-full bg-border">
        <div className="h-px bg-primary" style={{ width: `${fill * PERCENT}%` }} />
      </div>
    </div>
  );
}

type MaterialPanelProps = {
  /** Rotationszeile im Panel-Format, z. B. `.00  .12  .00  1.0`. */
  rotationText: string;
  className?: string;
};

/** Deko-Panel mit den Materialwerten des Glas-Logos. Rein dekorativ. */
export default function MaterialPanel({ rotationText, className }: MaterialPanelProps) {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none w-52 shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground',
        className,
      )}
    >
      <p className="text-foreground">{t('hero.material.title')}</p>
      <MaterialBar label={t('hero.material.roughness')} value={GLASS_ROUGHNESS.toFixed(2)} fill={ROUGHNESS_FILL} />
      <MaterialBar label={t('hero.material.ior')} value={GLASS_IOR.toFixed(2)} fill={IOR_FILL} />
      <p className="mt-3">{t('hero.material.rotation')}</p>
      <p className="mt-1 whitespace-pre tabular-nums text-foreground">{rotationText}</p>
    </div>
  );
}
