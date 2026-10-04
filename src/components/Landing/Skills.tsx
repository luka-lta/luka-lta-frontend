"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Layout, Terminal, Workflow } from "lucide-react"
import { useTranslation } from "react-i18next"

const skillCategories = [
    {
        icon: Code,
        titleKey: 'skills.frontend',
        featured: true,
        skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
    },
    {
        icon: Server,
        titleKey: 'skills.backend',
        skills: ["PHP", "Slim Framework", "Node.js", "REST APIs"],
    },
    {
        icon: Database,
        titleKey: 'skills.database',
        skills: ["MySQL", "MongoDB", "Redis", "Elasticsearch"],
    },
    {
        icon: Terminal,
        titleKey: 'skills.devops',
        skills: ["Docker", "Git", "GitHub", "Linux"],
    },
    {
        icon: Layout,
        titleKey: 'skills.design',
        skills: ["Figma", "UI/UX Principles"],
    },
    {
        icon: Workflow,
        titleKey: 'skills.methodology',
        skills: ["Agile", "Scrum", "Clean Code"],
    },
]

export default function Skills() {
    const { t } = useTranslation()

    const [featured, ...rest] = skillCategories

    return (
        <section id="skills" className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <p className="mb-5 font-mono text-xs text-muted-foreground/50">— 03</p>
                    <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                        {t('skills.headline')}
                    </h2>
                </motion.div>

                {/* Bento grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    {/* Featured card — Frontend, spans 2 columns */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-colors hover:border-primary/40 md:col-span-2"
                    >
                        {/* Amber glow on hover */}
                        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/[0.06] blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative z-10">
                            <div className="mb-6 flex items-start justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/60 bg-background transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                                    <featured.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
                                    Primary
                                </span>
                            </div>

                            <h3 className="mb-2 text-xl font-bold text-foreground">
                                {t(featured.titleKey)}
                            </h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Building fast, accessible web interfaces with modern tooling.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {featured.skills.map((skill, i) => (
                                    <span
                                        key={skill}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                                            i === 0
                                                ? 'border border-[hsl(var(--teal))]/30 bg-[hsl(var(--teal))]/10 text-[hsl(var(--teal))]'
                                                : 'border border-border/60 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground'
                                        }`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Regular cards — 1 column each */}
                    {rest.map((category, index) => (
                        <motion.div
                            key={category.titleKey}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (index + 1) * 0.07 }}
                            className="group rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
                        >
                            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                                <category.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                            </div>

                            <h3 className="mb-4 text-sm font-bold text-foreground">
                                {t(category.titleKey)}
                            </h3>

                            <div className="flex flex-wrap gap-1.5">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="rounded-md border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
