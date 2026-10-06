'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { projects, Project } from '@/data/projects';
import { resolveVideoSource } from '@/lib/cloudinary';

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'full-stack', label: 'Full Stack' },
    { id: 'web', label: 'Web' },
    { id: 'side-project', label: 'Side Projects' },
] as const;

export default function WorkPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [hoveredProjectId, setHoveredProjectId] = useState<string>(projects[0]?.id || '10');
    const videoRef = useRef<HTMLVideoElement>(null);

    // Filter projects by category and search query
    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
            const query = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !query ||
                p.title.toLowerCase().includes(query) ||
                p.tagline.toLowerCase().includes(query) ||
                p.techStack.some((t) => t.toLowerCase().includes(query)) ||
                p.client.toLowerCase().includes(query);
            return matchesCat && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Active project for the desktop sticky preview dock
    const activeProject: Project = useMemo(() => {
        const found = filteredProjects.find((p) => p.id === hoveredProjectId);
        return found || filteredProjects[0] || projects[0];
    }, [hoveredProjectId, filteredProjects]);

    const activeVideoSrc = resolveVideoSource({
        videoPublicId: activeProject?.videoPublicId,
        videoUrl: activeProject?.videoUrl,
    });

    return (
        <main className="min-h-screen bg-[var(--ground-2)] text-[var(--ink-strong)] pt-24 pb-20 px-4 md:px-8 lg:px-16 selection:bg-[var(--ground-2)] selection:text-[var(--ink-strong)]">
            {/* ── Page Header ── */}
            <div className="max-w-7xl mx-auto mb-10 md:mb-14">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[var(--rule)]/15">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[var(--ink-strong)] animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ink-strong)]">
                                Engineering Archive
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-light tracking-tight text-[var(--ink-strong)]">
                            All Projects
                        </h1>
                        <p className="text-xs md:text-sm text-[var(--ink-faint)] font-mono mt-2 tracking-wide max-w-xl">
                            A catalog of {projects.length} full-stack platforms, client systems, and experimental prototypes.
                        </p>
                    </div>

                    {/* Constellation CTA button */}
                    <Link
                        href="/constellation"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--rule)]/20 hover:border-[var(--rule-strong)]/50 hover:bg-[var(--ground-2)] text-[11px] font-mono uppercase tracking-widest text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-all rounded-sm w-fit"
                    >
                        <span>Project Constellation</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                    </Link>
                </div>

                {/* ── Filters & Search Toolbar ── */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {CATEGORIES.map((cat) => {
                            const count =
                                cat.id === 'all'
                                    ? projects.length
                                    : projects.filter((p) => p.category === cat.id).length;
                            const isActive = selectedCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3.5 py-1.5 rounded-sm text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                                        isActive
                                            ? 'bg-[var(--ink-strong)] text-[var(--ground)] font-medium shadow-sm'
                                            : 'bg-[var(--ground)]/60 text-[var(--ink-faint)] border border-[var(--rule)]/20 hover:border-[var(--rule)]/40 hover:text-[var(--ink-strong)]'
                                    }`}
                                >
                                    <span>{cat.label}</span>
                                    <span
                                        className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                                            isActive
                                                ? 'bg-[var(--ground-2)]/20 text-[var(--ground)]'
                                                : 'bg-[var(--ground-2)] text-[var(--ink-faint)]'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative min-w-[220px] sm:max-w-xs">
                        <input
                            type="text"
                            placeholder="Filter by tech or keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[var(--ground)]/40 border border-[var(--rule)]/20 rounded-sm px-3.5 py-1.5 text-xs text-[var(--ink-strong)] placeholder-[var(--ink-faint)] font-mono focus:outline-none focus:border-[var(--rule-strong)]/60 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink-faint)] hover:text-[var(--ink-strong)] text-xs font-mono"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main Layout: Split Desktop / Stacked Mobile ── */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* ── Left Column: Projects Index List (lg:col-span-7) ── */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {filteredProjects.length === 0 ? (
                        <div className="p-12 border border-dashed border-[var(--rule)]/20 rounded-sm text-center">
                            <p className="text-sm font-mono text-[var(--ink-faint)] uppercase tracking-widest">
                                No projects match your criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setSearchQuery('');
                                }}
                                className="mt-4 text-xs font-mono text-[var(--ink-strong)] underline tracking-wider"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        filteredProjects.map((project, index) => {
                            const isSelected = activeProject?.id === project.id;
                            const projectNum = String(index + 1).padStart(2, '0');

                            return (
                                <div
                                    key={project.id}
                                    onMouseEnter={() => setHoveredProjectId(project.id)}
                                    className={`group relative p-5 md:p-6 border transition-all duration-300 rounded-sm ${
                                        isSelected
                                            ? 'bg-[var(--ground)]/80 border-[var(--rule-strong)]/40'
                                            : 'bg-[var(--ground)]/30 border-[var(--rule)]/15 hover:border-[var(--rule)]/40 hover:bg-[var(--ground)]/50'
                                    }`}
                                >
                                    {/* Active Left Indicator Bar */}
                                    <div
                                        className={`absolute left-0 top-0 bottom-0 w-[2px] transition-colors duration-300 ${
                                            isSelected ? 'bg-[var(--ink-strong)]' : 'bg-transparent'
                                        }`}
                                    />

                                    {/* Mobile Media Preview (Visible only on mobile screens < lg) */}
                                    <div className="block lg:hidden mb-4 rounded-sm overflow-hidden border border-[var(--rule)]/20 aspect-[16/9] relative bg-black/40">
                                        {resolveVideoSource({ videoPublicId: project.videoPublicId, videoUrl: project.videoUrl }) ? (
                                            <video
                                                src={resolveVideoSource({ videoPublicId: project.videoPublicId, videoUrl: project.videoUrl })}
                                                poster={project.imageUrl}
                                                muted
                                                loop
                                                playsInline
                                                autoPlay
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Image
                                                src={project.imageUrl}
                                                alt={project.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />
                                        )}
                                    </div>

                                    {/* Header Row: Index & Category */}
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-mono text-[var(--ink-faint)]/70 tracking-widest">
                                                #{projectNum}
                                            </span>
                                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 border border-[var(--rule)]/20 text-[var(--ink-faint)] rounded-sm">
                                                {project.category === 'full-stack'
                                                    ? 'Full Stack'
                                                    : project.category === 'side-project'
                                                    ? 'Side Project'
                                                    : 'Web'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-mono text-[var(--ink-faint)]/50 tracking-wider">
                                            {project.date}
                                        </span>
                                    </div>

                                    {/* Title & Tagline */}
                                    <Link href={`/work/${project.slug}`} className="block group-hover:text-[var(--ink-strong)] transition-colors">
                                        <h2 className="text-lg md:text-xl font-normal text-[var(--ink-strong)] group-hover:text-[var(--ink-strong)] transition-colors flex items-center justify-between">
                                            <span>{project.title}</span>
                                            <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity text-[var(--ink-strong)]">
                                                →
                                            </span>
                                        </h2>
                                    </Link>
                                    <p className="text-xs text-[var(--ink-faint)] font-mono mt-1 mb-4 leading-relaxed">
                                        {project.tagline}
                                    </p>

                                    {/* Tech Stack Pills */}
                                    {project.techStack && project.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {project.techStack.map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="text-[9px] font-mono px-2 py-0.5 bg-[var(--ground-2)] text-[var(--ink-faint)] border border-[var(--rule)]/15 rounded-sm"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Links */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-[var(--rule)]/10 text-xs font-mono">
                                        <Link
                                            href={`/work/${project.slug}`}
                                            className="text-[var(--ink-strong)] hover:text-[var(--ink-strong)] transition-colors flex items-center gap-1.5 uppercase tracking-wider text-[10px]"
                                        >
                                            <span>Case Study</span>
                                            <span>→</span>
                                        </Link>
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-colors uppercase tracking-wider text-[10px]"
                                            >
                                                Live Site ↗
                                            </a>
                                        )}
                                        {project.codeLink && (
                                            <a
                                                href={project.codeLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-colors uppercase tracking-wider text-[10px]"
                                            >
                                                Code ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ── Right Column: Sticky Visual Dock (Desktop only lg:col-span-5) ── */}
                <div className="hidden lg:block lg:col-span-5 sticky top-28">
                    <div className="bg-[var(--ground)]/80 backdrop-blur-xl border border-[var(--rule)]/20 rounded-sm p-6 overflow-hidden relative">
                        {/* Top Coordinate Header */}
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--rule)]/15 text-[9px] font-mono uppercase tracking-[0.25em] text-[var(--ink-faint)]">
                            <span>PREVIEW DOCK</span>
                            <span className="text-[var(--ink-strong)]">ACTIVE</span>
                        </div>

                        {/* Video / Image Screen */}
                        <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-[var(--rule)]/20 bg-black/60 mb-5">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeProject.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full relative"
                                >
                                    {activeVideoSrc ? (
                                        <video
                                            ref={videoRef}
                                            key={activeVideoSrc}
                                            src={activeVideoSrc}
                                            poster={activeProject.imageUrl}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={activeProject.imageUrl}
                                            alt={activeProject.title}
                                            fill
                                            className="object-cover"
                                            sizes="40vw"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Active Project Meta */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ink-strong)]">
                                    {activeProject.client}
                                </span>
                                <span className="text-[10px] font-mono text-[var(--ink-faint)]">
                                    {activeProject.date}
                                </span>
                            </div>

                            <h3 className="text-xl font-normal text-[var(--ink-strong)] leading-snug">
                                {activeProject.title}
                            </h3>

                            <p className="text-xs text-[var(--ink-faint)] font-mono leading-relaxed line-clamp-3">
                                {activeProject.description}
                            </p>

                            <div className="pt-4 mt-2 border-t border-[var(--rule)]/15 flex items-center justify-between gap-4">
                                <Link
                                    href={`/work/${activeProject.slug}`}
                                    className="flex-1 py-2.5 bg-[var(--ink-strong)] hover:bg-white text-[var(--ground)] text-center text-xs font-mono uppercase tracking-widest font-medium transition-colors rounded-sm"
                                >
                                    Explore Case Study →
                                </Link>
                                {activeProject.liveLink && (
                                    <a
                                        href={activeProject.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2.5 border border-[var(--rule)]/30 hover:border-[var(--rule-strong)] text-[var(--ink-faint)] hover:text-[var(--ink-strong)] text-xs font-mono uppercase tracking-widest transition-colors rounded-sm"
                                    >
                                        Live ↗
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
