"use client"

import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

export default function About() {
    const { t } = useTranslation()

    const stats = [
        { value: "3+", label: t('about.stat_experience') },
        { value: "10+", label: t('about.stat_projects') },
        { value: "15+", label: t('about.stat_technologies') },
    ]

    return (
        <section id="about" className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Stats bar — horizontal, amber numbers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 grid grid-cols-3 divide-x divide-border/60 rounded-2xl border border-border/60 bg-card"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + i * 0.1 }}
                            className="flex flex-col items-center py-8 px-6 text-center"
                        >
                            <span className="text-4xl font-black gradient-text md:text-5xl">
                                {stat.value}
                            </span>
                            <span className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                {stat.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Content grid */}
                <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-24">

                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="mb-5 font-mono text-xs text-muted-foreground/50">— 01</p>
                        <h2 className="mb-6 text-4xl font-black leading-tight tracking-tight md:text-5xl">
                            {t('about.headline_1')}<br />
                            <span className="gradient-text">{t('about.headline_2')}</span>
                        </h2>
                        <p className="text-base leading-relaxed text-muted-foreground">
                            {t('about.body')}
                        </p>
                    </motion.div>

                    {/* Right: Highlight cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {[
                            {
                                title: "Full-Stack",
                                body: "Frontend to backend — React, TypeScript, PHP, Node.js, databases. No handoffs needed.",
                            },
                            {
                                title: "Ships fast",
                                body: "From idea to deployed product. I move quickly without cutting corners on quality.",
                            },
                            {
                                title: "Client-first",
                                body: "Direct communication, no agency overhead. You talk to the developer building your product.",
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="group rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40"
                            >
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                                <p className="pl-3.5 text-sm text-muted-foreground">{item.body}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
