"use client"

import { useState, useEffect, Fragment } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/assets/providers/ThemeProvider"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { MoonIcon, SunIcon, Menu, X } from "lucide-react"
import { LdsIcon } from "@/components/SiteLogo"
import { useTranslation } from "react-i18next"

function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const currentLang = i18n.language.slice(0, 2)

    const change = (lang: string) => {
        i18n.changeLanguage(lang)
        localStorage.setItem('i18n-lang', lang)
    }

    return (
        <div className="flex items-center rounded-full border border-border/60 bg-card px-1">
            {(['de', 'en'] as const).map((lang, idx) => (
                <Fragment key={lang}>
                    {idx > 0 && <span className="h-3 w-px bg-border/60" />}
                    <button
                        onClick={() => change(lang)}
                        aria-label={`Switch to ${lang.toUpperCase()}`}
                        className={`rounded-full px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                            currentLang === lang
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {lang.toUpperCase()}
                    </button>
                </Fragment>
            ))}
        </div>
    )
}

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => setMounted(true), [])

    const scrollToSection = (id: string) => {
        setMobileOpen(false)
        if (location.pathname === '/') {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        } else {
            navigate('/')
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
            }, 150)
        }
    }

    const navLinks = [
        { name: t('nav.about'),    anchor: "about" },
        { name: t('nav.services'), anchor: "services" },
        { name: t('nav.projects'), anchor: "projects" },
        { name: t('nav.skills'),   anchor: "skills" },
        { name: t('nav.contact'),  anchor: "contact" },
        { name: t('nav.links'),    to: "/links" },
        { name: t('nav.status'),   to: "https://status.luka-lta.dev", external: true },
    ]

    return (
        <motion.header
            className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-foreground">
                    <LdsIcon className="h-6 w-6 rounded-md" />
                    <span className="text-sm font-bold tracking-tight">Luka Dev Studio</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        'anchor' in link ? (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.anchor!)}
                                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                {link.name}
                            </button>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.to!}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {mounted && <LanguageSwitcher />}

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            aria-label="Toggle theme"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            {theme === "dark"
                                ? <SunIcon className="h-4 w-4" />
                                : <MoonIcon className="h-4 w-4" />}
                        </button>
                    )}

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary md:hidden"
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border/40 bg-background md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-6 py-4">
                            {navLinks.map((link) => (
                                'anchor' in link ? (
                                    <button
                                        key={link.name}
                                        onClick={() => scrollToSection(link.anchor!)}
                                        className="rounded-xl px-4 py-2.5 text-start text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.name}
                                        to={link.to!}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        onClick={() => setMobileOpen(false)}
                                        className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
