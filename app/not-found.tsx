'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const nodes = Array.from({ length: 7 });

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[var(--ink-black)] flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Broken Constellation Background */}
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                <svg viewBox="0 0 1000 1000" className="w-full h-full text-[#778da9]">
                    {nodes.map((_, i) => {
                        const startX = 200 + Math.random() * 600;
                        const startY = 200 + Math.random() * 600;
                        const endX = startX + (Math.random() - 0.5) * 300;
                        const endY = startY + (Math.random() - 0.5) * 300;

                        return (
                            <motion.g key={i}>
                                {/* Drifting Hexagon */}
                                <motion.path
                                    d="M 50 1, 93 25, 93 75, 50 99, 7 75, 7 25 Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                    initial={{ x: startX, y: startY, rotate: 0, opacity: 0 }}
                                    animate={{
                                        x: endX,
                                        y: endY,
                                        rotate: Math.random() * 90,
                                        opacity: [0, 1, 0.4]
                                    }}
                                    transition={{
                                        duration: 8 + Math.random() * 4,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                />
                                {/* Breaking Connection Line */}
                                {i < nodes.length - 1 && (
                                    <motion.line
                                        x1={startX} y1={startY}
                                        x2={startX + 100} y2={startY + 100}
                                        stroke="currentColor"
                                        strokeWidth="0.5"
                                        initial={{ pathLength: 1, opacity: 0.5 }}
                                        animate={{ pathLength: 0, opacity: 0 }}
                                        transition={{
                                            duration: 3 + Math.random() * 2,
                                            delay: i * 0.2
                                        }}
                                    />
                                )}
                            </motion.g>
                        );
                    })}
                </svg>
            </div>

            <div className="relative z-10 text-center flex flex-col gap-8">
                <motion.h1
                    className="text-8xl md:text-[12rem] font-normal text-[#e0e1dd] tracking-tighter"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    404
                </motion.h1>

                <div className="flex flex-col gap-3">
                    <motion.p
                        className="text-2xl text-[#e0e1dd] font-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        The constellation has drifted.
                    </motion.p>
                    <motion.p
                        className="text-[#778da9] uppercase tracking-[0.4em] text-[10px] font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        You are out of range.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8"
                >
                    <Link href="/">
                        <Button size="lg">Take Me Home</Button>
                    </Link>
                </motion.div>

                <div className="flex gap-8 items-center justify-center mt-12 text-[10px] text-[#778da9]/40 uppercase tracking-[0.3em] font-mono">
                    <Link href="/work" className="hover:text-[#e0e1dd] transition-colors link-underline">Work</Link>
                    <Link href="/#my-story" className="hover:text-[#e0e1dd] transition-colors link-underline">About</Link>
                    <Link href="/#contact" className="hover:text-[#e0e1dd] transition-colors link-underline">Contact</Link>
                </div>
            </div>
        </main>
    );
}
