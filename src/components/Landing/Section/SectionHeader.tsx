import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { LandingSectionId } from '@/components/Landing/sections';
import { getSectionNumber } from '@/components/Landing/sections';
import { formatSectionIndex } from './sectionFormat';

type SectionHeaderProps = {
  id: LandingSectionId;
  title: ReactNode;
  className?: string;
};

export default function SectionHeader({ id, title, className }: SectionHeaderProps) {
  const { t } = useTranslation();

  return (
    <header className={cn('mb-12', className)}>
      <div className="mb-4 flex items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        <span>
          {formatSectionIndex(getSectionNumber(id))} / {t(`sections.${id}.label`)}
        </span>
        <span>{t(`sections.${id}.context`)}</span>
      </div>
      <h2 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
    </header>
  );
}
