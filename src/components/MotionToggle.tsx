import { useTranslation } from 'react-i18next';
import { useMotion } from '@/lib/motion/MotionProvider';

const BUTTON_CLASS =
  'hide-when-menu-open fixed bottom-6 left-6 z-50 rounded-full border border-border/60 bg-card/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:hover:border-border/60 disabled:hover:text-muted-foreground';

export default function MotionToggle() {
  const { t } = useTranslation();
  const { prefersReducedMotion, isPausedByUser, setPausedByUser } = useMotion();

  // Systemeinstellung schlägt den Toggle: anzeigen, warum Bewegung aus ist, statt eines wirkungslosen Schalters.
  if (prefersReducedMotion) {
    return (
      <button type="button" disabled className={BUTTON_CLASS}>
        {t('motion.reduced_by_system')}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isPausedByUser}
      onClick={() => setPausedByUser(!isPausedByUser)}
      className={BUTTON_CLASS}
    >
      {isPausedByUser ? t('motion.resume') : t('motion.pause')}
    </button>
  );
}
