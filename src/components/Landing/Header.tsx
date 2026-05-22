"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/assets/providers/ThemeProvider"
import { Link } from "react-router-dom"
import { MoonIcon, Origami, SunIcon, Menu, X } from "lucide-react"

const navLinks = [
    { name: "About", to: "/#about" },
    { name: "Projects", to: "/#projects" },
    { name: "Contact", to: "/#contact" },
    { name: "Links", to: "/links" },
    { name: "Status", to: "https://status.luka-lta.dev", external: true },
]

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])

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
                    <Origami className="h-6 w-6 text-primary" />
                    <span className="text-sm font-bold tracking-tight">luka-lta.dev</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
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
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    target={link.external ? "_blank" : undefined}
                                    rel={link.external ? "noopener noreferrer" : undefined}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
