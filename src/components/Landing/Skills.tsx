"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Layout, Terminal, Workflow } from "lucide-react"

const skillCategories = [
    {
        icon: Code,
        title: "Frontend",
        skills: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    },
    {
        icon: Server,
        title: "Backend",
        skills: ["PHP", "Slim Framework", "Node.js", "REST APIs"],
    },
    {
        icon: Database,
        title: "Database",
        skills: ["MySQL", "MongoDB", "Redis", "Elasticsearch"],
    },
    {
        icon: Terminal,
        title: "DevOps",
        skills: ["Docker", "Git", "GitHub", "Linux"],
    },
    {
        icon: Layout,
        title: "Design",
        skills: ["Figma", "shadcn/ui", "UI/UX Principles"],
    },
    {
        icon: Workflow,
        title: "Methodology",
        skills: ["Agile", "Scrum", "Clean Code"],
    },
]

export default function Skills() {
    return (
        <section id="skills" className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <span className="section-badge mb-8 inline-flex">Skills</span>
                    <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                        What I work with
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="group rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/50"
                        >
                            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors">
                                <category.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="mb-4 text-base font-bold text-foreground">{category.title}</h3>
                            <div className="flex flex-wrap gap-2">
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
