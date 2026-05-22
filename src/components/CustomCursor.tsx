"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const [isHover, setIsHover] = useState(false)

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

    useEffect(() => {
        if (prefersReducedMotion) return

        document.body.style.cursor = "none"

        const update = (e: MouseEvent) => {
            setPos({ x: e.clientX, y: e.clientY })
            const target = e.target as HTMLElement
            setIsHover(!!target.closest('a, button, [role="button"], [tabindex="0"]'))
        }

        window.addEventListener("mousemove", update)
        return () => {
            window.removeEventListener("mousemove", update)
            document.body.style.cursor = ""
        }
    }, [prefersReducedMotion])

    if (prefersReducedMotion) return null

    return (
        <>
            {/* Dot — snappy */}
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
                animate={{ x: pos.x - 5, y: pos.y - 5 }}
                transition={{ type: "spring", stiffness: 800, damping: 40 }}
            >
                <motion.div
                    className="rounded-full bg-white"
                    animate={{
                        width: isHover ? 0 : 10,
                        height: isHover ? 0 : 10,
                        opacity: isHover ? 0 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                />
            </motion.div>

            {/* Ring — lags */}
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[9998] mix-blend-difference"
                animate={{ x: pos.x - 20, y: pos.y - 20 }}
                transition={{ type: "spring", stiffness: 180, damping: 28 }}
            >
                <motion.div
                    className="rounded-full border border-white"
                    animate={{
                        width: isHover ? 48 : 40,
                        height: isHover ? 48 : 40,
                        opacity: isHover ? 0.9 : 0.45,
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>
        </>
    )
}
