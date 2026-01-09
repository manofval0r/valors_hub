'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/data/projects';

interface ProjectCardProps {
    project: Project;
    index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const isEven = index % 2 === 0;

    // Subtle parallax for the mockup
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95]);

    return (
        <motion.div
            ref={containerRef}
            className="min-h-[80vh] flex items-center justify-center py-[90px] md:py-20"
            style={{ opacity, scale }}
        >
            <div className={`w-full max-w-7xl grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 lg:gap-32 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                {/* For odd items on desktop, we swap columns. Using simple flex-row-reverse for simplicity since it's a 2-col layout */}

                {/* Text Details Column (Left on Even, Right on Odd) */}
                <div className={`flex flex-col gap-6 text-left ${isEven ? 'order-1' : 'order-1 lg:order-2'}`}>
                    <motion.span
                        className="text-[#778da9] text-sm uppercase tracking-[0.4em] font-normal"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {project.client}
                    </motion.span>

                    <motion.h3
                        className="text-4xl md:text-[40px] font-normal text-[#e0e1dd] leading-tight"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        {project.title}
                    </motion.h3>

                    <motion.p
                        className="text-lg text-[#e0e1dd]/80 leading-relaxed max-w-xl"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        {project.tagline}
                    </motion.p>

                    <motion.div
                        className="flex flex-wrap gap-3 mt-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        {project.techStack.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 border border-[#e0e1dd]/20 rounded-full text-xs text-[#778da9] tracking-wider"
                            >
                                {tech}
                            </span>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <Link
                            href={`/work/${project.slug}`}
                            className="text-[#e0e1dd] group flex items-center gap-2 text-lg link-underline relative w-fit"
                        >
                            View Case Study
                            <motion.span
                                className="inline-block transition-transform duration-300 group-hover:translate-x-2"
                            >
                                →
                            </motion.span>
                        </Link>
                    </motion.div>
                </div>

                {/* Mockup Column (Right on Even, Left on Odd) */}
                <motion.div
                    className={`relative w-full aspect-[16/10] ${isEven ? 'order-2' : 'order-2 lg:order-1'}`}
                    style={{ y }}
                >
                    {/* Browser Mockup Frame */}
                    <div
                        className="w-full h-full border border-[#778da9]/20 rounded-lg overflow-hidden bg-[#0d1b2a] shadow-2xl relative transition-transform duration-500 hover:scale-[1.02]"
                    >
                        {/* Browser Top Bar */}
                        <div className="h-8 bg-[#1a3a5a]/20 border-b border-[#778da9]/10 flex items-center px-4 gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#778da9]/30" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#778da9]/30" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#778da9]/30" />
                        </div>

                        {/* Image / Content */}
                        <div className="absolute inset-x-8 bottom-0 top-16 bg-[#000]/10 flex items-center justify-center rounded-t-sm overflow-hidden group">
                            <motion.div
                                className="relative w-full h-full"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                            >
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-top opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                                    sizes="(max-w-7xl) 50vw, 33vw"
                                />

                                {/* Subtle Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/40 to-transparent pointer-events-none" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Decorative Depth Glow */}
                    <motion.div
                        className="absolute inset-10 -z-10 bg-[#778da9]/5 blur-[100px] rounded-full"
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                        }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
