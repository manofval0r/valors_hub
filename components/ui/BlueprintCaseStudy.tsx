'use client';

import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import VideoShowcase from '@/components/ui/VideoShowcase';
import type { Project } from '@/data/projects';

// Lazy load the heavy constellation — it's never SSR'd
const InteractiveWorkflowNodeMap = dynamic(
    () => import('@/components/ui/InteractiveWorkflowNodeMap'),
    { ssr: false }
);

// ── Chapter definitions: each chapter maps to a canvas region ──
// autoPanTarget is the canvas coordinate to center on (node hub position)
// highlightCluster = node IDs to light up while this chapter is active
interface Chapter {
    id: string;
    title: string;
    subtitle?: string;
    body: string;
    autoPanTarget: { x: number; y: number };
    highlightCluster: string[];
}

function buildChapters(mindMap?: Project['mindMap'], project?: Project): Chapter[] {
    if (!mindMap?.nodes.length || !project) return [];

    // Group nodes by type for generic chapters
    const hubs = mindMap.nodes.filter(n => n.type === 'hub');
    const projectNodes = mindMap.nodes.filter(n => n.type === 'project');

    // Build adjacency for cluster discovery
    const childrenOf: Record<string, string[]> = {};
    mindMap.edges.forEach(e => {
        if (!childrenOf[e.source]) childrenOf[e.source] = [];
        childrenOf[e.source].push(e.target);
    });

    // Find centroid of all nodes to use as "overview" pan target
    const cx = mindMap.nodes.reduce((s, n) => s + n.x, 0) / mindMap.nodes.length;
    const cy = mindMap.nodes.reduce((s, n) => s + n.y, 0) / mindMap.nodes.length;

    const chapters: Chapter[] = [];

    // Chapter 0 — Overview: all nodes visible, panned to centre
    chapters.push({
        id: 'overview',
        title: 'Project Overview',
        subtitle: `${project.client} · ${project.date}`,
        body: project.description,
        autoPanTarget: { x: cx, y: cy },
        highlightCluster: [],  // all visible
    });

    // One chapter per hub, highlighting the hub + its children
    hubs.forEach(hub => {
        const cluster = [hub.id, ...(childrenOf[hub.id] || [])];
        chapters.push({
            id: hub.id,
            title: hub.label,
            subtitle: hub.date || undefined,
            body: hub.description || `Engineering decisions made during the ${hub.label.toLowerCase()} phase.`,
            autoPanTarget: { x: hub.x, y: hub.y },
            highlightCluster: cluster,
        });
    });

    // Final chapter — cross-project connections
    if (projectNodes.length > 0) {
        const allIds = mindMap.nodes.map(n => n.id);
        chapters.push({
            id: 'connections',
            title: 'Cross-Project Connections',
            subtitle: 'How this work powers the wider ecosystem',
            body: `The engineering decisions made here didn't stay isolated. They influenced and connected to: ${projectNodes.map(p => p.label).join(', ')} — sharing security protocols, design patterns, or architectural blueprints.`,
            autoPanTarget: { x: cx, y: cy },
            highlightCluster: allIds,
        });
    }

    return chapters;
}

interface Props {
    project: Project;
    prevProject?: Project;
    nextProject?: Project;
}

export default function BlueprintCaseStudy({ project, prevProject, nextProject }: Props) {
    const chapters = useMemo(() => buildChapters(project.mindMap, project), [project]);
    const hasConstellation = !!project.mindMap?.nodes.length;

    // Active chapter driven by scroll
    const [activeChapterIdx, setActiveChapterIdx] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // IntersectionObserver: when a chapter card enters viewport, update active chapter
    useEffect(() => {
        if (!hasConstellation || isMobile) return;
        const observers: IntersectionObserver[] = [];

        chapterRefs.current.forEach((el, i) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        setActiveChapterIdx(i);
                    }
                },
                { threshold: 0.5 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach(o => o.disconnect());
    }, [hasConstellation, isMobile, chapters.length]);

    const activeChapter = chapters[activeChapterIdx];

    // Current pan target and highlight cluster
    const autoPanTarget = activeChapter?.autoPanTarget ?? null;
    const highlightCluster = activeChapter?.highlightCluster ?? [];

    // Hero opacity: fades out as you scroll into chapters
    const heroRef = useRef<HTMLDivElement>(null);
    const [heroOpacity, setHeroOpacity] = useState(1);
    useEffect(() => {
        const onScroll = () => {
            if (!heroRef.current) return;
            const rect = heroRef.current.getBoundingClientRect();
            const fade = Math.max(0, Math.min(1, rect.bottom / rect.height));
            setHeroOpacity(fade);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <main className="min-h-screen bg-[#030910]">
            {/* ══════════════════════════════════════════════════
                LAYER 1 — STICKY BLUEPRINT CANVAS (desktop only)
               ══════════════════════════════════════════════════ */}
            {hasConstellation && !isMobile && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="w-full h-full pointer-events-auto">
                        <InteractiveWorkflowNodeMap
                            mindMap={project.mindMap}
                            blueprintMode={true}
                            autoPanTarget={autoPanTarget}
                            highlightCluster={highlightCluster}
                        />
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                LAYER 2 — SCROLLABLE CONTENT
               ══════════════════════════════════════════════════ */}
            <div className="relative z-10">

                {/* ── Hero ── */}
                <div
                    ref={heroRef}
                    className="relative flex items-end pb-16 md:pb-24 px-6 md:px-14"
                    style={{ minHeight: '100svh' }}
                >
                    {/* Gradient fade at bottom so hero blends into chapters */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#030910]/60 via-transparent to-[#030910] pointer-events-none" />

                    <motion.div
                        className="relative z-10 max-w-3xl"
                        style={{ opacity: heroOpacity }}
                    >
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-8 text-[#778da9]/50 text-[10px] font-mono uppercase tracking-widest">
                            <Link href="/work" className="hover:text-[#778da9] transition-colors">Work</Link>
                            <span>/</span>
                            <span className="text-[#778da9]">{project.title}</span>
                        </div>

                        {/* Category + date */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
                            <span className="text-[#52b788] text-[10px] font-mono uppercase tracking-[0.3em]">
                                {project.category === 'full-stack' ? 'Full Stack' : project.category}
                            </span>
                            <span className="text-[#778da9]/40 text-[10px] font-mono">{project.date}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-[#e0e1dd] leading-[0.95] tracking-tight mb-6">
                            {project.title}
                        </h1>
                        <p className="text-[#778da9] text-base md:text-lg font-light leading-relaxed max-w-xl">
                            {project.tagline}
                        </p>

                        {/* Tech stack */}
                        {project.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-8">
                                {project.techStack.map(t => (
                                    <span key={t} className="text-[9px] px-3 py-1.5 border border-[#778da9]/20 text-[#778da9] font-mono uppercase tracking-widest bg-[#030910]/60 backdrop-blur-sm">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Scroll cue */}
                        {hasConstellation && (
                            <div className="mt-12 flex items-center gap-3 text-[#778da9]/40 text-[9px] font-mono uppercase tracking-widest">
                                <motion.div
                                    animate={{ y: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                                </motion.div>
                                Scroll to explore the architecture
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ── Chapter cards (glass cards floating over the constellation) ── */}
                {hasConstellation && !isMobile && (
                    <div className="relative pb-48">
                        {chapters.map((chapter, i) => (
                            <div
                                key={chapter.id}
                                ref={el => { chapterRefs.current[i] = el; }}
                                className="min-h-[85vh] flex items-center px-6 md:px-14"
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${chapter.id}-${activeChapterIdx === i}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: activeChapterIdx === i ? 1 : 0.3, x: 0 }}
                                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                        className="w-full max-w-md"
                                    >
                                        {/* Glass card */}
                                        <div className={`p-7 backdrop-blur-xl border transition-all duration-500 ${activeChapterIdx === i ? 'bg-[#030910]/75 border-[#778da9]/25 shadow-[0_32px_80px_rgba(0,0,0,0.6)]' : 'bg-[#030910]/40 border-[#778da9]/10'}`}>
                                            {/* Chapter index */}
                                            <div className="flex items-center gap-3 mb-5">
                                                <span className="text-[#778da9]/40 text-[10px] font-mono">
                                                    {String(i + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
                                                </span>
                                                {chapter.subtitle && (
                                                    <>
                                                        <span className="w-px h-3 bg-[#778da9]/20" />
                                                        <span className="text-[#778da9]/50 text-[10px] font-mono uppercase tracking-widest">{chapter.subtitle}</span>
                                                    </>
                                                )}
                                            </div>

                                            <h2 className="text-xl md:text-2xl text-[#e0e1dd] font-mono font-light leading-tight mb-4">
                                                {chapter.title}
                                            </h2>
                                            <p className="text-[#e0e1dd]/55 text-sm leading-relaxed">
                                                {chapter.body}
                                            </p>

                                            {/* Node cluster count badge */}
                                            {chapter.highlightCluster.length > 0 && (
                                                <div className="mt-5 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-[#52b788] rounded-full animate-pulse" />
                                                    <span className="text-[#52b788]/60 text-[9px] font-mono uppercase tracking-widest">
                                                        {chapter.highlightCluster.length} nodes active
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Standard layout for mobile OR projects without mindMap ── */}
                <div className={`relative z-10 ${!isMobile && hasConstellation ? 'hidden' : 'block'}`}>
                    {/* Mobile constellation tree */}
                    {hasConstellation && isMobile && (
                        <div className="px-4 pb-12">
                            <InteractiveWorkflowNodeMap mindMap={project.mindMap} />
                        </div>
                    )}

                    {/* Overview grid for non-constellation projects */}
                    {!hasConstellation && (
                        <section className="px-6 md:px-14 py-16 md:py-24 max-w-7xl mx-auto">
                            <div className="grid md:grid-cols-[220px_1fr] gap-12 md:gap-20">
                                {/* Sidebar meta */}
                                <div className="flex flex-col gap-8">
                                    <div>
                                        <span className="text-[#778da9] text-[9px] uppercase font-mono tracking-[0.2em] block mb-1.5">Client</span>
                                        <span className="text-[#e0e1dd] text-sm">{project.client}</span>
                                    </div>
                                    <div>
                                        <span className="text-[#778da9] text-[9px] uppercase font-mono tracking-[0.2em] block mb-1.5">Timeline</span>
                                        <span className="text-[#e0e1dd] text-sm">{project.date}</span>
                                    </div>
                                    {project.techStack.length > 0 && (
                                        <div>
                                            <span className="text-[#778da9] text-[9px] uppercase font-mono tracking-[0.2em] block mb-3">Stack</span>
                                            <div className="flex flex-wrap gap-2">
                                                {project.techStack.map(t => (
                                                    <span key={t} className="text-[9px] border border-[#778da9]/20 px-2.5 py-1 text-[#778da9] font-mono uppercase tracking-widest bg-[#112131]/40">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3 mt-2">
                                        {project.liveLink && (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                                <Button fullWidth>Live Site</Button>
                                            </a>
                                        )}
                                        {project.codeLink && (
                                            <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" fullWidth>View Code</Button>
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Main content */}
                                <div className="flex flex-col gap-10">
                                    <VideoShowcase
                                        videoUrl={project.videoUrl}
                                        videoPublicId={project.videoPublicId}
                                        imageUrl={project.imageUrl}
                                        title={project.title}
                                    />
                                    <div className="border border-[#778da9]/10 p-6 bg-[#0d1b2a]/40">
                                        <h2 className="text-[#778da9] text-[9px] uppercase font-mono tracking-[0.2em] mb-3">Overview</h2>
                                        <p className="text-[#e0e1dd]/60 text-sm leading-relaxed">{project.description}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* ── CTA strip ── */}
                {(project.liveLink || project.codeLink) && (
                    <div className="relative z-10 px-6 md:px-14 py-10 border-t border-[#778da9]/8 flex items-center gap-5">
                        {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                <Button>Live Site ↗</Button>
                            </a>
                        )}
                        {project.codeLink && (
                            <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost">View Code</Button>
                            </a>
                        )}
                        {project.collaborator && (
                            <span className="text-[#778da9]/40 text-[10px] font-mono uppercase tracking-widest ml-2">
                                w/ <a href={project.collaborator.github} target="_blank" rel="noopener noreferrer" className="hover:text-[#778da9] transition-colors">{project.collaborator.name}</a>
                            </span>
                        )}
                    </div>
                )}

                {/* ── Video showcase for constellation projects on desktop ── */}
                {hasConstellation && !isMobile && (project.videoUrl || project.videoPublicId || project.imageUrl) && (
                    <div className="relative z-10 px-6 md:px-14 pb-16">
                        <div className="max-w-2xl">
                            <p className="text-[#778da9] text-[9px] uppercase font-mono tracking-[0.2em] mb-4">Live Demo</p>
                            <VideoShowcase
                                videoUrl={project.videoUrl}
                                videoPublicId={project.videoPublicId}
                                imageUrl={project.imageUrl}
                                title={project.title}
                            />
                        </div>
                    </div>
                )}

                {/* ── Prev / Next navigation ── */}
                <div className="relative z-10 border-t border-[#778da9]/10 bg-[#030910]/80 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2">
                        {prevProject ? (
                            <Link href={`/work/${prevProject.slug}`} className="group p-10 md:border-r border-[#778da9]/10 hover:bg-[#778da9]/5 transition-all text-left">
                                <span className="text-[#778da9]/40 text-[9px] block mb-3 uppercase font-mono tracking-widest">← Previous</span>
                                <h4 className="text-xl text-[#e0e1dd] group-hover:text-[#778da9] transition-colors font-light">{prevProject.title}</h4>
                            </Link>
                        ) : <div className="p-10 md:border-r border-[#778da9]/10" />}

                        {nextProject ? (
                            <Link href={`/work/${nextProject.slug}`} className="group p-10 hover:bg-[#778da9]/5 transition-all text-right">
                                <span className="text-[#778da9]/40 text-[9px] block mb-3 uppercase font-mono tracking-widest">Next →</span>
                                <h4 className="text-xl text-[#e0e1dd] group-hover:text-[#778da9] transition-colors font-light">{nextProject.title}</h4>
                            </Link>
                        ) : <div className="p-10" />}
                    </div>
                </div>
            </div>
        </main>
    );
}
