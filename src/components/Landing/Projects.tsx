import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { projects } from "@/lib/projects-data"
import { useTranslation } from "react-i18next"

function Projects() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <section id="projects" className="bg-card py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <span className="section-badge mb-8 inline-flex">{t('projects.badge')}</span>
                    <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                        {t('projects.headline')}
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <Carousel opts={{ align: "start" }}>
                        <CarouselContent>
                            {projects.map((project, index) => (
                                <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -6 }}
                                        className="group"
                                    >
                                        <div
                                            className="relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card"
                                            onClick={() => navigate(`/project/${project.id}`)}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`${t('projects.view_details')} — ${project.title}`}
                                            onKeyDown={(e) => e.key === "Enter" && navigate(`/project/${project.id}`)}
                                        >
                                            <motion.img
                                                whileHover={{ scale: 1.08 }}
                                                transition={{ duration: 0.5 }}
                                                src={project.screenshots[0]}
                                                alt={project.title}
                                                className="h-full w-full object-cover"
                                            />
                                            {/* Overlay */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-6"
                                            >
                                                <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                    <p className="text-sm text-white/80">{project.description}</p>
                                                    <div className="mt-4 flex gap-3">
                                                        <a
                                                            href={project.repoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            aria-label={`${project.title} GitHub repository`}
                                                            className="text-white/70 hover:text-white transition-colors"
                                                        >
                                                            <Github className="h-5 w-5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        <div className="mt-4 mb-2">
                                            <h3 className="text-lg font-bold text-foreground">{project.title}</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </motion.div>
            </div>
        </section>
    )
}

export default Projects
