'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
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
    const [mounted, setMounted] = useState(false);
    // Gated: SSR and first client pass render the desktop canvas.
    const showDesktop = !mounted || !isMobile;
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
        setMounted(true);
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

    // Node drag: single source of truth is nodePositions state. Pointer
    // deltas (screen px) are converted with the live zoomLevel. No library
    // writes transforms on nodes, so position can never double-apply.
    const nodeDragRef = useRef<{
        id: string; pointerX: number; pointerY: number;
        startX: number; startY: number; moved: boolean;
        pending: { x: number; y: number } | null; raf: number;
    } | null>(null);

    const beginNodeDrag = useCallback((id: string, e: React.PointerEvent, start: { x: number; y: number }) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        nodeDragRef.current = {
            id, pointerX: e.clientX, pointerY: e.clientY,
            startX: start.x, startY: start.y, moved: false, pending: null, raf: 0,
        };
    }, []);

    const moveNodeDrag = useCallback((e: React.PointerEvent, zoom: number) => {
        const d = nodeDragRef.current;
        if (!d) return;
        const dx = (e.clientX - d.pointerX) / zoom;
        const dy = (e.clientY - d.pointerY) / zoom;
        if (Math.abs(e.clientX - d.pointerX) + Math.abs(e.clientY - d.pointerY) > 4) d.moved = true;
        d.pending = { x: d.startX + dx, y: d.startY + dy };
        cancelAnimationFrame(d.raf);
        d.raf = requestAnimationFrame(() => {
            const cur = nodeDragRef.current;
            if (!cur || !cur.pending) return;
            const p = cur.pending;
            cur.pending = null;
            setNodePositions(prev => ({ ...prev, [cur.id]: p }));
        });
    }, []);

    const endNodeDrag = useCallback(() => {
        const d = nodeDragRef.current;
        if (d) {
            cancelAnimationFrame(d.raf);
            if (d.pending) {
                const p = d.pending;
                setNodePositions(prev => ({ ...prev, [d.id]: p }));
            }
            // Keep moved=true briefly so the wrapping Link click is suppressed.
            const wasMoved = d.moved;
            nodeDragRef.current = wasMoved ? { ...d, pending: null, raf: 0 } : null;
            if (wasMoved) setTimeout(() => { nodeDragRef.current = null; }, 0);
        }
    }, []);

    const suppressDragClick = useCallback((e: React.SyntheticEvent) => {
        if (nodeDragRef.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    useEffect(() => () => {
        if (nodeDragRef.current) cancelAnimationFrame(nodeDragRef.current.raf);
    }, []);

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
    if (showDesktop || isImmersive) {
        return (
            <div className={`flex flex-col w-full h-full ${isImmersive ? 'fixed inset-0 z-[100] bg-[var(--ground)]' : ''}`}>
                {/* Immersive toolbar — only shown when NOT in blueprint mode */}
                {!blueprintMode && (
                    <div className={`flex items-center justify-between px-6 py-4 ${isImmersive ? 'border-b border-[var(--rule)] bg-[var(--ground)]' : 'mb-3'}`}>
                        <div>
                            <h2 className="text-xl text-[var(--ink-strong)] font-mono tracking-tight">Mind Map</h2>
                            <p className="text-[var(--ink-faint)] text-[9px] uppercase tracking-[0.3em] font-mono mt-0.5">Interactive Engineering Constellation</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[var(--ink-faint)] text-[10px] font-mono">{Math.round(zoomLevel * 100)}%</span>
                            <button
                                onClick={() => setIsImmersive(!isImmersive)}
                                className="px-4 py-2 border border-[var(--rule-strong)] text-[var(--ink-strong)] text-[10px] font-mono uppercase tracking-widest hover:bg-[var(--ground-2)] transition-colors cursor-pointer rounded-[2px]"
                            >
                                {isImmersive ? 'Exit' : 'Expand'}
                            </button>
                        </div>
                    </div>
                )}

                <div
                    className={`relative w-full ${isImmersive ? 'flex-1 mt-[57px]' : blueprintMode ? 'h-full' : 'h-[680px] border border-[var(--rule)]'} overflow-hidden bg-[var(--ground)] ${isPanning ? 'cursor-grabbing' : blueprintMode ? 'cursor-default' : 'cursor-grab'}`}
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
                            backgroundImage: 'radial-gradient(var(--rule-strong) 0.7px, transparent 0.7px)',
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
                                    <stop offset="0%" stopColor="var(--ink-faint)" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="var(--ink-faint)" stopOpacity="0.4" />
                                </linearGradient>
                                <linearGradient id="egAct" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--ink-strong)" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="var(--ink-strong)" stopOpacity="1" />
                                </linearGradient>
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
                                        />
                                        {edge.label && (
                                            <text
                                                x={(sp.x + tp.x) / 2}
                                                y={(sp.y + tp.y) / 2 - 10}
                                                fill={edge.animated || isEdgeActive ? 'var(--ink-strong)' : 'var(--ink-faint)'}
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
                                <div
                                    key={node.id}
                                    data-node="true"
                                    onPointerDown={draggable ? (e) => beginNodeDrag(node.id, e, pos) : undefined}
                                    onPointerMove={draggable ? (e) => { if (nodeDragRef.current?.id === node.id) moveNodeDrag(e, zoomLevel); } : undefined}
                                    onPointerUp={draggable ? endNodeDrag : undefined}
                                    onPointerCancel={draggable ? endNodeDrag : undefined}
                                    onClickCapture={suppressDragClick}
                                    onMouseEnter={() => !blueprintMode && setActiveNodeId(node.id)}
                                    onMouseLeave={() => !blueprintMode && setActiveNodeId(null)}
                                    className={`absolute select-none border rounded-[2px] transition-all duration-500
                                        ${isHub ? 'bg-[var(--ground-2)]' : isProject ? 'bg-[var(--ground-2)]' : 'bg-[var(--ground)]'}
                                        ${highlighted ? 'border-[var(--rule-fn)]' : isProject ? 'border-[var(--rule-strong)]' : isHub ? 'border-[var(--rule-strong)]' : 'border-[var(--rule)]'}
                                        ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                                    `}
                                    style={{
                                        left: pos.x - w / 2,
                                        top: pos.y - NODE_H / 2,
                                        width: w,
                                        opacity: nodeOpacity,
                                        zIndex: isProject ? 35 : isHub ? 30 : 20,
                                        transition: 'opacity 0.5s ease, border-color 0.3s ease',
                                        touchAction: draggable ? 'none' : undefined,
                                    }}
                                >
                                    <div className={`px-4 py-2.5 border-b flex items-center justify-between
                                        ${isHub ? 'bg-[var(--ground-2)] border-[var(--rule)]' : isProject ? 'bg-[var(--ground-2)] border-[var(--rule)]' : 'bg-[var(--ground-2)] border-[var(--rule)]'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isProject ? (
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-strong)" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                            ) : (
                                                <div className={`w-2 h-2 rounded-full ${highlighted ? 'bg-[var(--ink-strong)]' : 'bg-[var(--ink-faint)]'}`} />
                                            )}
                                            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--ink-faint)]">{node.type}</span>
                                        </div>
                                        {node.date && <span className="text-[var(--ink-faint)] text-[10px] font-mono">{node.date}</span>}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="text-base font-mono font-medium leading-tight mb-2 text-[var(--ink-strong)]">{node.label}</h4>
                                        {node.description && <p className="text-[var(--ink-soft)] text-xs leading-relaxed line-clamp-3">{node.description}</p>}
                                    </div>
                                </div>
                            );

                            if (isProject && node.link) {
                                return <Link key={node.id} href={`/work/${node.link}`} className="contents">{nodeEl}</Link>;
                            }
                            return nodeEl;
                        })}
                    </div>

                    {/* Controls pill — not in blueprint mode */}
                    {!blueprintMode && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--ground)] border border-[var(--rule)] px-5 py-2 rounded-[2px] flex gap-4 items-center text-[9px] font-mono text-[var(--ink-faint)] pointer-events-none z-50">
                            <span>Scroll → Zoom</span>
                            <span className="w-px h-3 bg-[var(--rule-strong)]" />
                            <span>Double-click → Snap</span>
                            <span className="w-px h-3 bg-[var(--rule-strong)]" />
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
            <div className="pb-4 mb-1 border-b border-[var(--rule)]">
                <h2 className="text-lg text-[var(--ink-strong)] font-mono">Mind Map</h2>
                <p className="text-[var(--ink-faint)] text-[9px] uppercase tracking-[0.25em] mt-1 font-mono">Tap phases to explore</p>
            </div>

            {projectNodes.length > 0 && (
                <div className="flex gap-2.5 overflow-x-auto pb-3 hide-scrollbar">
                    {projectNodes.map(p => (
                        <Link href={`/work/${p.link}`} key={p.id}>
                            <div className="min-w-[160px] bg-[var(--ground-2)] border border-[var(--rule-strong)] rounded-[2px] p-3.5 flex-shrink-0 active:scale-95 transition-transform">
                                <span className="text-[8px] text-[var(--ink-faint)] font-mono tracking-[0.2em] uppercase">Linked</span>
                                <h4 className="text-[var(--ink-strong)] text-sm font-mono mt-0.5">{p.label}</h4>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {hubs.map(hub => {
                const hubChildren = (children[hub.id] || []).map(cid => mindMap.nodes.find(n => n.id === cid)).filter(Boolean) as MindMapNode[];
                const isExp = mobileExpanded.has(hub.id);
                return (
                    <div key={hub.id} className="border border-[var(--rule)] bg-[var(--ground)] rounded-[2px]">
                        <button onClick={() => toggleExpand(hub.id)} className="w-full flex items-center justify-between p-4 active:bg-[var(--ground-2)] transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[var(--ink-strong)] rounded-full" />
                                <span className="text-[var(--ink-strong)] text-sm font-mono text-left">{hub.label}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {hubChildren.length > 0 && <span className="text-[var(--ink-faint)] text-[10px] font-mono">{hubChildren.length}</span>}
                                <motion.div animate={{ rotate: isExp ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-faint)" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
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
                                    <div className="border-t border-[var(--rule)] p-3 flex flex-col gap-2">
                                        {hubChildren.map(child => (
                                            <div key={child.id} className="p-3 border-l-2 border-[var(--rule-strong)] bg-[var(--ground-2)] rounded-[2px]">
                                                <span className="text-[8px] font-mono tracking-[0.15em] uppercase text-[var(--ink-faint)]">{child.type}</span>
                                                <h5 className="text-xs font-mono font-medium mt-0.5 text-[var(--ink-strong)]">{child.label}</h5>
                                                {child.description && <p className="text-[var(--ink-soft)] text-[10px] mt-1 leading-relaxed">{child.description}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
            <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
        </div>
    );
}
