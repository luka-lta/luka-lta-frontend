import {useRef} from 'react';
import {motion, useScroll, useTransform} from "framer-motion";
import {ArrowRight, BarChart3, Cpu, Database, Lock, Smartphone} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FeatureItem, FeatureItemProps} from "@/components/feature-item.tsx";
import Header from "@/components/Landing/Header.tsx";
import Footer from "@/components/Landing/Footer.tsx";

const featuresData: FeatureItemProps[] = [
    {
        title: "Responsive",
        description: "Looks great on any device",
        icon: <Smartphone className="h-5 w-5" />,
        color: "bg-pink-500/90 dark:bg-pink-600/90",
        position: "left-[2%] top-[10%] sm:left-[5%] md:top-[20%]",
        delay: 0.1,
    },
    {
        title: "Secure",
        description: "Built with security in mind",
        icon: <Lock className="h-5 w-5" />,
        color: "bg-violet-500/90 dark:bg-violet-600/90",
        position: "right-[2%] top-[25%] sm:right-[5%] md:top-[15%]",
        delay: 0.2,
    },
    {
        title: "Fast",
        description: "Optimized for performance",
        icon: <Cpu className="h-5 w-5" />,
        color: "bg-blue-500/90 dark:bg-blue-600/90",
        position: "left-[2%] bottom-[25%] sm:left-[15%] md:bottom-[20%]",
        delay: 0.3,
    },
    {
        title: "Data-Driven",
        description: "Seamless data integration",
        icon: <Database className="h-5 w-5" />,
        color: "bg-emerald-500/90 dark:bg-emerald-600/90",
        position: "right-[2%] bottom-[20%] sm:right-[5%] md:bottom-[25%]",
        delay: 0.4,
    },
    {
        title: "Analytics",
        description: "Built-in analytics support",
        icon: <BarChart3 className="h-5 w-5" />,
        color: "bg-amber-500/90 dark:bg-amber-600/90",
        position:
            "left-[50%] -translate-x-1/2 bottom-[-2%] md:bottom-[0%]",
        delay: 0.5,
    },
];

function Project() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

    return (
        <>
            <Header />

            <section
                ref={containerRef}
                className="relative overflow-hidden py-24 sm:py-32"
            >
                {/* Background blobs */}
                <motion.div
                    style={{ y: bgY1 }}
                    className="absolute -top-1/2 -left-1/3 w-[60%] h-[60%] rounded-full
                               bg-gradient-to-br from-primary/20 to-primary/5
                               blur-3xl opacity-70 dark:opacity-40"
                />
                <motion.div
                    style={{ y: bgY2 }}
                    className="absolute -bottom-1/2 -right-1/3 w-[60%] h-[60%] rounded-full
                               bg-gradient-to-tl from-secondary/20 to-secondary/5
                               blur-3xl opacity-70 dark:opacity-40"
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=20&width=20')]
                                bg-[length:20px_20px] opacity-[0.02] dark:opacity-[0.03]
                                pointer-events-none" />

                <div className="container relative z-10 px-4 md:px-6">
                    {/* Header */}
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="outline" className="mb-4">
                                Innovative Features
                            </Badge>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                                Cutting-Edge UI Components
                            </h2>

                            <p className="mt-4 text-muted-foreground md:text-xl">
                                Elevate your applications with beautifully designed,
                                interactive components.
                            </p>
                        </motion.div>
                    </div>

                    {/* Feature Area */}
                    <div className="relative">
                        {/* Center Element */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative z-20 mx-auto
                                       w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96
                                       rounded-full bg-gradient-to-br
                                       from-primary/20 via-primary/10 to-transparent
                                       flex items-center justify-center"
                        >
                            <div className="w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72
                                            rounded-full bg-background border
                                            shadow-lg backdrop-blur-sm
                                            flex items-center justify-center p-6">
                                <div className="text-center">
                                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                                        UI Library
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Modern, accessible, beautiful
                                    </p>
                                    <Button size="sm" className="group">
                                        Get Started
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mobile Grid */}
                        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:hidden">
                            {featuresData.map((feature, i) => (
                                <FeatureItem key={i} {...feature} position="static" />
                            ))}
                        </div>

                        {/* Desktop Floating */}
                        <div className="hidden md:block">
                            {featuresData.map((feature, i) => (
                                <FeatureItem key={i} {...feature} />
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-20 flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Button size="lg" variant="outline" className="group">
                                View Documentation
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Project;