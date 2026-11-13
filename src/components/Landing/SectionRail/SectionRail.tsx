import { useEffect, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { scrollToSection } from '@/lib/motion/smoothScroll';
import { filterPresentSections, LANDING_SECTIONS, type LandingSectionId } from '@/components/Landing/sections';
import { pickActiveSection } from './activeSection';

const OBSERVER_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];
const FALLBACK_ID: LandingSectionId = 'top';
const ALL_IDS = LANDING_SECTIONS.map((section) => section.id);

const scanPresentIds = (): LandingSectionId[] =>
  filterPresentSections(ALL_IDS, (id) => document.getElementById(id) !== null);

const isSameList = (a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean =>
  a.length === b.length && a.every((id, index) => id === b[index]);

export default function SectionRail() {
  const { t } = useTranslation();
  const [presentIds, setPresentIds] = useState<LandingSectionId[]>(scanPresentIds);
  const [activeId, setActiveId] = useState<LandingSectionId>(FALLBACK_ID);

  // Sektionen können nachträglich erscheinen oder verschwinden (z. B. Projekte bei API-Fehler).
  useEffect(() => {
    const update = () => setPresentIds((current) => {
      const next = scanPresentIds();
      return isSameList(current, next) ? current : next;
    });
    update();
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(document.querySelector('main') ?? document.body, { childList: true, subtree: true });
    return () => mutationObserver.disconnect();
  }, []);

  useEffect(() => {
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        const ordered = presentIds.map((id) => ({ id, ratio: ratios.get(id) ?? 0 }));
        setActiveId(pickActiveSection(ordered, FALLBACK_ID) as LandingSectionId);
      },
      { threshold: OBSERVER_THRESHOLDS },
    );
    presentIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element !== null) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [presentIds]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  const sections = LANDING_SECTIONS.filter((section) => presentIds.includes(section.id));

  return (
    <nav
      aria-label={t('rail.label')}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-3">
        {sections.map((section) => {
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
                    isActive ? 'w-8 bg-teal' : 'w-4 bg-muted-foreground/50 group-hover:w-6',
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
