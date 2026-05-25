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
                <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <span className="section-badge mb-8 inline-flex">{t('about.badge')}</span>
                        <h2 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-6xl">
                            {t('about.headline_1')}<br />{" "}
                            <span className="gradient-text">{t('about.headline_2')}</span>
                        </h2>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            {t('about.body')}
                        </p>
                    </motion.div>

                    {/* Right: Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1"
                    >
                        {stats.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
                            >
                                <div className="mb-1 text-5xl font-black gradient-text">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
