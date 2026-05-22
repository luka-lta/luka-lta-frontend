"use client"

import { motion } from "framer-motion"

export default function Marquee() {
    return (
        <div className="relative w-full overflow-hidden border-y border-border/40 bg-background py-14">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10" />
            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 24 }}
            >
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex items-center">
                        <span
                            className="px-8 text-7xl font-black text-transparent sm:text-8xl md:text-9xl"
                            style={{ WebkitTextStroke: "1px hsl(var(--border))" }}
                        >
                            luka-lta.dev
                        </span>
                        <span
                            className="px-8 text-7xl font-black sm:text-8xl md:text-9xl gradient-text"
                        >
                            ✦
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
