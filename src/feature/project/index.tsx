import { ArrowLeft, CircleDot, ExternalLink, GitFork, Github, Globe, Star, type LucideIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/Landing/Header';
import Footer from '@/components/Landing/Footer';
import Reveal from '@/components/Landing/Section/Reveal';
import ScrollToTop from '@/components/scroll-to-top';
import SEO from '@/components/SEO';
import { useProject } from '@/api/projects/hooks/useProjects';
import { useGithubStats } from '@/api/github/hooks/useGithubStats';
import { useMotion } from '@/lib/motion/MotionProvider';
import { cn } from '@/lib/utils';

/** Intrinsische Maße der Screenshots (16:9); verhindert Layout-Shift beim Laden. */
const SCREENSHOT_WIDTH_PX = 1600;
const SCREENSHOT_HEIGHT_PX = 900;

const FOCUS_CLASS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background';
const MONO_LABEL_CLASS = 'font-mono text-xs uppercase tracking-widest text-muted-foreground';

function Project() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMotionEnabled } = useMotion();

  const { data: project, isLoading } = useProject(projectId);

  const { data: stats, isLoading: statsLoading } = useGithubStats(
    project?.repositoryOwner ?? '',
    project?.repositoryName ?? '',
  );

  // Während die Query läuft, darf der Nicht-gefunden-Zweig noch nicht greifen,
  // sonst flackert er kurz auf, bevor die Daten da sind.
  if (isLoading) {
    return (
      <>
        <Header />
        <main id="main" tabIndex={-1} className="flex min-h-[60vh] items-center justify-center bg-background focus:outline-none">
          <div className={cn('h-8 w-8 rounded-full bg-secondary', isMotionEnabled && 'animate-pulse')} />
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <SEO title={t('project_page.not_found')} canonicalPath={`/project/${projectId}`} />
        <Header />
        <main
          id="main"
          tabIndex={-1}
          className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background pt-20 focus:outline-none"
        >
          <p className="text-xl font-bold text-foreground">{t('project_page.not_found')}</p>
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t('project_page.back')}
          </Button>
        </main>
        <Footer />
      </>
    );
  }

  const metaItems = [
    project.role,
    project.year === null ? null : String(project.year),
    project.isClientProject ? t('project_page.client_project') : null,
  ].filter((item): item is string => item !== null && item !== '');

  return (
    <>
      <SEO
        title={project.name}
        description={project.description ?? undefined}
        canonicalPath={`/project/${project.slug}`}
      />
      <ScrollToTop />
      <Header />

      <main id="main" tabIndex={-1} className="min-h-screen bg-background focus:outline-none">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={`mb-10 inline-flex items-center gap-2 ${MONO_LABEL_CLASS} transition-colors hover:text-foreground ${FOCUS_CLASS}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t('project_page.back')}
          </button>

          <Reveal>
            {metaItems.length > 0 && (
              <p className={`mb-6 ${MONO_LABEL_CLASS}`}>
                {metaItems.map((item, index) => (
                  <span key={item}>
                    {index > 0 && <span aria-hidden> · </span>}
                    {item}
                  </span>
                ))}
              </p>
            )}
            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-8xl">
              {project.name}
            </h1>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              {project.repositoryUrl && (
                <Button variant="outline" className={`gap-2 rounded-full ${FOCUS_CLASS}`} asChild>
                  <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" aria-hidden />
                    {t('project_page.repository')}
                  </a>
                </Button>
              )}
              {project.websiteUrl && (
                <Button className={`gap-2 rounded-full ${FOCUS_CLASS}`} asChild>
                  <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" aria-hidden />
                    {project.liveLabel ?? t('project_page.live_demo')}
                  </a>
                </Button>
              )}
            </div>
          </Reveal>

          {/* GitHub stat chips */}
          {!project.isClientProject && (stats || statsLoading) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {statsLoading ? (
                Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <div key={i} className={cn('h-9 w-24 rounded-full bg-card', isMotionEnabled && 'animate-pulse')} />
                  ))
              ) : stats ? (
                <>
                  <StatChip
                    icon={Star}
                    label={stats.stargazers_count.toLocaleString()}
                    suffix={t('project_page.stats_stars')}
                  />
                  <StatChip
                    icon={GitFork}
                    label={stats.forks_count.toLocaleString()}
                    suffix={t('project_page.stats_forks')}
                  />
                  <StatChip
                    icon={CircleDot}
                    label={stats.open_issues_count.toLocaleString()}
                    suffix={t('project_page.stats_issues')}
                  />
                  {stats.language && <span className="section-badge">{stats.language}</span>}
                </>
              ) : null}
            </div>
          )}

          {/* Screenshots */}
          {project.screenshots.length > 0 && (
            <div className="mt-16 flex flex-col gap-6">
              {project.screenshots.map((screenshot, index) => (
                <Reveal key={screenshot.id}>
                  <img
                    src={screenshot.url}
                    alt={screenshot.alt ?? `${project.name} screenshot ${index + 1}`}
                    width={SCREENSHOT_WIDTH_PX}
                    height={SCREENSHOT_HEIGHT_PX}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="aspect-video w-full rounded-2xl border border-border/60 bg-card object-cover"
                  />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <section className="lg:col-span-2" aria-labelledby="project-about">
              <h2 id="project-about" className={`mb-4 ${MONO_LABEL_CLASS}`}>
                {t('project_page.about')}
              </h2>
              <p className="text-lg leading-relaxed text-foreground/90">{project.description}</p>
            </section>

            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className={`mb-4 ${MONO_LABEL_CLASS}`}>{t('project_page.tech_stack')}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="rounded-full px-3 py-1 text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-5">
                <h3 className={`mb-4 ${MONO_LABEL_CLASS}`}>{t('project_page.links')}</h3>
                <div className="flex flex-col gap-3">
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary ${FOCUS_CLASS}`}
                    >
                      <Github className="h-4 w-4 shrink-0" aria-hidden />
                      <span className="truncate">
                        {project.repositoryOwner}/{project.repositoryName}
                      </span>
                      <ExternalLink
                        className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden
                      />
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a
                      href={project.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary ${FOCUS_CLASS}`}
                    >
                      <Globe className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t('project_page.live_demo')}</span>
                      <ExternalLink
                        className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden
                      />
                    </a>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function StatChip({ icon: Icon, label, suffix }: { icon: LucideIcon; label: string; suffix: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
      <span className="font-semibold text-foreground">{label}</span>
      <span>{suffix}</span>
    </div>
  );
}

export default Project;
