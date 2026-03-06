"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const rafRef = useRef<number | null>(null)
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

    useEffect(() => {
        if (prefersReducedMotion) return

        const updateMousePosition = (e: MouseEvent) => {
            if (rafRef.current !== null) return
            rafRef.current = requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY })
                rafRef.current = null
            })
        }

        window.addEventListener("mousemove", updateMousePosition)

        return () => {
            window.removeEventListener("mousemove", updateMousePosition)
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [prefersReducedMotion])

    if (prefersReducedMotion) return null

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
            animate={{ x: mousePosition.x - 5, y: mousePosition.y - 5 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
        >
            <div className="w-3 h-3 bg-white rounded-full" />
        </motion.div>
    )
}
