"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

const socials = [
    { icon: Github, href: "https://github.com/luka-lta", label: "GitHub", platform: "github" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/luka-liebenthal-aa047931b/", label: "LinkedIn", platform: "linkedin" },
    { icon: Mail, href: "mailto:info@luka-lta.dev", label: "Email", platform: "email" },
]

const ease = [0.16, 1, 0.3, 1] as const

export default function Hero() {
    const { t } = useTranslation()
    const reduced = useReducedMotion()

    const fadeUp = (delay: number) => ({
        initial: { opacity: 0, y: reduced ? 0 : 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, delay, ease },
    })

    return (
        <section className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-background pb-10 pt-28 lg:pt-36">

            {/* Subtle top-right corner accent — single, intentional */}
            <div className="pointer-events-none absolute right-0 top-0 h-px w-64 bg-gradient-to-l from-primary/40 to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-px bg-gradient-to-b from-primary/40 to-transparent" />

            {/* Film grain */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.032]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px",
                }}
            />

            {/* Main content */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">

                {/* Availability badge */}
                <motion.div
                    {...fadeUp(0)}
                    className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm"
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--teal))]" />
                    {t('hero.available')}
                </motion.div>

                {/* Editorial name — left-aligned, huge */}
                <div className="overflow-hidden">
                    <motion.h1 className="select-none leading-[0.88] tracking-tighter">
                        <motion.span
                            initial={{ opacity: 0, y: reduced ? 0 : 70 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.1, ease }}
                            className="block text-[clamp(3.5rem,11.5vw,10.5rem)] font-black text-foreground"
                        >
                            LUKA
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: reduced ? 0 : 70 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.22, ease }}
                            className="block text-[clamp(3.5rem,11.5vw,10.5rem)] font-black gradient-text"
                        >
                            LIEBENTHAL
                        </motion.span>
                    </motion.h1>
                </div>

                {/* Animated amber divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.1, delay: 0.48, ease }}
                    style={{ transformOrigin: "left" }}
                    className="my-8 h-px w-full bg-gradient-to-r from-primary via-primary/40 to-transparent lg:my-10"
                />

                {/* Role + CTAs row */}
                <motion.div
                    {...fadeUp(0.65)}
                    className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
                >
                    <div className="max-w-md">
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.25em] text-primary">
                            Full-Stack Developer · Dev Studio
                        </p>
                        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                            {t('hero.description')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button asChild size="lg" className="gap-2 rounded-full px-7 font-semibold">
                            <a
                                href="#contact"
                                data-flowtix-event="cta_click"
                                data-flowtix-prop-type="contact"
                                data-flowtix-prop-source="hero"
                            >
                                {t('hero.cta_contact')}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-full px-7 font-semibold border-border/60 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                        >
                            <a
                                href="#projects"
                                data-flowtix-event="cta_click"
                                data-flowtix-prop-type="projects"
                                data-flowtix-prop-source="hero"
                            >
                                {t('hero.cta_projects')}
                            </a>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Bottom bar: socials + location + scroll */}
            <motion.div
                {...fadeUp(0.9)}
                className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-6 lg:px-8"
            >
                <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-6">
                    {/* Left: location */}
                    <p className="font-mono text-xs text-muted-foreground/50">
                        Hameln , DE
                    </p>

                    {/* Center: tagline */}
                    <p className="hidden text-sm font-medium italic text-muted-foreground md:block">
                        "Your idea, shipped."
                    </p>

                    {/* Right: socials */}
                    <div className="flex gap-2">
                        {socials.map((social) => (
                            <motion.a
                                key={social.href}
                                href={social.href}
                                aria-label={social.label}
                                target={social.href.startsWith("http") ? "_blank" : undefined}
                                rel="noopener noreferrer"
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 text-muted-foreground/60 transition-colors hover:border-primary/50 hover:text-primary"
                                data-flowtix-event="social_click"
                                data-flowtix-prop-platform={social.platform}
                                data-flowtix-prop-source="hero"
                            >
                                <social.icon className="h-3.5 w-3.5" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    )
}