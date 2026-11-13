import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Landing/Section/Reveal';
import SectionHeader from '@/components/Landing/Section/SectionHeader';
import { useMotion } from '@/lib/motion/MotionProvider';
import { cn } from '@/lib/utils';

const TIMELINE_EVENTS = [
  { year: 2021, key: 'graduated_school' },
  { year: 2022, key: 'apprenticeship_start' },
  { year: 2025, key: 'apprenticeship_end' },
] as const;

export default function Timeline() {
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();

  return (
    <section id="timeline" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <SectionHeader
          id="timeline"
          title={<span className="block text-4xl font-black leading-[0.95] md:text-6xl">{t('timeline.headline')}</span>}
        />

        <ol className="border-l border-border">
          {TIMELINE_EVENTS.map((event, index) => (
            <Reveal
              as="li"
              key={event.year}
              delay={index * 0.1}
              className="relative grid gap-2 py-8 pl-8 md:grid-cols-[8rem_1fr] md:gap-8 md:pl-12"
            >
              <span className="absolute -left-[5px] top-10 h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
              <span className="font-mono text-2xl text-primary md:text-3xl">{event.year}</span>
              <div>
                <h3 className="text-xl font-bold text-foreground md:text-2xl">
                  {t(`timeline.events.${event.key}.title`)}
                </h3>
                <p className="mt-2 text-muted-foreground">{t(`timeline.events.${event.key}.description`)}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="relative flex items-center gap-3 py-8 pl-8 md:pl-12">
          <span
            className={cn(
              'absolute -left-[5px] h-2.5 w-2.5 rounded-full border border-primary bg-background',
              isMotionEnabled && 'animate-pulse',
            )}
            aria-hidden="true"
          />
          <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {t('timeline.continuing')}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
