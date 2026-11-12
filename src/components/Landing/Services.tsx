import type { MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import Reveal from '@/components/Landing/Section/Reveal';
import SectionHeader from '@/components/Landing/Section/SectionHeader';
import { track } from '@/lib/analytics';
import { scrollToSection } from '@/lib/motion/smoothScroll';

const SERVICE_KEYS = ['websites', 'maintenance'] as const;

type ServiceKey = (typeof SERVICE_KEYS)[number];

export default function Services() {
  const { t } = useTranslation();

  const handleCtaClick = (event: MouseEvent<HTMLAnchorElement>, key: ServiceKey) => {
    track('service_cta_click', { service: key });
    event.preventDefault();
    scrollToSection('contact');
  };

  return (
    <section id="services" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          id="services"
          title={<span className="block text-5xl font-black leading-[0.95] md:text-7xl">{t('services.headline')}</span>}
        />
        <p className="-mt-6 mb-16 max-w-md text-muted-foreground">{t('services.subheadline')}</p>

        <ol className="border-b border-border">
          {SERVICE_KEYS.map((key, index) => {
            const bullets = t(`services.${key}.bullets`, { returnObjects: true }) as string[];

            return (
              <Reveal
                as="li"
                key={key}
                className="grid gap-8 border-t border-border py-10 md:grid-cols-[6rem_1fr_1fr] md:gap-12"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div>
                  <h3 className="text-2xl font-bold text-foreground md:text-4xl">{t(`services.${key}.title`)}</h3>
                  <p className="mt-4 text-muted-foreground">{t(`services.${key}.description`)}</p>
                  <Button asChild className="group mt-8 gap-2 rounded-full">
                    <a
                      href="#contact"
                      onClick={(event) => handleCtaClick(event, key)}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {t('services.cta')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>

                <ul className="divide-y divide-border self-start border-y border-border">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="py-3 text-sm text-muted-foreground">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
