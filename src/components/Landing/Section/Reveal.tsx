import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMotion } from '@/lib/motion/MotionProvider';

const REVEAL_OFFSET_PX = 24;
const REVEAL_DURATION_S = 0.6;

type RevealProps = {
  as?: 'div' | 'li';
  delay?: number;
  className?: string;
  children: ReactNode;
};

export default function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const { isMotionEnabled } = useMotion();
  const Tag = as === 'li' ? motion.li : motion.div;

  // Ohne Motion: statisch sichtbar, keine Transform-/Opacity-Animation.
  if (!isMotionEnabled) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: REVEAL_OFFSET_PX }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: REVEAL_DURATION_S, delay, ease: 'easeOut' }}
    >
      {children}
    </Tag>
  );
}
