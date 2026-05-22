"use client"

import { motion } from "framer-motion"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

const socials = [
    { icon: Github, href: "https://github.com/luka-lta", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/luka-liebenthal-aa047931b/", label: "LinkedIn" },
    { icon: Mail, href: "mailto:info@luka-lta.dev", label: "Email" },
]

export default function Hero() {
    const { t } = useTranslation()

    return (
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
            {/* Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />
            {/* Noise texture */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px",
                }}
            />
            {/* Gradient orbs */}
            <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[130px]" />
            <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
                {/* Availability badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/70 px-5 py-2 text-sm text-muted-foreground backdrop-blur-sm"
                >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    {t('hero.available')}
                </motion.div>

                {/* Main headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-8 text-8xl font-black leading-none tracking-tight md:text-[10rem]"
                >
                    <span className="block text-foreground">Luka</span>
                    <span className="block gradient-text">Liebenthal</span>
                </motion.h1>

                {/* Role line */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mx-auto mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground"
                >
                    {t('hero.role')}
                </motion.p>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground"
                >
                    {t('hero.description')}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mb-14 flex flex-wrap items-center justify-center gap-4"
                >
                    <Button asChild size="lg" className="gap-2 rounded-full px-8 font-semibold">
                        <a href="#contact">
                            {t('hero.cta_contact')}
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
                        <a href="#projects">{t('hero.cta_projects')}</a>
                    </Button>
                </motion.div>

                {/* Socials */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex justify-center gap-3"
                >
                    {socials.map((social) => (
                        <motion.a
                            key={social.href}
                            href={social.href}
                            aria-label={social.label}
                            target={social.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                        >
                            <social.icon className="h-5 w-5" />
                        </motion.a>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
