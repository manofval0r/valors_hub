'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

// ─── Node definitions — 17 projects in a 3-ring orbital layout ───
// Ring 0 (centre): flagship full-stack projects
// Ring 1 (inner):  substantial client + personal work
// Ring 2 (outer):  side-projects and experimental builds
const CONSTELLATION_NODES = [
    // Ring 0 — Flagship
    { slug: 'koji-ai-chief-of-staff',         title: 'Koji',              tagline: 'AI Chief of Staff for Student Devs',         tech: ['React Native', 'Supabase', 'Node.js', 'LLMs'],                      ring: 0, angle: 0,    category: 'side-project' },
    { slug: 'amber',                           title: 'Amber',             tagline: 'Geospatial Mental Health Platform',          tech: ['Next.js', 'Supabase', 'Mapbox', 'TypeScript'],                     ring: 0, angle: 90,   category: 'full-stack' },
    { slug: 'budgetfit',                       title: 'BudgetFit',         tagline: 'Desktop Financial Tracker',                 tech: ['JavaFX', 'Java', 'SQLite', 'Maven'],                                ring: 0, angle: 180,  category: 'full-stack' },
    { slug: 'whats-next',                      title: "What's Next",       tagline: 'AI-Powered Career Roadmap Generator',       tech: ['Django', 'React', 'Celery', 'Redis', 'LLMs'],                      ring: 0, angle: 270,  category: 'side-project' },

    // Ring 1 — Substantial work
    { slug: 'ontrack',                           title: 'OnTrack',           tagline: 'Conversational AI Accountability Tracker',  tech: ['React', 'React Native', 'Django', 'Supabase', 'Nemotron AI'], ring: 1, angle: 337,  category: 'full-stack' },
    { slug: 'recengine',                       title: 'recEngine',         tagline: 'LangGraph Recommendation Agent',            tech: ['Python', 'FastAPI', 'LangGraph', 'Vector DB'],                     ring: 1, angle: 0,    category: 'full-stack' },
    { slug: 'the-junxtion-platform',           title: 'The Junxtion',      tagline: 'University Learning Platform',              tech: ['Next.js', 'TypeScript', 'Java', 'PostgreSQL'],                     ring: 1, angle: 45,   category: 'full-stack' },
    { slug: 'restaurant-website',              title: 'Sidedish Foods',    tagline: 'Restaurant Website with Order Flow',        tech: ['HTML', 'CSS', 'JavaScript', 'Node.js'],                            ring: 1, angle: 90,   category: 'web' },
    { slug: 'midwife-tracking-payroll-system', title: 'Midwife Tracker',   tagline: 'Automated Healthcare Payroll',              tech: ['JavaScript', 'Google Apps Script', 'HTML'],                        ring: 1, angle: 135,  category: 'full-stack' },
    { slug: 'hashebi-global-services',         title: 'Hashebi',           tagline: 'Construction Company Showcase',             tech: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],          ring: 1, angle: 180,  category: 'web' },
    { slug: 'ap-calculus-bc-platform',         title: 'AP Calculus',       tagline: 'Online Course Platform',                   tech: ['HTML', 'CSS', 'JavaScript', 'Google Apps Script', 'Stripe'],       ring: 1, angle: 225,  category: 'web' },
    { slug: 'client-portfolio-websites',       title: 'Client Portfolios', tagline: 'Custom Portfolio Sites',                   tech: ['HTML', 'CSS', 'JavaScript', 'Next.js'],                            ring: 1, angle: 270,  category: 'web' },
    { slug: 'company-projects',                title: 'VoicePatches',      tagline: 'Corporate Consulting Website',              tech: ['HTML', 'CSS', 'JavaScript'],                                       ring: 1, angle: 315,  category: 'web' },

    // Ring 2 — Side projects & experimental
    { slug: 'davidowu-portfolio',              title: 'This Portfolio',    tagline: 'Cinematic Scroll-Reel Showcase',            tech: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Cloudinary'],         ring: 2, angle: 22,   category: 'web' },
    { slug: 'solar-market-trend-analyzer',     title: 'Solar Analyzer',    tagline: 'Real-Time Market Trend Scraper',            tech: ['Node.js', 'Express.js', 'JavaScript'],                             ring: 2, angle: 112,  category: 'side-project' },
    { slug: 'klos-house-prototype',            title: "Klo's House",       tagline: 'Fashion E-Commerce Prototype',              tech: ['HTML', 'CSS', 'JavaScript', 'GSAP'],                               ring: 2, angle: 202,  category: 'side-project' },
    { slug: 'smthn-gd',                        title: 'SMTHN.GD',          tagline: 'Local AI Assistant Ecosystem',              tech: ['Python', 'Conda', 'PyTorch', 'DeepSeek'],                          ring: 2, angle: 292,  category: 'side-project' },
];

// Monochrome — density encodes match, never hue.
const CATEGORY_INK: Record<string, string> = {
    'full-stack': 'var(--ink-strong)',
    'web': 'var(--ink-soft)',
    'side-project': 'var(--ink-faint)',
};

// Technologies to show in the filter bar (union from above)
const FILTER_TECHS = [
    'Next.js', 'Supabase', 'TypeScript', 'LLMs', 'Python',
    'React', 'React Native', 'Django', 'Node.js', 'Framer Motion',
    'Google Apps Script', 'Java', 'HTML',
];

// Ring radii
const RING_RADII = [0, 190, 330];

function getNodePosition(node: typeof CONSTELLATION_NODES[0], cx: number, cy: number) {
    const r = RING_RADII[node.ring];
    if (r === 0) {
        // Centre nodes — arrange in a small 2×2 cluster
        const miniOffsets = [{ x: -70, y: -50 }, { x: 70, y: -50 }, { x: -70, y: 50 }, { x: 70, y: 50 }];
        const idx = CONSTELLATION_NODES.filter(n => n.ring === 0).indexOf(node);
        const off = miniOffsets[idx] || { x: 0, y: 0 };
        return { x: cx + off.x, y: cy + off.y };
    }
    const rad = (node.angle * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Build edges between nodes sharing any technology
function buildEdges(nodes: typeof CONSTELLATION_NODES) {
    const edges: { source: number; target: number; tech: string }[] = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const shared = nodes[i].tech.find(t => nodes[j].tech.includes(t));
            if (shared) {
                edges.push({ source: i, target: j, tech: shared });
            }
        }
    }
    return edges;
}

interface TooltipState {
    nodeIdx: number;
    x: number;
    y: number;
}

export default function GlobalConstellation() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [tooltip, setTooltip] = useState<TooltipState | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isInteracting, setIsInteracting] = useState(false);
    const animFrameRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Measure container
    useEffect(() => {
        if (!canvasRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setDimensions({ w: width, h: height });
            }
        });

        observer.observe(canvasRef.current);
        return () => observer.disconnect();
    }, []);

    // Slow idle rotation (0.4 deg / sec). Angle accumulates in a ref and
    // commits to state at ~30fps so the tree never re-renders per frame.
    // Rotation pauses while interacting and snaps back cleanly after.
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        let acc = 0;
        const tick = (time: number) => {
            if (!isInteracting) {
                const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
                acc += delta * 0.4;
                if (acc >= 0.02) {
                    const step = acc;
                    acc = 0;
                    setRotation(prev => (prev + step) % 360);
                }
            }
            lastTimeRef.current = time;
            animFrameRef.current = requestAnimationFrame(tick);
        };
        animFrameRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [isInteracting]);

    const cx = dimensions.w / 2;
    const cy = dimensions.h / 2;

    const edges = useMemo(() => buildEdges(CONSTELLATION_NODES), []);

    // Node positions incorporating rotation for ring 1 and 2
    const nodePositions = useMemo(() => {
        return CONSTELLATION_NODES.map(node => {
            if (node.ring === 0) return getNodePosition(node, cx, cy);
            const r = RING_RADII[node.ring];
            const rad = ((node.angle + rotation) * Math.PI) / 180;
            return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
        });
    }, [cx, cy, rotation]);

    const isNodeActive = useCallback((idx: number) => {
        if (!activeFilter) return true;
        return CONSTELLATION_NODES[idx].tech.includes(activeFilter);
    }, [activeFilter]);

    const isEdgeActive = useCallback((edge: { source: number; target: number; tech: string }) => {
        if (!activeFilter) return true;
        return edge.tech === activeFilter;
    }, [activeFilter]);

    const handleNodeClick = useCallback((node: typeof CONSTELLATION_NODES[0]) => {
        trackEvent('constellation_node_clicked', { slug: node.slug, title: node.title });
    }, []);

    const handleFilterClick = useCallback((tech: string) => {
        setActiveFilter(prev => prev === tech ? null : tech);
        trackEvent('constellation_tech_filter_applied', { tech });
    }, []);

    const NODE_R = 7; // node dot radius
    const hasDimensions = dimensions.w > 0 && dimensions.h > 0;

    // Entrance choreography, one shot per mount and filter change.
    // Transform and opacity only; positions stay React-owned so the
    // idle rotation can never fight the animation.
    useEffect(() => {
        if (!hasDimensions) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const root = canvasRef.current;
        if (!root) return;
        const nodes = Array.from(root.querySelectorAll('.cx-node'));
        const edges = Array.from(root.querySelectorAll('.cx-edge')) as (SVGLineElement & ElementCSSInlineStyle)[];
        const rings = Array.from(root.querySelectorAll('.cx-ring'));
        // Edge draw-in: dash the full length, then release to zero.
        const lens: number[] = edges.map((el) => {
            try {
                const len = el.getTotalLength?.() ?? 0;
                if (len > 0) {
                    el.style.strokeDasharray = `${len}`;
                    el.style.strokeDashoffset = `${len}`;
                }
                return len;
            } catch { /* non-geometry element, leave solid */ return 0; }
        });
        const anims = [
            animate(rings, { opacity: [0, 0.18], duration: 600, ease: 'outQuad' }),
            animate(edges, {
                strokeDashoffset: [ (_el: Element, i: number) => lens[i] ?? 0, 0 ],
                duration: 520, delay: stagger(7), ease: 'outExpo',
            }),
            // Scale only: opacity stays React-owned (filter dimming),
            // so the two never write the same property.
            animate(nodes, { scale: [0, 1], duration: 420, delay: stagger(26, { start: 150 }), ease: 'outExpo' }),
        ];
        return () => {
            anims.forEach((a) => a.pause());
            edges.forEach((el) => {
                el.style.strokeDasharray = '';
                el.style.strokeDashoffset = '';
            });
        };
    }, [hasDimensions, activeFilter]);

    return (
        <div
            ref={canvasRef}
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsInteracting(true)}
            onMouseLeave={() => { setIsInteracting(false); setTooltip(null); }}
        >
            {hasDimensions && (
                <>
            {/* Dot matrix background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.5,
                    backgroundImage: 'radial-gradient(var(--ground-dot) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }}
            />

            {/* ── SVG layer: ring circles + edges ── */}
            <svg
                className="absolute inset-0 pointer-events-none"
                width={dimensions.w}
                height={dimensions.h}
            >

                {/* Ring guide circles */}
                {[1, 2].map(ring => (
                    <circle
                        key={ring}
                        className="cx-ring"
                        cx={cx} cy={cy}
                        r={RING_RADII[ring]}
                        fill="none"
                        stroke="var(--ink-strong)"
                        strokeWidth="0.5"
                        strokeDasharray="4 8"
                        opacity="0.18"
                    />
                ))}

                {/* Edges */}
                {edges.map((edge, i) => {
                    const sp = nodePositions[edge.source];
                    const tp = nodePositions[edge.target];
                    const active = isEdgeActive(edge);
                    return (
                        <line
                            key={i}
                            className="cx-edge"
                            x1={sp.x} y1={sp.y}
                            x2={tp.x} y2={tp.y}
                            stroke="var(--ink-strong)"
                            strokeWidth={active ? 1 : 0.6}
                            opacity={active ? (activeFilter ? 0.6 : 0.18) : 0.05}
                            style={{ transition: 'opacity 0.4s ease, stroke-width 0.3s ease' }}
                        />
                    );
                })}
            </svg>

            {/* ── Node dots ── */}
            {CONSTELLATION_NODES.map((node, idx) => {
                const pos = nodePositions[idx];
                const active = isNodeActive(idx);
                const accent = CATEGORY_INK[node.category] ?? 'var(--ink-strong)';
                const isHovered = tooltip?.nodeIdx === idx;

                return (
                    <Link
                        key={node.slug}
                        href={`/work/${node.slug}`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => { setTooltip({ nodeIdx: idx, x: pos.x, y: pos.y }); }}
                        onMouseLeave={() => setTooltip(null)}
                        className="cx-node absolute -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            zIndex: isHovered ? 50 : 20,
                            opacity: active ? 1 : 0.12,
                            transition: 'opacity 0.4s ease, left 0.05s linear, top 0.05s linear',
                        }}
                        aria-label={node.title}
                    >
                        {/* Outer ring on hover */}
                        <span
                            className="absolute rounded-full -inset-3 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                            style={{ borderColor: 'var(--ink-strong)' }}
                        />
                        {/* Node dot */}
                        <span
                            className="relative block rounded-full transition-transform duration-200 group-hover:scale-150"
                            style={{
                                width: NODE_R * 2,
                                height: NODE_R * 2,
                                background: 'var(--ink-strong)',
                                opacity: isHovered ? 1 : 0.75,
                            }}
                        />
                    </Link>
                );
            })}

            {/* ── Tooltip ── */}
            <AnimatePresence>
                {tooltip !== null && (() => {
                    const node = CONSTELLATION_NODES[tooltip.nodeIdx];
                    const pos = nodePositions[tooltip.nodeIdx];
                    const accent = 'var(--ink-strong)';
                    // Keep tooltip on screen
                    const toRight = pos.x < dimensions.w * 0.65;
                    const toBottom = pos.y < dimensions.h * 0.65;
                    return (
                        <motion.div
                            key="tooltip"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.18 }}
                            className="absolute pointer-events-none z-50 max-w-[220px]"
                            style={{
                                left: toRight ? pos.x + 20 : pos.x - 20,
                                top: toBottom ? pos.y + 20 : pos.y - 20,
                                transform: `translate(${toRight ? 0 : -100}%, ${toBottom ? 0 : -100}%)`,
                            }}
                        >
                            <div
                                className="backdrop-blur-xl border p-3"
                                style={{ borderColor: 'var(--rule-strong)', background: 'color-mix(in srgb, var(--ground) 94%, transparent)' }}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                                    <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>
                                        {node.category === 'full-stack' ? 'Full Stack' : node.category === 'side-project' ? 'Side Project' : 'Web'}
                                    </span>
                                </div>
                                <h4 className="text-sm font-mono font-medium leading-tight mb-1" style={{ color: 'var(--ink-strong)' }}>{node.title}</h4>
                                <p className="text-[11px] leading-snug" style={{ color: 'var(--ink-faint)' }}>{node.tagline}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {node.tech.slice(0, 3).map(t => (
                                        <span key={t} className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}>
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[9px] font-mono mt-2 uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>Click to view case study</p>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* ── Tech filter bar ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-2 max-w-[700px] px-4">
                {FILTER_TECHS.map(tech => {
                    const active = activeFilter === tech;
                    return (
                        <button
                            key={tech}
                            onClick={() => handleFilterClick(tech)}
                            aria-pressed={active}
                            className="weight-hover px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-colors cursor-pointer rounded-[2px]"
                            style={{
                                borderColor: active ? 'var(--ink-strong)' : 'var(--rule)',
                                color: active ? 'var(--accent-ink)' : 'var(--ink-faint)',
                                background: active ? 'var(--ink-strong)' : 'transparent',
                                fontWeight: active ? 700 : 400,
                            }}
                        >
                            {tech}
                        </button>
                    );
                })}
                {activeFilter && (
                    <button
                        onClick={() => setActiveFilter(null)}
                        className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-colors cursor-pointer rounded-[2px]"
                        style={{ borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}
                    >
                        Clear</button>
                )}
            </div>

            {/* Legend: docked left so the world toggle keeps the right rail */}
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-2 px-3 py-2.5 border rounded-[2px] backdrop-blur-md" style={{ borderColor: 'var(--rule)', background: 'color-mix(in srgb, var(--ground) 85%, transparent)' }}>
                {Object.entries(CATEGORY_INK).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--ink-faint)' }}>
                            {cat === 'full-stack' ? 'Full Stack' : cat === 'side-project' ? 'Side Project' : 'Web'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Instructions hint */}
            <div className="absolute bottom-24 left-6 z-30 hidden md:flex flex-col gap-1 items-start">
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>Hover to inspect</span>
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>Click for case study</span>
                <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--ink-faint)' }}>Filter highlights connections</span>
            </div>
                </>
            )}
        </div>
    );
}
