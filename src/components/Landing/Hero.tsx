"use client"

import { motion } from "framer-motion"
import {Origami} from "lucide-react";

export default function Hero() {
    return (
        <div className="relative isolate overflow-hidden bg-background">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
                    <motion.h1
                        className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-gradient">luka-lta.dev</span>
                    </motion.h1>
                    <motion.p
                        className="mt-6 text-lg leading-8 text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        I specialize in web development, APIs, and scalable architectures, crafting high-performance applications with PHP, JavaScript, Docker, and MySQL. From backend logic to frontend experiences, I love turning ideas into functional, efficient, and user-friendly solutions.

                        Let's build something amazing together! 🚀
                    </motion.p>
                    <motion.div
                        className="mt-10 flex items-center gap-x-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <a
                            href="/#skills"
                            className="apple-button"
                        >
                            Explore Our Work
                        </a>
                        <a
                            href="/#journey"
                            className="text-sm font-semibold leading-6 text-foreground"
                        >
                            Learn more <span aria-hidden="true">→</span>
                        </a>
                    </motion.div>
                </div>
                <motion.div
                    className="mx-auto mt-16 lg:mt-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="relative">
                        <Origami
                            width={600}
                            height={600}
                            className="w-[500px] rounded-2xl shadow-xl ring-1 ring-gray-900/10"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

