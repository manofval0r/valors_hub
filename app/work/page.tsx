'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { resolveVideoSource } from '@/lib/cloudinary';

// One accent per slide — intentional, not random
const SLIDE_ACCENTS = [
    { bg: '#030d18', accent: '#52b788', glow: 'rgba(82,183,136,0.12)' },     // Koji     — teal
    { bg: '#0d0a18', accent: '#a78bfa', glow: 'rgba(167,139,250,0.12)' },    // Amber    — violet
    { bg: '#110d04', accent: '#fb923c', glow: 'rgba(251,146,60,0.12)' },     // BudgetFit— amber
    { bg: '#04100d', accent: '#34d399', glow: 'rgba(52,211,153,0.12)' },     // Restaurant— emerald
    { bg: '#080418', accent: '#818cf8', glow: 'rgba(129,140,248,0.12)' },    // What's Next— indigo
    { bg: '#100408', accent: '#f472b6', glow: 'rgba(244,114,182,0.12)' },    // Junxtion — pink
    { bg: '#04080f', accent: '#38bdf8', glow: 'rgba(56,189,248,0.12)' },     // Midwife  — sky
    { bg: '#0c0e04', accent: '#a3e635', glow: 'rgba(163,230,53,0.12)' },     // Solar    — lime
    { bg: '#100812', accent: '#e879f9', glow: 'rgba(232,121,249,0.12)' },    // Klo's    — fuchsia
    { bg: '#030810', accent: '#67e8f9', glow: 'rgba(103,232,249,0.12)' },    // Client Portfolios — cyan
    { bg: '#0a0604', accent: '#fdba74', glow: 'rgba(253,186,116,0.12)' },    // VoicePatches — orange
    { bg: '#050c0a', accent: '#6ee7b7', glow: 'rgba(110,231,183,0.12)' },    // Hashebi  — mint
];

// Category display labels
const CATEGORY_LABELS: Record<string, string> = {
    'full-stack': 'Full Stack',
    'web': 'Web',
    'side-project': 'Side Project',
};

export default function WorkArchive() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Spring-animated slide index for smooth in-between states
    const slideProgress = useMotionValue(0);
    const smoothProgress = useSpring(slideProgress, { stiffness: 80, damping: 20 });

    const total = projects.length;

    const navigateTo = useCallback((idx: number) => {
        const clamped = Math.max(0, Math.min(total - 1, idx));
        if (clamped === activeIndex || isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex(clamped);
        slideProgress.set(clamped);
        setTimeout(() => setIsTransitioning(false), 600);
    }, [activeIndex, isTransitioning, total, slideProgress]);

    // Scroll hijack — wheel maps to slide navigation
    useEffect(() => {
        let accum = 0;
        let lastTime = 0;
        const THRESHOLD = 80;
        const COOLDOWN = 500; // ms

        const onWheel = (e: WheelEvent) => {
            // Only hijack if the page hasn't scrolled past the reel
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            if (rect.top > 60 || rect.bottom < window.innerHeight * 0.5) return;

            e.preventDefault();
            const now = Date.now();
            if (now - lastTime < COOLDOWN) return;

            accum += e.deltaY;
            if (Math.abs(accum) > THRESHOLD) {
                const dir = accum > 0 ? 1 : -1;
                accum = 0;
                lastTime = now;
                setActiveIndex(prev => {
                    const next = Math.max(0, Math.min(total - 1, prev + dir));
                    slideProgress.set(next);
                    return next;
                });
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        return () => window.removeEventListener('wheel', onWheel);
    }, [total, slideProgress]);

    // Arrow key navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigateTo(activeIndex + 1);
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigateTo(activeIndex - 1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeIndex, navigateTo]);

    // Touch swipe
    const touchStart = useRef(0);
    const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        const delta = touchStart.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50) navigateTo(activeIndex + (delta > 0 ? 1 : -1));
    };

    const project = projects[activeIndex];
    const accent = SLIDE_ACCENTS[activeIndex % SLIDE_ACCENTS.length];
    const hasVideo = !!(project.videoUrl || project.videoPublicId);

    return (
        <main className="min-h-screen bg-[#030910] select-none">
            {/* ── Fixed slide title in top-left ── */}
            <div className="fixed top-24 left-8 md:left-14 z-30 pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="text-[10px] font-mono uppercase tracking-[0.35em] mb-2" style={{ color: accent.accent }}>
                            {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                        </p>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-[#e0e1dd] leading-[1.1] tracking-tight max-w-[600px]">
                            {project.title}
                        </h1>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Vertical slide counter / dots on right ── */}
            <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
                {projects.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => navigateTo(i)}
                        className="w-1 rounded-full transition-all duration-300 cursor-pointer"
                        style={{
                            height: i === activeIndex ? 28 : 8,
                            background: i === activeIndex ? accent.accent : 'rgba(119,141,169,0.3)',
                        }}
                        aria-label={`Go to project ${i + 1}`}
                    />
                ))}
            </div>

            {/* ── Main reel ── */}
            <div
                ref={containerRef}
                className="fixed inset-0 overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                {projects.map((p, i) => {
                    const ac = SLIDE_ACCENTS[i % SLIDE_ACCENTS.length];
                    const isActive = i === activeIndex;
                    const isPrev = i < activeIndex;

                    return (
                        <motion.div
                            key={p.id}
                            className="absolute inset-0 will-change-transform"
                            animate={{
                                x: isPrev ? '-100%' : isActive ? '0%' : '100%',
                                opacity: isActive ? 1 : 0.4,
                            }}
                            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
                            style={{ background: ac.bg }}
                        >
                            {/* Radial ambient glow */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: `radial-gradient(ellipse 70% 60% at 65% 55%, ${ac.glow}, transparent 70%)` }}
                            />

                            {/* Dot matrix grid */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
                                style={{ backgroundImage: 'radial-gradient(#e0e1dd 0.7px, transparent 0.7px)', backgroundSize: '36px 36px' }} />

                            {/* Content layout — two-column on desktop */}
                            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-8 md:px-20 lg:px-32 pt-28 pb-20">

                                {/* ── Left: meta info ── */}
                                <motion.div
                                    className="flex flex-col gap-6 w-full md:w-[420px] flex-shrink-0"
                                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 30 }}
                                    transition={{ duration: 0.5, delay: isActive ? 0.2 : 0, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {/* Category badge */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ background: ac.accent }} />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.3em]" style={{ color: ac.accent }}>
                                            {CATEGORY_LABELS[p.category] || p.category}
                                        </span>
                                        <span className="text-[#778da9]/40 text-[10px] font-mono">{p.date}</span>
                                    </div>

                                    {/* Tagline */}
                                    <p className="text-[#778da9] text-sm md:text-base font-light leading-relaxed max-w-sm">
                                        {p.tagline}
                                    </p>

                                    {/* Description */}
                                    <p className="text-[#e0e1dd]/50 text-xs leading-relaxed max-w-sm line-clamp-4 md:line-clamp-5">
                                        {p.description}
                                    </p>

                                    {/* Tech stack */}
                                    {p.techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {p.techStack.slice(0, 5).map(t => (
                                                <span
                                                    key={t}
                                                    className="text-[9px] px-2.5 py-1 font-mono uppercase tracking-widest border"
                                                    style={{ borderColor: `${ac.accent}30`, color: ac.accent, background: `${ac.accent}08` }}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* CTAs */}
                                    <div className="flex items-center gap-4 pt-2">
                                        <Link
                                            href={`/work/${p.slug}`}
                                            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest border px-5 py-2.5 transition-all duration-300"
                                            style={{ borderColor: ac.accent, color: ac.accent }}
                                        >
                                            Case Study
                                            <svg className="group-hover:translate-x-1 transition-transform" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                        {p.liveLink && (
                                            <a
                                                href={p.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-mono uppercase tracking-widest text-[#778da9] hover:text-[#e0e1dd] transition-colors"
                                            >
                                                Live ↗
                                            </a>
                                        )}
                                        {p.collaborator && (
                                            <span className="text-[9px] font-mono text-[#778da9]/50 uppercase tracking-widest">
                                                w/ {p.collaborator.name}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>

                                {/* ── Right: visual ── */}
                                <motion.div
                                    className="relative flex-1 w-full md:w-auto h-[40vh] md:h-[65vh] max-h-[700px]"
                                    animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.96 }}
                                    transition={{ duration: 0.6, delay: isActive ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {/* Glow halo behind media */}
                                    <div
                                        className="absolute -inset-6 pointer-events-none rounded-sm blur-3xl opacity-40"
                                        style={{ background: ac.glow }}
                                    />

                                    {/* Media container */}
                                    <div className="relative w-full h-full border overflow-hidden" style={{ borderColor: `${ac.accent}20` }}>
                                        {hasVideo ? (
                                            <video
                                                key={p.id}
                                                src={resolveVideoSource({ videoPublicId: p.videoPublicId, videoUrl: p.videoUrl })}
                                                className="w-full h-full object-cover"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                            />
                                        ) : (
                                            <img
                                                src={p.imageUrl}
                                                alt={p.title}
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Glass overlay — subtle label bottom-left */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                                                {p.client}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Corner accent lines */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: ac.accent }} />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: ac.accent }} />
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Bottom: prev/next arrows + scroll hint ── */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6">
                <button
                    onClick={() => navigateTo(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="w-10 h-10 border border-[#778da9]/20 flex items-center justify-center text-[#778da9] hover:text-[#e0e1dd] hover:border-[#778da9]/60 disabled:opacity-20 transition-all cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                </button>

                <span className="text-[#778da9]/40 text-[10px] font-mono uppercase tracking-widest hidden md:block">
                    Scroll or arrow keys to navigate
                </span>

                <button
                    onClick={() => navigateTo(activeIndex + 1)}
                    disabled={activeIndex === total - 1}
                    className="w-10 h-10 border border-[#778da9]/20 flex items-center justify-center text-[#778da9] hover:text-[#e0e1dd] hover:border-[#778da9]/60 disabled:opacity-20 transition-all cursor-pointer"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
            </div>
        </main>
    );
}
