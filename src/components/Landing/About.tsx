import { useTranslation } from 'react-i18next';
import Reveal from '@/components/Landing/Section/Reveal';
import SectionHeader from '@/components/Landing/Section/SectionHeader';

const HIGHLIGHT_KEYS = ['fullstack', 'fast', 'client'] as const;

export default function About() {
  const { t } = useTranslation();

  const stats = [
    { value: '3+', label: t('about.stat_experience') },
    { value: '10+', label: t('about.stat_projects') },
    { value: '15+', label: t('about.stat_technologies') },
  ];

  return (
    <section id="about" className="section-light py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          id="about"
          title={
            <span className="block text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">
              {t('about.headline_1')}
              <br />
              <span className="text-primary">{t('about.headline_2')}</span>
            </span>
          }
        />

        <Reveal>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground md:text-xl">{t('about.body')}</p>
        </Reveal>

        <Reveal className="mt-16 grid grid-cols-3 border-y border-border">
          {stats.map((stat) => (
            <div key={stat.label} className="border-r border-border px-4 py-8 last:border-r-0 md:px-8">
              <div className="font-mono text-4xl font-medium text-foreground md:text-6xl">{stat.value}</div>
              <div className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>

        <ul className="mt-16 grid gap-0 md:grid-cols-3 md:gap-12">
          {HIGHLIGHT_KEYS.map((key, index) => (
            <Reveal as="li" key={key} delay={index * 0.1} className="border-t border-border py-6">
              <h3 className="text-lg font-bold text-foreground">{t(`about.highlights.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`about.highlights.${key}.body`)}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
