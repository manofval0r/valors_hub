'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Section from '@/components/ui/Section';
import Card from '@/components/ui/Card';
import { projects } from '@/data/projects';
import { skillCategories } from '@/data/skills';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function WorkArchive() {
    const [primaryFilter, setPrimaryFilter] = useState('all');
    const [techFilters, setTechFilters] = useState<string[]>([]);

    const toggleTechFilter = (tech: string) => {
        setTechFilters(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        );
    };

    const filteredProjects = projects.filter(project => {
        const matchesPrimary = primaryFilter === 'all' || project.category === primaryFilter;
        const matchesTech = techFilters.length === 0 ||
            project.techStack.some(t => techFilters.includes(t.toLowerCase()));
        return matchesPrimary && matchesTech;
    });

    // Extract unique tech stacks from all projects for secondary filters
    const allTech = Array.from(new Set(projects.flatMap(p => p.techStack)));

    return (
        <main className="min-h-screen pt-32 bg-[var(--ink-black)]">
            <Section id="work-archive">
                <motion.div
                    className="flex flex-col gap-12"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-normal text-[var(--alabaster)]"
                        variants={fadeInUp}
                    >
                        All Projects
                    </motion.h1>

                    {/* Filtering System */}
                    <div className="flex flex-col gap-8 py-8 border-y border-[var(--lavender)]/10">
                        <div className="flex flex-col gap-4">
                            <span className="text-[var(--lavender)] text-xs uppercase tracking-widest">Project Type</span>
                            <div className="flex flex-wrap gap-3">
                                {['all', 'full-stack', 'web', 'side-project'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setPrimaryFilter(cat)}
                                        className={`px-5 py-2 border rounded-full text-xs tracking-[0.2em] transition-all duration-300 ${primaryFilter === cat
                                            ? 'bg-[#e0e1dd] border-[#e0e1dd] text-[#0d1b2a]'
                                            : 'border-[#778da9]/20 text-[#778da9] hover:border-[#778da9]'
                                            }`}
                                    >
                                        {cat.replace('-', ' ').toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <span className="text-[var(--lavender)] text-xs uppercase tracking-widest">Tech Stack</span>
                            <div className="flex flex-wrap gap-2">
                                {allTech.map(tech => (
                                    <button
                                        key={tech}
                                        onClick={() => toggleTechFilter(tech.toLowerCase())}
                                        className={`px-4 py-1.5 border rounded-full text-[10px] uppercase font-mono tracking-widest transition-all duration-300 ${techFilters.includes(tech.toLowerCase())
                                            ? 'bg-[#778da9] border-[#778da9] text-[#0d1b2a]'
                                            : 'border-[#778da9]/10 text-[#778da9]/60 hover:border-[#778da9]/40'
                                            }`}
                                    >
                                        {tech}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Project Grid */}
                    <div className="grid md:grid-cols-2 gap-12 mt-8">
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link href={`/work/${project.slug}`}>
                                        <Card hoverable className="group h-full flex flex-col gap-6 p-0 overflow-hidden bg-[#112131]/20 border-[#778da9]/10 hover:border-[#778da9]/30">
                                            <div className="aspect-[16/10] bg-[#0d1b2a] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                                                <div className="absolute inset-0 flex items-center justify-center text-[#778da9]/30 uppercase tracking-[0.3em] text-[10px] font-mono group-hover:scale-105 transition-transform duration-700 bg-gradient-to-br from-[#778da9]/5 to-transparent">
                                                    [ {project.title} ]
                                                </div>
                                            </div>
                                            <div className="p-8 pt-2 flex flex-col gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <span className="text-[#778da9] text-[10px] font-mono uppercase tracking-[0.2em]">{project.category}</span>
                                                    <h3 className="text-2xl text-[#e0e1dd] group-hover:text-[#778da9] transition-colors leading-tight font-normal">
                                                        {project.title}
                                                    </h3>
                                                </div>
                                                <p className="text-[#e0e1dd]/60 text-sm line-clamp-2 leading-relaxed h-10">
                                                    {project.tagline}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {project.techStack.map(t => (
                                                        <span key={t} className="text-[9px] uppercase font-mono tracking-widest text-[#778da9]/50">
                                                            // {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </Section>
        </main>
    );
}
