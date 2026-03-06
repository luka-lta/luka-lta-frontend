import {motion} from "framer-motion";
import {ArrowLeft, CircleDot, ExternalLink, GitFork, Github, Globe, LucideIcon, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import Header from "@/components/Landing/Header.tsx";
import Footer from "@/components/Landing/Footer.tsx";
import {Separator} from "@radix-ui/react-separator";
import {Card, CardContent} from "@/components/ui/card";
import {useNavigate, useParams} from "react-router-dom";
import {projects} from "@/lib/projects-data.ts";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import ScrollToTop from "@/components/scroll-to-top.tsx";
import {useGithubStats} from "@/api/github/hooks/useGithubStats.ts";

function RepoStat({ icon: Icon, label, value }: { icon: LucideIcon, label: string, value: string }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-4" />
                {label}
            </span>
            <span className="font-medium text-foreground tabular-nums">
                {value}
            </span>
        </div>
    );
}


function Project() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();

    const project = projects.find((p) => p.id === projectId);
    const { data, isLoading } = useGithubStats(project?.repoOwner ?? "", project?.repoName ?? "");

    if (!project) {
        return (
            <div className="flex items-center justify-center h-screen text-muted-foreground">
                Project not found
            </div>
        );
    }

    return (
        <>
            <ScrollToTop />
            <Header />
            <motion.div
                key={project.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-8 mx-auto max-w-5xl px-4 py-12 md:px-6 lg:px-1"
            >
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="text-muted-foreground hover:text-foreground -ml-2"
                    >
                        <ArrowLeft className="mr-1.5 size-4" />
                        Back to home
                    </Button>
                </motion.div>

                {/* Hero Screenshot */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="relative aspect-video w-full rounded-xl border border-border/50"
                >
                    <Carousel>
                        <CarouselContent>
                            {project.screenshots.map((screenshot, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex items-center justify-center p-6">
                                                <img
                                                    src={screenshot}
                                                    alt={`${project.title} screenshot ${index + 1}`}
                                                    className="object-cover"
                                                />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                </motion.div>

                {/* Title + Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
                >
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
                            {project.title}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <span>{project.role}</span>
                            <span className="text-border">{"/"}</span>
                            <span>{project.year}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-border text-foreground hover:bg-secondary"
                            asChild
                        >
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="mr-1.5 size-4" />
                                Repository
                            </a>
                        </Button>
                        <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            asChild
                        >
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Globe className="mr-1.5 size-4" />
                                Live Demo
                            </a>
                        </Button>
                    </div>
                </motion.div>

                <Separator className="bg-border/50" />

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                            About
                        </h2>
                        <p className="leading-relaxed text-foreground/90">
                            {project.longDescription}
                        </p>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Tech Stack */}
                        <Card className="border-border/50 bg-card">
                            <CardContent className="pt-6">
                                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech, i) => (
                                        <motion.div
                                            key={tech}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + i * 0.05 }}
                                        >
                                            <Badge
                                                variant="secondary"
                                                className="bg-secondary text-secondary-foreground"
                                            >
                                                {tech}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* GitHub Stats */}
                        <Card className="border-border/50 bg-card">
                            <CardContent className="pt-6">
                                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Repository Stats
                                </h3>
                                {isLoading ? (
                                    <div className="flex flex-col gap-3">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <span className="h-4 w-16 animate-pulse rounded bg-muted" />
                                                <span className="h-4 w-10 animate-pulse rounded bg-muted" />
                                            </div>
                                        ))}
                                    </div>
                                ) : data ? (
                                    <div className="flex flex-col gap-3">
                                        <RepoStat
                                            icon={Star}
                                            label="Stars"
                                            value={data.stargazers_count.toLocaleString()}
                                        />
                                        <Separator className="bg-border/30" />

                                        <RepoStat
                                            icon={GitFork}
                                            label="Forks"
                                            value={data.forks_count.toLocaleString()}
                                        />
                                        <Separator className="bg-border/30" />

                                        <RepoStat
                                            icon={CircleDot}
                                            label="Open Issues"
                                            value={data.open_issues_count.toLocaleString()}
                                        />
                                        {data.language && (
                                            <>
                                                <Separator className="bg-border/30" />
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                      Language
                                                    </span>
                                                    <Badge
                                                        variant="outline"
                                                        className="text-foreground border-border"
                                                    >
                                                        {data.language}
                                                    </Badge>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Stats unavailable
                                    </p>

                                )}

                            </CardContent>
                        </Card>

                        {/* Links */}
                        <Card className="border-border/50 bg-card">
                            <CardContent className="pt-6">
                                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                                    Links
                                </h3>
                                <div className="flex flex-col gap-2">
                                    <a
                                        href={project.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <Github className="size-4" />
                                        <span>{project.repoOwner}/{project.repoName}</span>
                                        <ExternalLink className="ml-auto size-3" />
                                    </a>
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <Globe className="size-4" />
                                        <span>Live Demo</span>
                                        <ExternalLink className="ml-auto size-3" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
            <Footer />
        </>
    );
}

export default Project;