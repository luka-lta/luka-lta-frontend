import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useProjects } from '@/api/projects/hooks/useProjects';
import type { Project } from '@/api/projects/schema';
import { track } from '@/lib/analytics';
import SectionHeader from '@/components/Landing/Section/SectionHeader';
import Reveal from '@/components/Landing/Section/Reveal';
import { formatCounter } from '@/components/Landing/Section/sectionFormat';

/** Maximale Anzahl Tech-Tags pro Karte */
const MAX_TECH_TAGS = 3;

type CardProps = {
  project: Project;
  index: number;
};

function ProjectCard({ project, index }: CardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // Reihenfolge nach Eignung: Cover ist fuer genau diese Darstellung gedacht,
  // der Screenshot ist das naechstbeste echte Bild, das Logo der Rueckfall --
  // besser als eine leere Flaeche, und beim Anlegen im Dashboard ist das Logo
  // das Bild, das man zuerst hochlaedt.
  const imageUrl =
    project.cover?.url ?? project.screenshots[0]?.url ?? project.logo?.url ?? null;
  const hiddenTagCount = project.techStack.length - MAX_TECH_TAGS;
  const kicker = [project.isClientProject ? t('projects.client') : null, project.year]
    .filter((part): part is string | number => part !== null && part !== undefined && part !== '')
    .join(' / ');

  return (
    <div className="group relative h-full">
      <button
        type="button"
        data-cursor="open"
        onClick={() => {
          track('project_click', { id: project.slug, title: project.name, featured: index === 0 });
          navigate(`/project/${project.slug}`);
        }}
        aria-label={`${t('projects.view_details')} — ${project.name}`}
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors hover:border-primary/40"
      >
        <div className="aspect-[16/10] w-full overflow-hidden bg-secondary">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={project.name}
              width={1280}
              height={800}
              draggable={false}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          {kicker && (
            <span className="font-mono text-xs uppercase tracking-widest text-teal">{kicker}</span>
          )}
          <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {project.name}
          </h3>
          {project.shortDescription && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.shortDescription}
            </p>
          )}
          <div className="mt-auto flex items-end justify-between gap-4 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, MAX_TECH_TAGS).map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-md text-[11px] font-normal">
                  {tag}
                </Badge>
              ))}
              {hiddenTagCount > 0 && (
                <Badge variant="secondary" className="rounded-md text-[11px] font-normal">
                  +{hiddenTagCount}
                </Badge>
              )}
            </div>
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>
      {project.repositoryUrl && (
        <a
          href={project.repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} GitHub`}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary"
        >
          <Github className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

const CARD_ITEM_CLASS = 'basis-4/5 pl-4 lg:basis-3/5';

function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[16/10] bg-secondary" />
      <div className="p-6">
        <div className="mb-4 h-4 w-16 rounded bg-secondary" />
        <div className="mb-3 h-7 w-2/3 rounded bg-secondary" />
        <div className="mb-5 h-10 w-full rounded bg-secondary" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded bg-secondary" />
          <div className="h-5 w-16 rounded bg-secondary" />
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const { t } = useTranslation();
  const { data: projects, isLoading, isError } = useProjects();
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const syncState = useCallback((emblaApi: NonNullable<CarouselApi>) => {
    setSelected(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    syncState(api);
    api.on('select', syncState);
    api.on('reInit', syncState);
    return () => {
      api.off('select', syncState);
      api.off('reInit', syncState);
    };
  }, [api, syncState]);

  if (isLoading) {
    return (
      <section id="projects" className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader id="projects" title={t('projects.headline')} />
          <div className="flex gap-4 overflow-hidden">
            <div className="w-4/5 shrink-0 lg:w-3/5">
              <CardSkeleton />
            </div>
            <div className="w-4/5 shrink-0 lg:w-3/5">
              <CardSkeleton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Kein Abschnitt statt einer leeren "0 Projekte"-Flaeche — gilt auch fuer
  // den Fehlerfall, das ist eine Marketing-Seite und kein Dashboard.
  if (isError || !projects || projects.length === 0) {
    return null;
  }

  const total = projects.length;
  const current = projects[Math.min(selected, total - 1)];

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader id="projects" title={t('projects.headline')} />

        <Reveal>
          <Carousel
            opts={{ align: 'start', dragFree: false }}
            setApi={setApi}
            aria-label={t('projects.carousel_label')}
            data-cursor="drag"
          >
            <CarouselContent className="-ml-4">
              {projects.map((project, index) => (
                <CarouselItem key={project.slug} className={CARD_ITEM_CLASS}>
                  <ProjectCard project={project} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground" aria-live="polite">
              {current.shortDescription}
            </p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label={t('projects.prev')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary disabled:opacity-30 disabled:hover:border-border"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="font-mono text-sm tabular-nums text-muted-foreground">
                {formatCounter(selected + 1, total)}
              </span>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                disabled={!canScrollNext}
                aria-label={t('projects.next')}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary disabled:opacity-30 disabled:hover:border-border"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-border" aria-hidden="true">
            <div
              className="h-full bg-primary transition-[width] duration-300"
              style={{ width: `${((selected + 1) / total) * 100}%` }}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Projects;
