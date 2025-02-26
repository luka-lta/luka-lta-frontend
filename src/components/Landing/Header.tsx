"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/assets/providers/ThemeProvider"
import {Link} from "react-router-dom";
import {MoonIcon, Origami, SunIcon} from "lucide-react";

export default function Header() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => setMounted(true), [])

    return (
        <motion.header
            className="sticky top-0 z-50 bg-background/80 backdrop-blur-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link to="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">luka-lta.dev</span>
                        <Origami
                            className="h-8 w-auto"
                        />
                    </Link>
                </div>
                <div className="flex gap-x-12">
                    <Link
                        to="/#about"
                        className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        to="/#contact"
                        className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        to="/links"
                        className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                    >
                        Links
                    </Link>
                </div>
                <div className="flex flex-1 justify-end">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full p-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                        </button>
                    )}
                </div>
            </nav>
        </motion.header>
    )
}

