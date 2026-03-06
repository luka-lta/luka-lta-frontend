import { motion, Variants } from "framer-motion";
import {Github} from "lucide-react";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {useNavigate} from "react-router-dom";
import {projects} from "@/lib/projects-data.ts";

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const item: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

function Projects() {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden py-24 sm:py-32">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-gradient-radial from-primary/20 via-primary/5 to-transparent blur-3xl"
            />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-2xl text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-12 text-center dark:text-white">My Projects</h2>
                </motion.div>


                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 gap-12 "
                >
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                    >
                        <CarouselContent>
                            {projects.map((project) => (
                                <CarouselItem key={project.id} className="md:basis-1/2 lg:basis-1/3">
                                    <motion.div
                                        variants={item}
                                        whileHover={{ y: -10 }}
                                        className="relative group"
                                    >
                                        <div
                                            className="relative aspect-square overflow-hidden rounded-2xl bg-card cursor-pointer"
                                            onClick={() => navigate(`/project/${project.id}`)}
                                            role="button"
                                            aria-label={`View ${project.title} project details`}
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
                                        >
                                            <motion.img
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.4 }}
                                                src={project.screenshots[0]}
                                                alt={project.title}
                                                className="h-full w-full object-cover transition-transform duration-300"
                                            />
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileHover={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end"
                                            >
                                                <div className="translate-y-4 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                    <p className="text-sm text-white/80">{project.description}</p>
                                                    <div className="mt-4 flex gap-3">
                                                        <a
                                                            href={project.repoUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-white/80 hover:text-white"
                                                            aria-label={`${project.title} GitHub repository`}
                                                        >
                                                            <Github className="h-5 w-5" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold">{project.title}</h3>
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
        </div>
    );
}

export default Projects;
