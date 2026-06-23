import { motion } from "framer-motion"
import { ArrowLeft, CircleDot, ExternalLink, GitFork, Github, Globe, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Header from "@/components/Landing/Header"
import Footer from "@/components/Landing/Footer"
import { useNavigate, useParams } from "react-router-dom"
import { projects } from "@/lib/projects-data"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import ScrollToTop from "@/components/scroll-to-top"
import { useGithubStats } from "@/api/github/hooks/useGithubStats"
import { useTranslation } from "react-i18next"
import SEO from "@/components/SEO"

function Project() {
    const { projectId } = useParams<{ projectId: string }>()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const project = projects.find((p) => p.id === projectId)

    const { data: stats, isLoading: statsLoading } = useGithubStats(
        project?.repoOwner ?? "",
        project?.repoName ?? ""
    )

    if (!project) {
        return (
            <>
                <SEO title={t('project_page.not_found')} canonicalPath={`/project/${projectId}`} />
                <Header />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-background">
                    <p className="text-xl font-bold text-foreground">{t('project_page.not_found')}</p>
                    <Button variant="outline" onClick={() => navigate("/")}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> {t('project_page.back')}
                    </Button>
                </div>
                <Footer />
            </>
        )
    }

    return (
        <>
            <SEO
                title={project.title}
                description={project.longDescription}
                canonicalPath={`/project/${project.id}`}
            />
            <ScrollToTop />
            <Header />

            <div className="relative min-h-screen bg-background">
                {/* Background */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
                <div className="pointer-events-none absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />

                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:px-8"
                >
                    {/* Back */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="gap-1.5 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {t('project_page.back')}
                        </Button>
                    </motion.div>

                    {/* Screenshot carousel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="mb-10 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl"
                    >
                        <Carousel>
                            <CarouselContent>
                                {project.screenshots.map((screenshot, index) => (
                                    <CarouselItem key={index}>
                                        <div className="aspect-video w-full overflow-hidden bg-card">
                                            <img
                                                src={screenshot}
                                                alt={`${project.title} screenshot ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {project.screenshots.length > 1 && (
                                <>
                                    <CarouselPrevious className="left-4" />
                                    <CarouselNext className="right-4" />
                                </>
                            )}
                        </Carousel>
                    </motion.div>

                    {/* Title row */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
                    >
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="section-badge">{project.role}</span>
                                <span className="section-badge">{project.year}</span>
                                {project.clientProject && (
                                    <span className="section-badge">{t('project_page.client_project')}</span>
                                )}
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                                {project.title}
                            </h1>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            {project.repoUrl && (
                                <Button variant="outline" className="gap-2 rounded-full" asChild>
                                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                                        <Github className="h-4 w-4" />
                                        {t('project_page.repository')}
                                    </a>
                                </Button>
                            )}
                            <Button className="gap-2 rounded-full" asChild>
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                    <Globe className="h-4 w-4" />
                                    {project.liveLabel ?? t('project_page.live_demo')}
                                </a>
                            </Button>
                        </div>
                    </motion.div>

                    {/* GitHub stat chips */}
                    {!project.clientProject && (stats || statsLoading) && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="mb-10 flex flex-wrap gap-3"
                        >
                            {statsLoading ? (
                                Array(3).fill(null).map((_, i) => (
                                    <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-card" />
                                ))
                            ) : stats ? (
                                <>
                                    <StatChip icon={Star} label={stats.stargazers_count.toLocaleString()} suffix={t('project_page.stats_stars')} />
                                    <StatChip icon={GitFork} label={stats.forks_count.toLocaleString()} suffix={t('project_page.stats_forks')} />
                                    <StatChip icon={CircleDot} label={stats.open_issues_count.toLocaleString()} suffix={t('project_page.stats_issues')} />
                                    {stats.language && (
                                        <span className="section-badge">{stats.language}</span>
                                    )}
                                </>
                            ) : null}
                        </motion.div>
                    )}

                    {/* Main grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                {t('project_page.about')}
                            </h2>
                            <p className="text-lg leading-relaxed text-foreground/90">
                                {project.longDescription}
                            </p>
                        </motion.div>

                        {/* Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Tech Stack */}
                            <div className="rounded-2xl border border-border/60 bg-card p-5">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    {t('project_page.tech_stack')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="secondary"
                                            className="rounded-full px-3 py-1 text-xs"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            <div className="rounded-2xl border border-border/60 bg-card p-5">
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                    {t('project_page.links')}
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                        >
                                            <Github className="h-4 w-4 shrink-0" />
                                            <span className="truncate">{project.repoOwner}/{project.repoName}</span>
                                            <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                        </a>
                                    )}
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                                    >
                                        <Globe className="h-4 w-4 shrink-0" />
                                        <span>{t('project_page.live_demo')}</span>
                                        <ExternalLink className="ml-auto h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </>
    )
}

function StatChip({ icon: Icon, label, suffix }: { icon: React.ElementType; label: string; suffix: string }) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-muted-foreground">
            <Icon className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-foreground">{label}</span>
            <span>{suffix}</span>
        </div>
    )
}

export default Project
