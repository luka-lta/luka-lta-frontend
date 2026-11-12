import { useTranslation } from 'react-i18next';
import { useMotion } from '@/lib/motion/MotionProvider';

export default function MotionToggle() {
  const { t } = useTranslation();
  const { isPausedByUser, setPausedByUser } = useMotion();

  return (
    <button
      type="button"
      aria-pressed={isPausedByUser}
      onClick={() => setPausedByUser(!isPausedByUser)}
      className="fixed bottom-6 left-6 z-50 rounded-full border border-border/60 bg-card/80 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {isPausedByUser ? t('motion.resume') : t('motion.pause')}
    </button>
  );
}
