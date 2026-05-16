'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, PanInfo, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export interface MindMapNode {
    id: string;
    type: 'hub' | 'task' | 'project';
    label: string;
    description?: string;
    date?: string;
    x: number;
    y: number;
    link?: string;
}

export interface MindMapEdge {
    source: string;
    target: string;
    label?: string;
    animated?: boolean;
}

interface MindMapProps {
    nodes: MindMapNode[];
    edges: MindMapEdge[];
}

interface InteractiveWorkflowNodeMapProps {
    mindMap?: MindMapProps;
    journey?: any[];
    // Blueprint Takeover props
    blueprintMode?: boolean;
    autoPanTarget?: { x: number; y: number } | null;
    highlightCluster?: string[];
}

const NODE_W: Record<string, number> = { hub: 320, task: 280, project: 260 };
const NODE_H = 140;

export default function InteractiveWorkflowNodeMap({
    mindMap,
    journey,
    blueprintMode = false,
    autoPanTarget,
    highlightCluster = [],
}: InteractiveWorkflowNodeMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
    const [zoomLevel, setZoomLevel] = useState(blueprintMode ? 0.55 : 0.65);
    const [isPanning, setIsPanning] = useState(false);
    const [isImmersive, setIsImmersive] = useState(false);
    const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

    // Spring-animate the canvas offset for smooth auto-pan
    const targetOffsetX = useMotionValue(0);
    const targetOffsetY = useMotionValue(0);
    const springX = useSpring(targetOffsetX, { stiffness: 40, damping: 18 });
    const springY = useSpring(targetOffsetY, { stiffness: 40, damping: 18 });

    const bounds = useMemo(() => {
        if (!mindMap?.nodes.length) return { minX: 0, minY: 0, maxX: 2000, maxY: 1500, cx: 1000, cy: 750 };
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        mindMap.nodes.forEach(n => {
            minX = Math.min(minX, n.x - 200);
            minY = Math.min(minY, n.y - 100);
            maxX = Math.max(maxX, n.x + 200);
            maxY = Math.max(maxY, n.y + 100);
        });
        return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
    }, [mindMap]);

    // Initialize node positions
    useEffect(() => {
        if (mindMap?.nodes) {
            const pos: Record<string, { x: number; y: number }> = {};
            mindMap.nodes.forEach(n => { pos[n.id] = { x: n.x, y: n.y }; });
            setNodePositions(pos);
        }
    }, [mindMap]);

    // Auto-center on mount
    const centerCanvas = useCallback((zoom: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const ox = rect.width / 2 - bounds.cx * zoom;
        const oy = rect.height / 2 - bounds.cy * zoom;
        setCanvasOffset({ x: ox, y: oy });
        targetOffsetX.set(ox);
        targetOffsetY.set(oy);
    }, [bounds, targetOffsetX, targetOffsetY]);

    useEffect(() => {
        centerCanvas(zoomLevel);
    }, [mindMap, bounds]);

    // Blueprint mode: react to external autoPanTarget
    useEffect(() => {
        if (!blueprintMode || !autoPanTarget || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const nx = rect.width / 2 - autoPanTarget.x * zoomLevel;
        const ny = rect.height / 2 - autoPanTarget.y * zoomLevel;
        targetOffsetX.set(nx);
        targetOffsetY.set(ny);
    }, [autoPanTarget, blueprintMode, zoomLevel]);

    // Sync spring motion values back to canvasOffset for rendering
    useEffect(() => {
        const unsubX = springX.on('change', x => setCanvasOffset(prev => ({ ...prev, x })));
        const unsubY = springY.on('change', y => setCanvasOffset(prev => ({ y, x: prev.x })));
        return () => { unsubX(); unsubY(); };
    }, [springX, springY]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (isImmersive) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setZoomLevel(blueprintMode ? 0.55 : 0.65);
            centerCanvas(blueprintMode ? 0.55 : 0.65);
        }
    }, [isImmersive]);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (blueprintMode && !isImmersive) return; // In blueprint mode, only allow zoom in immersive
        e.preventDefault();
        setZoomLevel(prev => Math.min(Math.max(prev + e.deltaY * -0.001, 0.15), 3));
    }, [blueprintMode, isImmersive]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setZoomLevel(prev => prev < 0.8 ? 1 : prev < 1.5 ? 2 : (blueprintMode ? 0.55 : 0.65));
    }, [blueprintMode]);

    const handleBgMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-node]')) return;
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, ox: canvasOffset.x, oy: canvasOffset.y };
    }, [canvasOffset]);

    const handleBgMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPanning) return;
        const nx = panStart.current.ox + (e.clientX - panStart.current.x);
        const ny = panStart.current.oy + (e.clientY - panStart.current.y);
        setCanvasOffset({ x: nx, y: ny });
        targetOffsetX.jump(nx);
        targetOffsetY.jump(ny);
    }, [isPanning, targetOffsetX, targetOffsetY]);

    const handleBgMouseUp = useCallback(() => setIsPanning(false), []);

    const handleNodeDrag = useCallback((id: string, info: PanInfo) => {
        setNodePositions(prev => ({
            ...prev,
            [id]: {
                x: prev[id].x + info.delta.x / zoomLevel,
                y: prev[id].y + info.delta.y / zoomLevel,
            },
        }));
    }, [zoomLevel]);

    const generateSmartPath = useCallback((sx: number, sy: number, tx: number, ty: number) => {
        const dx = tx - sx, dy = ty - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const tension = Math.min(dist * 0.35, 180);
        if (Math.abs(dx) > Math.abs(dy)) {
            const s = dx > 0 ? 1 : -1;
            return `M ${sx} ${sy} C ${sx + tension * s} ${sy}, ${tx - tension * s} ${ty}, ${tx} ${ty}`;
        } else {
            const s = dy > 0 ? 1 : -1;
            return `M ${sx} ${sy} C ${sx} ${sy + tension * s}, ${tx} ${ty - tension * s}, ${tx} ${ty}`;
        }
    }, []);

    if (!mindMap || mindMap.nodes.length === 0) return null;

    const activeEdges = activeNodeId
        ? mindMap.edges.filter(e => e.source === activeNodeId || e.target === activeNodeId)
            .map(e => e.source === activeNodeId ? e.target : e.source)
        : [];

    // Blueprint mode: dimming is driven by highlightCluster from parent scroll
    const getNodeOpacity = (nodeId: string) => {
        if (blueprintMode && highlightCluster.length > 0) {
            return highlightCluster.includes(nodeId) ? 1 : 0.12;
        }
        if (activeNodeId) {
            return activeNodeId === nodeId || activeEdges.includes(nodeId) ? 1 : 0.2;
        }
        return 1;
    };

    const getEdgeOpacity = (edge: MindMapEdge) => {
        if (blueprintMode && highlightCluster.length > 0) {
            return highlightCluster.includes(edge.source) && highlightCluster.includes(edge.target) ? 1 : 0.06;
        }
        if (activeNodeId) {
            return activeNodeId === edge.source || activeNodeId === edge.target ? 1 : 0.08;
        }
        return 1;
    };

    const isHighlighted = (nodeId: string) => {
        if (highlightCluster.length > 0) return highlightCluster.includes(nodeId);
        if (activeNodeId) return activeNodeId === nodeId || activeEdges.includes(nodeId);
        return false;
    };

    // ─── Desktop Canvas ───
    if (!isMobile || isImmersive) {
        return (
            <div className={`flex flex-col w-full h-full ${isImmersive ? 'fixed inset-0 z-[100] bg-[#030910]' : ''}`}>
                {/* Immersive toolbar — only shown when NOT in blueprint mode */}
                {!blueprintMode && (
                    <div className={`flex items-center justify-between px-6 py-4 ${isImmersive ? 'border-b border-[#778da9]/10 bg-[#030910]/80 backdrop-blur-xl' : 'mb-3'}`}>
                        <div>
                            <h2 className="text-xl text-[#e0e1dd] font-mono tracking-tight">Mind Map</h2>
                            <p className="text-[#778da9] text-[9px] uppercase tracking-[0.3em] font-mono mt-0.5">Interactive Engineering Constellation</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[#778da9]/60 text-[10px] font-mono">{Math.round(zoomLevel * 100)}%</span>
                            <button
                                onClick={() => setIsImmersive(!isImmersive)}
                                className="px-4 py-2 border border-[#778da9]/25 text-[#e0e1dd] text-[10px] font-mono uppercase tracking-widest hover:bg-[#778da9]/10 transition-colors cursor-pointer"
                            >
                                {isImmersive ? 'Exit' : 'Expand'}
                            </button>
                        </div>
                    </div>
                )}

                <div
                    className={`relative w-full ${isImmersive ? 'flex-1 mt-[57px]' : blueprintMode ? 'h-full' : 'h-[680px] border border-[#778da9]/10'} overflow-hidden bg-[#030910] ${isPanning ? 'cursor-grabbing' : blueprintMode ? 'cursor-default' : 'cursor-grab'}`}
                    ref={containerRef}
                    onWheel={handleWheel}
                    onDoubleClick={!blueprintMode ? handleDoubleClick : undefined}
                    onMouseDown={!blueprintMode ? handleBgMouseDown : undefined}
                    onMouseMove={!blueprintMode ? handleBgMouseMove : undefined}
                    onMouseUp={handleBgMouseUp}
                    onMouseLeave={handleBgMouseUp}
                >
                    {/* Dot matrix */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            opacity: blueprintMode ? 0.08 : 0.12,
                            backgroundImage: 'radial-gradient(#778da9 0.7px, transparent 0.7px)',
                            backgroundSize: '32px 32px',
                        }}
                    />

                    {/* Canvas */}
                    <div
                        className="absolute top-0 left-0 origin-top-left"
                        style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoomLevel})` }}
                    >
                        {/* SVG Edges */}
                        <svg className="absolute pointer-events-none" style={{ zIndex: 0, left: 0, top: 0, width: 5000, height: 4000, overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="egDef" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#778da9" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="#778da9" stopOpacity="0.4" />
                                </linearGradient>
                                <linearGradient id="egAct" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#52b788" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#52b788" stopOpacity="1" />
                                </linearGradient>
                                <filter id="egGlow">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>

                            {mindMap.edges.map((edge, i) => {
                                const sp = nodePositions[edge.source];
                                const tp = nodePositions[edge.target];
                                if (!sp || !tp) return null;

                                const isEdgeActive = isHighlighted(edge.source) || isHighlighted(edge.target);
                                const opacity = getEdgeOpacity(edge);

                                return (
                                    <g key={`e-${i}`} style={{ opacity, transition: 'opacity 0.5s ease' }}>
                                        <path
                                            d={generateSmartPath(sp.x, sp.y, tp.x, tp.y)}
                                            fill="none"
                                            stroke={edge.animated || isEdgeActive ? 'url(#egAct)' : 'url(#egDef)'}
                                            strokeWidth={edge.animated ? 2.5 : isEdgeActive ? 2 : 1.5}
                                            strokeDasharray={edge.animated ? '8 6' : 'none'}
                                            filter={edge.animated ? 'url(#egGlow)' : undefined}
                                        />
                                        {edge.label && (
                                            <text
                                                x={(sp.x + tp.x) / 2}
                                                y={(sp.y + tp.y) / 2 - 10}
                                                fill={edge.animated || isEdgeActive ? '#52b788' : '#778da9'}
                                                fontSize="12"
                                                fontFamily="monospace"
                                                textAnchor="middle"
                                                style={{ letterSpacing: '0.15em' }}
                                            >
                                                {edge.label}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Nodes */}
                        {mindMap.nodes.map(node => {
                            const pos = nodePositions[node.id] || { x: node.x, y: node.y };
                            const isHub = node.type === 'hub';
                            const isProject = node.type === 'project';
                            const w = NODE_W[node.type] || 280;
                            const nodeOpacity = getNodeOpacity(node.id);
                            const highlighted = isHighlighted(node.id);
                            const draggable = !blueprintMode;

                            const nodeEl = (
                                <motion.div
                                    key={node.id}
                                    data-node="true"
                                    drag={draggable}
                                    dragMomentum={false}
                                    onDrag={draggable ? (_, info) => handleNodeDrag(node.id, info) : undefined}
                                    onMouseEnter={() => !blueprintMode && setActiveNodeId(node.id)}
                                    onMouseLeave={() => !blueprintMode && setActiveNodeId(null)}
                                    className={`absolute select-none backdrop-blur-md border transition-all duration-500
                                        ${isHub ? 'bg-[#0e1c2c]/90' : isProject ? 'bg-[#0a1a14]/90' : 'bg-[#0d1b2a]/85'}
                                        ${highlighted ? (isProject ? 'border-[#52b788]/80 shadow-[0_0_30px_rgba(82,183,136,0.2)]' : 'border-[#e0e1dd]/60 shadow-[0_0_25px_rgba(224,225,221,0.1)]') : (isProject ? 'border-[#52b788]/20' : isHub ? 'border-[#e0e1dd]/15' : 'border-[#778da9]/15')}
                                        ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                                    `}
                                    style={{
                                        left: pos.x - w / 2,
                                        top: pos.y - NODE_H / 2,
                                        width: w,
                                        opacity: nodeOpacity,
                                        zIndex: isProject ? 35 : isHub ? 30 : 20,
                                        transition: 'opacity 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                >
                                    <div className={`px-4 py-2.5 border-b flex items-center justify-between
                                        ${isHub ? 'bg-[#e0e1dd]/4 border-[#e0e1dd]/10' : isProject ? 'bg-[#52b788]/5 border-[#52b788]/15' : 'bg-[#112131]/40 border-[#778da9]/10'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isProject ? (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#52b788" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                            ) : (
                                                <div className={`w-2 h-2 rounded-full ${highlighted ? (isHub ? 'bg-[#e0e1dd]' : 'bg-[#52b788]') : 'bg-[#778da9]/50'} ${highlighted ? 'animate-pulse' : ''}`} />
                                            )}
                                            <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${isProject ? 'text-[#52b788]/70' : 'text-[#778da9]/60'}`}>{node.type}</span>
                                        </div>
                                        {node.date && <span className="text-[#778da9]/40 text-[10px] font-mono">{node.date}</span>}
                                    </div>
                                    <div className="p-4">
                                        <h4 className={`text-base font-mono font-medium leading-tight mb-2 ${isProject ? 'text-[#52b788]' : 'text-[#e0e1dd]'}`}>{node.label}</h4>
                                        {node.description && <p className="text-[#e0e1dd]/50 text-xs leading-relaxed line-clamp-3">{node.description}</p>}
                                    </div>
                                </motion.div>
                            );

                            if (isProject && node.link) {
                                return <Link key={node.id} href={`/work/${node.link}`} className="contents">{nodeEl}</Link>;
                            }
                            return nodeEl;
                        })}
                    </div>

                    {/* Controls pill — not in blueprint mode */}
                    {!blueprintMode && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0d1b2a]/90 backdrop-blur-xl border border-[#778da9]/15 px-5 py-2 rounded-full flex gap-4 items-center text-[9px] font-mono text-[#778da9]/60 pointer-events-none z-50 shadow-2xl">
                            <span>Scroll → Zoom</span>
                            <span className="w-px h-3 bg-[#778da9]/20" />
                            <span>Double-click → Snap</span>
                            <span className="w-px h-3 bg-[#778da9]/20" />
                            <span>Drag → Pan / Remap</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── Mobile: Expandable Hub Tree ───
    const hubs = mindMap.nodes.filter(n => n.type === 'hub');
    const projectNodes = mindMap.nodes.filter(n => n.type === 'project');
    const children: Record<string, string[]> = {};
    mindMap.edges.forEach(e => {
        if (!children[e.source]) children[e.source] = [];
        children[e.source].push(e.target);
    });

    const [mobileExpanded, setMobileExpanded] = useState<Set<string>>(new Set());
    const toggleExpand = (id: string) => setMobileExpanded(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <div className="flex flex-col gap-3 py-10 px-4">
            <div className="pb-4 mb-1 border-b border-[#778da9]/10">
                <h2 className="text-lg text-[#e0e1dd] font-mono">Mind Map</h2>
                <p className="text-[#778da9] text-[9px] uppercase tracking-[0.25em] mt-1 font-mono">Tap phases to explore</p>
            </div>

            {projectNodes.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto pb-3 hide-scrollbar">
                    {projectNodes.map(p => (
                        <Link href={`/work/${p.link}`} key={p.id}>
                            <div className="min-w-[160px] bg-[#0a1a14]/60 border border-[#52b788]/20 p-3.5 flex-shrink-0 active:scale-95 transition-transform">
                                <span className="text-[8px] text-[#52b788]/60 font-mono tracking-[0.2em] uppercase">Linked</span>
                                <h4 className="text-[#52b788] text-sm font-mono mt-0.5">{p.label}</h4>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {hubs.map(hub => {
                const hubChildren = (children[hub.id] || []).map(cid => mindMap.nodes.find(n => n.id === cid)).filter(Boolean) as MindMapNode[];
                const isExp = mobileExpanded.has(hub.id);
                return (
                    <div key={hub.id} className="border border-[#778da9]/10 bg-[#0d1b2a]/50">
                        <button onClick={() => toggleExpand(hub.id)} className="w-full flex items-center justify-between p-4 active:bg-[#778da9]/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#e0e1dd] rounded-full" />
                                <span className="text-[#e0e1dd] text-sm font-mono text-left">{hub.label}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {hubChildren.length > 0 && <span className="text-[#778da9]/50 text-[10px] font-mono">{hubChildren.length}</span>}
                                <motion.div animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#778da9" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                </motion.div>
                            </div>
                        </button>
                        <AnimatePresence initial={false}>
                            {isExp && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-[#778da9]/8 p-3 flex flex-col gap-2">
                                        {hubChildren.map(child => (
                                            <div key={child.id} className={`p-3 border-l-2 ${child.type === 'project' ? 'border-[#52b788]/50 bg-[#52b788]/5' : 'border-[#778da9]/20 bg-[#112131]/25'}`}>
                                                <span className={`text-[8px] font-mono tracking-[0.15em] uppercase ${child.type === 'project' ? 'text-[#52b788]/60' : 'text-[#778da9]/50'}`}>{child.type}</span>
                                                <h5 className={`text-xs font-mono font-medium mt-0.5 ${child.type === 'project' ? 'text-[#52b788]' : 'text-[#e0e1dd]'}`}>{child.label}</h5>
                                                {child.description && <p className="text-[#e0e1dd]/35 text-[10px] mt-1 leading-relaxed">{child.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
            <style jsx>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        </div>
    );
}
