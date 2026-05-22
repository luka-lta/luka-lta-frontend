"use client"

import { motion } from "framer-motion"
import { Globe, Wrench, CheckCircle2, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

const serviceIcons = {
    websites: Globe,
    maintenance: Wrench,
} as const

type ServiceKey = keyof typeof serviceIcons

export default function Services() {
    const { t } = useTranslation()

    const services: ServiceKey[] = ['websites', 'maintenance']

    return (
        <section id="services" className="bg-background py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center"
                >
                    <span className="section-badge mb-8 inline-flex">{t('services.badge')}</span>
                    <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                        {t('services.headline')}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        {t('services.subheadline')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {services.map((key, index) => {
                        const Icon = serviceIcons[key]
                        const bullets = t(`services.${key}.bullets`, { returnObjects: true }) as string[]

                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                whileHover={{ y: -4 }}
                                className="group flex flex-col rounded-2xl border border-border/60 bg-card p-8 transition-colors hover:border-primary/50"
                            >
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-background transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                                    <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                                </div>

                                <h3 className="mb-3 text-xl font-bold text-foreground">
                                    {t(`services.${key}.title`)}
                                </h3>
                                <p className="mb-6 text-muted-foreground">
                                    {t(`services.${key}.description`)}
                                </p>

                                <ul className="mb-8 flex-1 space-y-3">
                                    {bullets.map((bullet) => (
                                        <li key={bullet} className="flex items-start gap-3 text-sm text-muted-foreground">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>

                                <Button asChild className="mt-auto w-full gap-2 rounded-full">
                                    <a href="#contact">
                                        {t('services.cta')}
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </Button>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
