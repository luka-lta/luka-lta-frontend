"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/assets/providers/ThemeProvider"
import { Link } from "react-router-dom"
import { MoonIcon, Origami, SunIcon, Menu, X } from "lucide-react"

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    const navLinks = [
        { name: "About", to: "/#about" },
        { name: "Contact", to: "/#contact" },
        { name: "Links", to: "/links" },
        { name: "Status", to: "https://status.luka-lta.dev", external: true },
    ]

    return (
        <motion.header
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">

                {/* Logo */}
                <div className="flex flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">luka-lta.dev</span>
                        <Origami className="h-8 w-auto" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-x-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.to}
                            target={link.external ? "_blank" : undefined}
                            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-4 flex-1 justify-end">

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            className="rounded-full p-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            {theme === "dark"
                                ? <SunIcon className="h-5 w-5" />
                                : <MoonIcon className="h-5 w-5" />}
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border bg-background"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.to}
                                    target={link.external ? "_blank" : undefined}
                                    onClick={() => setMobileOpen(false)}
                                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
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