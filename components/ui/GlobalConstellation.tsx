'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

// ─── Node definitions — 16 projects in a 3-ring orbital layout ───
// Ring 0 (centre): flagship full-stack projects
// Ring 1 (inner):  substantial client + personal work
// Ring 2 (outer):  side-projects and experimental builds
const CONSTELLATION_NODES = [
    // Ring 0 — Flagship
    { slug: 'koji-ai-chief-of-staff',         title: 'Koji',              tagline: 'AI Chief of Staff for Student Devs',         tech: ['React Native', 'Supabase', 'Node.js', 'LLMs'],                      ring: 0, angle: 0,    category: 'full-stack' },
    { slug: 'amber',                           title: 'Amber',             tagline: 'Geospatial Mental Health Platform',          tech: ['Next.js', 'Supabase', 'Mapbox', 'TypeScript'],                     ring: 0, angle: 90,   category: 'full-stack' },
    { slug: 'budgetfit',                       title: 'BudgetFit',         tagline: 'Desktop Financial Tracker',                 tech: ['JavaFX', 'Java', 'SQLite', 'Maven'],                                ring: 0, angle: 180,  category: 'full-stack' },
    { slug: 'whats-next',                      title: "What's Next",       tagline: 'AI-Powered Career Roadmap Generator',       tech: ['Django', 'React', 'Celery', 'Redis', 'LLMs'],                      ring: 0, angle: 270,  category: 'full-stack' },

    // Ring 1 — Substantial work
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

// Tech → accent color for filter tags
const TECH_COLORS: Record<string, string> = {
    'Next.js':             '#52b788',
    'React Native':        '#61dafb',
    'LLMs':                '#a78bfa',
    'LangGraph':           '#a78bfa',
    'Supabase':            '#3ecf8e',
    'TypeScript':          '#3178c6',
    'Python':              '#f7c948',
    'Framer Motion':       '#e879f9',
    'Node.js':             '#8cc84b',
    'HTML':                '#e34f26',
    'Google Apps Script':  '#4285f4',
    'Java':                '#f89820',
    'JavaFX':              '#f89820',
};

// Category accent colours
const CATEGORY_ACCENT: Record<string, string> = {
    'full-stack': '#52b788',
    'web':        '#38bdf8',
    'side-project': '#fb923c',
};

// Technologies to show in the filter bar (union from above)
const FILTER_TECHS = [
    'Next.js', 'Supabase', 'TypeScript', 'LLMs', 'Python',
    'React Native', 'Node.js', 'Framer Motion', 'Google Apps Script',
    'Java', 'HTML',
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

    // Slow idle rotation (0.4 deg / sec)
    useEffect(() => {
        const tick = (time: number) => {
            if (!isInteracting) {
                const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0;
                setRotation(prev => (prev + delta * 0.4) % 360);
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
                    opacity: 0.06,
                    backgroundImage: 'radial-gradient(#778da9 0.8px, transparent 0.8px)',
                    backgroundSize: '36px 36px',
                }}
            />

            {/* Radial glow at centre */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(82,183,136,0.06), transparent 70%)' }}
            />

            {/* ── SVG layer: ring circles + edges ── */}
            <svg
                className="absolute inset-0 pointer-events-none"
                width={dimensions.w}
                height={dimensions.h}
            >
                <defs>
                    <filter id="glow-edge">
                        <feGaussianBlur stdDeviation="2.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Ring guide circles */}
                {[1, 2].map(ring => (
                    <circle
                        key={ring}
                        cx={cx} cy={cy}
                        r={RING_RADII[ring]}
                        fill="none"
                        stroke="#778da9"
                        strokeWidth="0.5"
                        strokeDasharray="4 8"
                        opacity="0.15"
                    />
                ))}

                {/* Edges */}
                {edges.map((edge, i) => {
                    const sp = nodePositions[edge.source];
                    const tp = nodePositions[edge.target];
                    const active = isEdgeActive(edge);
                    const accent = TECH_COLORS[edge.tech] || '#778da9';
                    return (
                        <line
                            key={i}
                            x1={sp.x} y1={sp.y}
                            x2={tp.x} y2={tp.y}
                            stroke={active ? accent : '#778da9'}
                            strokeWidth={active ? 1.2 : 0.5}
                            opacity={active ? (activeFilter ? 0.65 : 0.2) : 0.05}
                            filter={active && activeFilter ? 'url(#glow-edge)' : undefined}
                            style={{ transition: 'opacity 0.4s ease, stroke-width 0.3s ease' }}
                        />
                    );
                })}
            </svg>

            {/* ── Node dots ── */}
            {CONSTELLATION_NODES.map((node, idx) => {
                const pos = nodePositions[idx];
                const active = isNodeActive(idx);
                const accent = CATEGORY_ACCENT[node.category];
                const isHovered = tooltip?.nodeIdx === idx;

                return (
                    <Link
                        key={node.slug}
                        href={`/work/${node.slug}`}
                        onClick={() => handleNodeClick(node)}
                        onMouseEnter={() => { setTooltip({ nodeIdx: idx, x: pos.x, y: pos.y }); }}
                        onMouseLeave={() => setTooltip(null)}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            zIndex: isHovered ? 50 : 20,
                            opacity: active ? 1 : 0.12,
                            transition: 'opacity 0.4s ease, left 0.05s linear, top 0.05s linear',
                        }}
                        aria-label={node.title}
                    >
                        {/* Outer pulse ring on hover */}
                        <span
                            className="absolute rounded-full -inset-3 scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-40 transition-all duration-300"
                            style={{ background: accent }}
                        />
                        {/* Node dot */}
                        <span
                            className="relative block rounded-full transition-transform duration-200 group-hover:scale-150"
                            style={{
                                width: NODE_R * 2,
                                height: NODE_R * 2,
                                background: isHovered ? accent : `${accent}99`,
                                boxShadow: isHovered ? `0 0 16px ${accent}80` : 'none',
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
                    const accent = CATEGORY_ACCENT[node.category];
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
                                className="bg-[#0d1b2a]/95 backdrop-blur-xl border p-3"
                                style={{ borderColor: `${accent}40` }}
                            >
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                                    <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: accent }}>
                                        {node.category === 'full-stack' ? 'Full Stack' : node.category === 'side-project' ? 'Side Project' : 'Web'}
                                    </span>
                                </div>
                                <h4 className="text-[#e0e1dd] text-sm font-mono font-medium leading-tight mb-1">{node.title}</h4>
                                <p className="text-[#778da9] text-[11px] leading-snug">{node.tagline}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {node.tech.slice(0, 3).map(t => (
                                        <span key={t} className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 border border-[#778da9]/20 text-[#778da9]/70">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-[#52b788]/50 text-[9px] font-mono mt-2 uppercase tracking-widest">Click to view case study →</p>
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* ── Tech filter bar ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center gap-2 max-w-[700px] px-4">
                {FILTER_TECHS.map(tech => {
                    const active = activeFilter === tech;
                    const color = TECH_COLORS[tech] || '#778da9';
                    return (
                        <button
                            key={tech}
                            onClick={() => handleFilterClick(tech)}
                            className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border transition-all duration-250 cursor-pointer"
                            style={{
                                borderColor: active ? color : 'rgba(119,141,169,0.2)',
                                color: active ? color : '#778da9',
                                background: active ? `${color}12` : 'transparent',
                                boxShadow: active ? `0 0 12px ${color}30` : 'none',
                            }}
                        >
                            {tech}
                        </button>
                    );
                })}
                {activeFilter && (
                    <button
                        onClick={() => setActiveFilter(null)}
                        className="px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest border border-[#778da9]/20 text-[#778da9]/50 hover:text-[#778da9] hover:border-[#778da9]/40 transition-all duration-200 cursor-pointer"
                    >
                        Clear ✕
                    </button>
                )}
            </div>

            {/* ── Legend ── */}
            <div className="absolute top-6 right-6 z-30 flex flex-col gap-2">
                {Object.entries(CATEGORY_ACCENT).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#778da9]/60">
                            {cat === 'full-stack' ? 'Full Stack' : cat === 'side-project' ? 'Side Project' : 'Web'}
                        </span>
                    </div>
                ))}
            </div>

            {/* ── Instructions hint ── */}
            <div className="absolute bottom-24 right-6 z-30 hidden md:flex flex-col gap-1 items-end">
                <span className="text-[9px] font-mono text-[#778da9]/30 uppercase tracking-widest">Hover → inspect</span>
                <span className="text-[9px] font-mono text-[#778da9]/30 uppercase tracking-widest">Click → case study</span>
                <span className="text-[9px] font-mono text-[#778da9]/30 uppercase tracking-widest">Filter → highlight connections</span>
            </div>
                </>
            )}
        </div>
    );
}
