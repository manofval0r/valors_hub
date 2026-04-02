'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import RevealCard from '@/components/ui/RevealCard';
import FilterSheet from '@/components/ui/FilterSheet';
import { projects } from '@/data/projects';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const PAGE_SIZE = 6;

export default function WorkArchive() {
    const [techFilters, setTechFilters] = useState<string[]>([]);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // Unique tech tags across all projects
    const allTech = useMemo(
        () => Array.from(new Set(projects.flatMap(p => p.techStack))).filter(Boolean).sort(),
        [],
    );

    const toggleTechFilter = useCallback((tech: string) => {
        setTechFilters(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech],
        );
        setVisibleCount(PAGE_SIZE); // reset pagination on filter change
    }, []);

    const clearAllFilters = useCallback(() => {
        setTechFilters([]);
        setVisibleCount(PAGE_SIZE);
    }, []);

    const filteredProjects = useMemo(() => {
        if (techFilters.length === 0) return projects;
        return projects.filter(p =>
            p.techStack.some(t => techFilters.includes(t.toLowerCase())),
        );
    }, [techFilters]);

    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    return (
        <main className="min-h-screen bg-[#0d1b2a]">
            {/* ——— Page Header ——— */}
            <header className="pt-28 pb-16 px-5 md:px-12 lg:px-24 max-w-[1280px] mx-auto text-center">
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl text-[#e0e1dd] font-normal leading-[1.1]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                >
                    My Work
                </motion.h1>
                <motion.p
                    className="text-sm text-[#778da9] mt-4 font-mono uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: EASE_OUT }}
                >
                    {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                    {techFilters.length > 0 && ' matched'}
                </motion.p>
            </header>

            {/* ——— Project Grid ——— */}
            <section
                className="px-5 md:px-12 lg:px-24 pb-24 max-w-[1280px] mx-auto"
                aria-label="Project grid"
            >
                <LayoutGroup>
                    <AnimatePresence mode="popLayout">
                        {visibleProjects.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-[60px]"
                                layout
                            >
                                {visibleProjects.map((project, i) => (
                                    <motion.div
                                        key={project.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: i * 0.06,
                                            ease: EASE_OUT,
                                        }}
                                    >
                                        <RevealCard
                                            title={project.title}
                                            tagline={project.tagline}
                                            techStack={project.techStack}
                                            image={project.imageUrl}
                                            video={project.videoUrl}
                                            videoPublicId={project.videoPublicId}
                                            slug={project.slug}
                                            liveLink={project.liveLink}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            /* ——— Empty State ——— */
                            <motion.div
                                key="empty"
                                className="flex flex-col items-center justify-center py-32 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p className="text-[#778da9] text-lg text-center">
                                    No projects match your filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="px-6 py-3 border border-[#778da9]/30 text-[#778da9] text-xs uppercase tracking-widest font-mono rounded-[2px] hover:border-[#e0e1dd] hover:text-[#e0e1dd] transition-all"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </LayoutGroup>

                {/* ——— Load More ——— */}
                {hasMore && (
                    <motion.div
                        className="flex justify-center mt-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <button
                            type="button"
                            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                            className="px-8 py-4 border border-[#778da9]/30 text-[#778da9] text-xs uppercase tracking-widest font-mono rounded-[2px] hover:border-[#e0e1dd] hover:text-[#e0e1dd] transition-all"
                        >
                            Load More
                        </button>
                    </motion.div>
                )}
            </section>

            {/* ——— Filter FAB + Sheet ——— */}
            <FilterSheet
                allTech={allTech}
                techFilters={techFilters}
                onToggleTech={toggleTechFilter}
                onClearAll={clearAllFilters}
            />
        </main>
    );
}
