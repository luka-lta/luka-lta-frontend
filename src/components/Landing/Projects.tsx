import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, Github, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useProjects } from "@/api/projects/hooks/useProjects"
import type { Project } from "@/api/projects/schema"
import { useTranslation } from "react-i18next"
import { track } from "@/lib/analytics"

const INITIAL_VISIBLE = 2

interface CardProps {
    project: Project
    index: number
    featured?: boolean
}

function ProjectCard({ project, index, featured = false }: CardProps) {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const imageUrl = project.cover?.url ?? project.screenshots[0]?.url ?? null

    return (
        <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.07 }}
            whileHover={{ y: -5 }}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-background transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.2)] ${
                featured ? 'md:grid md:grid-cols-2' : ''
            }`}
            onClick={() => {
                track('project_click', { id: project.slug, title: project.name, featured })
                navigate(`/project/${project.slug}`)
            }}
            role="button"
            tabIndex={0}
            aria-label={`${t('projects.view_details')} — ${project.name}`}
            onKeyDown={(e) => e.key === "Enter" && navigate(`/project/${project.slug}`)}
        >
            {/* Screenshot */}
            <div className={`overflow-hidden bg-secondary ${featured ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
                {imageUrl && (
                    <motion.img
                        src={imageUrl}
                        alt={project.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                        style={{ '--tw-scale-x': 1.03, '--tw-scale-y': 1.03 } as React.CSSProperties}
                    />
                )}
            </div>

            {/* Content */}
            <div className={`p-6 ${featured ? 'md:flex md:flex-col md:justify-between md:p-10' : ''}`}>
                {/* Index + badges */}
                <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground/40">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-center gap-2">
                        {project.isClientProject && (
                            <span className="rounded-full border border-[hsl(var(--teal))]/30 bg-[hsl(var(--teal))]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[hsl(var(--teal))]">
                                Client
                            </span>
                        )}
                        {project.year && (
                            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                {project.year}
                            </span>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className={`mb-2 font-black tracking-tight text-foreground transition-colors group-hover:text-primary ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                        {project.name}
                    </h3>
                    {project.shortDescription && (
                        <p className={`mb-5 leading-relaxed text-muted-foreground ${featured ? 'text-base' : 'line-clamp-2 text-sm'}`}>
                            {project.shortDescription}
                        </p>
                    )}
                </div>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, featured ? 5 : 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-md text-[11px] font-normal">
                            {tag}
                        </Badge>
                    ))}
                    {project.techStack.length > (featured ? 5 : 3) && (
                        <Badge variant="secondary" className="rounded-md text-[11px] font-normal">
                            +{project.techStack.length - (featured ? 5 : 3)}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Hover actions */}
            <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100">
                {project.repositoryUrl && (
                    <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`${project.name} GitHub`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/90 text-muted-foreground backdrop-blur-sm transition-colors hover:text-primary"
                    >
                        <Github className="h-3.5 w-3.5" />
                    </a>
                )}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
            </div>
        </motion.article>
    )
}

function FeaturedCardSkeleton() {
    return (
        <div className="mb-4 animate-pulse overflow-hidden rounded-2xl border border-border/60 bg-background md:grid md:grid-cols-2">
            <div className="aspect-[16/10] bg-secondary md:aspect-auto" />
            <div className="p-6 md:flex md:flex-col md:justify-between md:p-10">
                <div className="mb-4 h-4 w-8 rounded bg-secondary" />
                <div>
                    <div className="mb-3 h-8 w-2/3 rounded bg-secondary" />
                    <div className="mb-5 h-16 w-full rounded bg-secondary" />
                </div>
                <div className="flex gap-1.5">
                    <div className="h-5 w-16 rounded bg-secondary" />
                    <div className="h-5 w-16 rounded bg-secondary" />
                </div>
            </div>
        </div>
    )
}

function CardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-border/60 bg-background">
            <div className="aspect-[16/10] bg-secondary" />
            <div className="p-6">
                <div className="mb-4 h-4 w-8 rounded bg-secondary" />
                <div className="mb-3 h-5 w-2/3 rounded bg-secondary" />
                <div className="mb-5 h-10 w-full rounded bg-secondary" />
                <div className="flex gap-1.5">
                    <div className="h-5 w-16 rounded bg-secondary" />
                    <div className="h-5 w-16 rounded bg-secondary" />
                </div>
            </div>
        </div>
    )
}

function Projects() {
    const { t } = useTranslation()
    const [showAll, setShowAll] = useState(false)
    const { data: projects, isLoading, isError } = useProjects()

    if (isLoading) {
        return (
            <section id="projects" className="bg-card py-24 md:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="mb-5 font-mono text-xs text-muted-foreground/50">— 02</p>
                            <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                                {t('projects.headline')}
                            </h2>
                        </div>
                    </div>
                    <FeaturedCardSkeleton />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CardSkeleton />
                        <CardSkeleton />
                    </div>
                </div>
            </section>
        )
    }

    // Kein Abschnitt statt einer leeren "0 Projekte"-Flaeche — gilt auch fuer
    // den Fehlerfall, das ist eine Marketing-Seite und kein Dashboard.
    if (isError || !projects || projects.length === 0) {
        return null
    }

    const [featured, ...rest] = projects
    const visibleRest = showAll ? rest : rest.slice(0, INITIAL_VISIBLE)
    const hiddenCount = rest.length - INITIAL_VISIBLE

    return (
        <section id="projects" className="bg-card py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                >
                    <div>
                        <p className="mb-5 font-mono text-xs text-muted-foreground/50">— 02</p>
                        <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                            {t('projects.headline')}
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm text-muted-foreground md:text-right">
                        {projects.length} Projekte — von Client-Arbeit bis Open Source
                    </p>
                </motion.div>

                {/* Featured first project */}
                <div className="mb-4">
                    <ProjectCard project={featured} index={0} featured />
                </div>

                {/* Remaining projects: 2-col grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <AnimatePresence initial={false}>
                        {visibleRest.map((project, index) => (
                            <motion.div
                                key={project.slug}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 12 }}
                                transition={{ duration: 0.45, delay: index * 0.06 }}
                            >
                                <ProjectCard project={project} index={index + 1} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Show more / show less */}
                {hiddenCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-8 flex justify-center"
                    >
                        <button
                            onClick={() => {
                                setShowAll((v) => !v)
                                track('projects_toggle', { action: showAll ? 'collapse' : 'expand' })
                            }}
                            className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
                        >
                            {showAll ? (
                                <>
                                    Weniger anzeigen
                                    <ChevronDown className="h-4 w-4 rotate-180 transition-transform duration-300" />
                                </>
                            ) : (
                                <>
                                    {hiddenCount} weitere Projekte
                                    <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

export default Projects
