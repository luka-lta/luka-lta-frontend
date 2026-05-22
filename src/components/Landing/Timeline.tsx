"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { CheckCircle2, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineEventProp {
    year: number
    title: string
    description: string
    icon: LucideIcon
}

const timelineEvents: TimelineEventProp[] = [
    {
        year: 2021,
        title: "Graduated",
        description: "Graduated from Middle School",
        icon: CheckCircle2,
    },
    {
        year: 2022,
        title: "Apprenticeship at Synatix GmbH",
        description: "Started my apprenticeship as an IT Specialist for Application Development at Synatix GmbH",
        icon: CheckCircle2,
    },
    {
        year: 2025,
        title: "Graduated from Apprenticeship",
        description: "Graduated from my apprenticeship as an IT Specialist for Application Development",
        icon: CheckCircle2,
    },
]

export default function Timeline() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    return (
        <section ref={ref} className="bg-card px-6 py-24 md:py-32">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <span className="section-badge mb-8 inline-flex">Journey</span>
                    <h2 className="text-5xl font-black tracking-tight md:text-6xl">
                        The story of my growth
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Vertical line */}
                    <motion.div
                        className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-primary/40 to-transparent md:left-1/2 md:-translate-x-px"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        style={{ transformOrigin: "top" }}
                    />

                    <div className="space-y-12 md:space-y-16">
                        {timelineEvents.map((event, index) => {
                            const Icon = event.icon
                            const isEven = index % 2 === 0

                            return (
                                <motion.div
                                    key={event.year}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ delay: index * 0.2, duration: 0.5 }}
                                    className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                                >
                                    {/* Node */}
                                    <div className="absolute left-4 flex h-8 w-8 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                                        <motion.div
                                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                                            initial={{ scale: 0 }}
                                            animate={isInView ? { scale: 1 } : { scale: 0 }}
                                            transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                                        >
                                            <Icon className="h-4 w-4 text-primary" />
                                        </motion.div>
                                    </div>

                                    {/* Card */}
                                    <div className={`ml-16 w-full md:ml-0 md:w-5/12 ${isEven ? "md:pr-12" : "md:pl-12"}`}>
                                        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                                            <Card className="border-border/60 bg-card p-5 shadow-sm transition-colors hover:border-primary/40 md:p-6">
                                                <Badge className="mb-3" variant="outline">
                                                    {event.year}
                                                </Badge>
                                                <h3 className="mb-2 text-lg font-bold md:text-xl">{event.title}</h3>
                                                <p className="text-sm text-muted-foreground md:text-base">{event.description}</p>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    <div className="hidden w-5/12 md:block" />
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: timelineEvents.length * 0.2 + 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-card px-6 py-3">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="h-2 w-2 rounded-full bg-primary"
                        />
                        <span className="text-sm font-medium text-muted-foreground">And the journey continues…</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
