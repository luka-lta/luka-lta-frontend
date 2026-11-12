import { useEffect, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { scrollToSection } from '@/lib/motion/smoothScroll';
import { LANDING_SECTIONS } from '@/components/Landing/sections';
import { pickActiveSection } from './activeSection';

const OBSERVER_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];
const FALLBACK_ID = LANDING_SECTIONS[0].id;

export default function SectionRail() {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>(FALLBACK_ID);

  useEffect(() => {
    // Nur Sektionen beobachten, die im DOM existieren (Projekte können fehlen).
    const elements = LANDING_SECTIONS
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        const ordered = elements.map((element) => ({ id: element.id, ratio: ratios.get(element.id) ?? 0 }));
        setActiveId(pickActiveSection(ordered, FALLBACK_ID));
      },
      { threshold: OBSERVER_THRESHOLDS },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <nav
      aria-label={t('rail.label')}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-3">
        {LANDING_SECTIONS.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => handleClick(event, section.id)}
                aria-current={isActive ? 'location' : undefined}
                className="group flex items-center gap-3 rounded-sm py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  className={cn(
                    'font-mono text-xs uppercase tracking-widest text-muted-foreground opacity-0 transition-opacity',
                    'group-hover:opacity-100 group-focus-visible:opacity-100',
                  )}
                >
                  {t(section.navKey)}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'block h-px transition-all duration-300',
                    isActive ? 'w-8 bg-[#00D4AA]' : 'w-4 bg-muted-foreground/50 group-hover:w-6',
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
