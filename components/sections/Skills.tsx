'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import Section from '../ui/Section';
import { skills, skillCategories } from '@/data/skills';
import { fadeInUp } from '@/lib/animations';

export default function Skills() {
    const [filter, setFilter] = useState('all');
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Filter skills based on category or 'core'
    const filteredSkills = useMemo(() =>
        skills.filter(s => filter === 'all' || (filter === 'core' ? s.core : s.category === filter)),
        [filter]);

    // Group skills by category for mobile view
    const skillsByCategory = useMemo(() => {
        const grouped: Record<string, typeof skills> = {};
        skillCategories.forEach(cat => {
            if (cat.id !== 'all') {
                if (cat.id === 'core') {
                    grouped[cat.id] = skills.filter(s => s.core);
                } else {
                    grouped[cat.id] = skills.filter(s => s.category === cat.id);
                }
            }
        });
        return grouped;
    }, []);

    // Viewport detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Constants for diagram layout
    const DIAGRAM_SIZE = 800;
    const CENTER = DIAGRAM_SIZE / 2;

    const seedRandom = (seed: string) => {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        return () => {
            hash = (hash * 9301 + 49297) % 233280;
            return hash / 233280;
        };
    };

    const nodePositions = useMemo(() => {
        if (isMobile) return {};

        const positions: Record<string, { x: number; y: number; layer: number }> = {};
        const coreNodes = filteredSkills.filter(s => s.core);
        const nonCoreNodes = filteredSkills.filter(s => !s.core);

        const coreRadiusBase = 70;
        const orbitalRadiusBase = 260;
        const orbitalSpread = 70;

        // Core Layer (Ring 0)
        coreNodes.forEach((skill, i) => {
            const rng = seedRandom(skill.id);
            const angle = (i / coreNodes.length) * 2 * Math.PI;
            const radius = coreNodes.length > 1 ? coreRadiusBase + rng() * 30 : 0;
            positions[skill.id] = {
                x: CENTER + radius * Math.cos(angle),
                y: CENTER + radius * Math.sin(angle),
                layer: 0
            };
        });

        // Orbital Layer (Ring 1)
        nonCoreNodes.forEach((skill, i) => {
            const rng = seedRandom(skill.id);
            const angle = (i / nonCoreNodes.length) * 2 * Math.PI + (rng() * 0.5);
            const radius = orbitalRadiusBase + rng() * orbitalSpread;
            positions[skill.id] = {
                x: CENTER + radius * Math.cos(angle),
                y: CENTER + radius * Math.sin(angle),
                layer: 1
            };
        });

        return positions;
    }, [filteredSkills, CENTER, isMobile]);

    const getWrappedText = (name: string) => {
        if (name.length <= 9) return [name];
        const parts = name.split(/(?=[&/(])|\s/);
        if (parts.length > 1) return parts.slice(0, 2);
        return [name.slice(0, 10)];
    };

    const dailyCoreSkills = useMemo(() => skills.filter(s => s.core), []);

    return (
        <Section id="skills" background="default">
            <div className="flex flex-col gap-10 md:gap-12 items-start w-full">
                <motion.div
                    className="flex flex-col gap-3 max-w-2xl"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#52b788]" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#52b788]">
                            Technical Taxonomy
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-light text-[#e0e1dd] tracking-tight">
                        Core Competencies & Stack
                    </h2>
                    <p className="text-[#778da9] text-xs md:text-sm font-mono leading-relaxed">
                        A structured breakdown of my daily production stack, security architecture, cloud infrastructure, and AI engineering workflows.
                    </p>
                </motion.div>

                {/* ── ATS / Recruiter 5-Second Fast Scan Bar ── */}
                <motion.div
                    className="w-full p-4 md:p-5 border border-[#52b788]/30 bg-[#52b788]/5 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#52b788]">
                        <span>★ Daily Production Core</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {dailyCoreSkills.map((s) => (
                            <span
                                key={s.id}
                                className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider bg-[#0d1b2a] text-[#e0e1dd] border border-[#52b788]/40 rounded-sm"
                            >
                                {s.name}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* ——— DESKTOP VIEW: Constellation & Filters ——— */}
                <div className="hidden md:flex flex-col w-full gap-8">
                    {/* Filter System */}
                    <div className="flex flex-wrap justify-start gap-2.5 w-full">
                        {skillCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                aria-label={`Filter skills by ${cat.label}`}
                                className={`px-4 py-1.5 border transition-all duration-300 rounded-sm text-[10px] uppercase font-mono tracking-widest cursor-pointer ${
                                    filter === cat.id
                                        ? 'bg-[#e0e1dd] border-[#e0e1dd] text-[#0d1b2a] font-medium'
                                        : 'bg-transparent border-[#778da9]/20 text-[#778da9] hover:border-[#778da9]/50 hover:text-[#e0e1dd]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Constellation Diagram */}
                    <div className="relative w-full aspect-video bg-[#0d1b2a]/30 border border-[#778da9]/15 rounded-sm overflow-hidden flex items-center justify-center">
                        <div className="relative w-full h-full max-w-[800px] max-h-[800px]">
                            <svg
                                viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
                                className="absolute inset-0 w-full h-full preserve-3d"
                                aria-hidden="true"
                            >
                                <AnimatePresence>
                                    {filteredSkills.map((skill) => {
                                        const startPos = nodePositions[skill.id];
                                        if (!startPos) return null;

                                        return skill.connections.map(connId => {
                                            const endPos = nodePositions[connId];
                                            if (!endPos) return null;

                                            const isHighlighted = hoveredSkill === skill.id || hoveredSkill === connId;
                                            const cpX = (startPos.x + endPos.x) / 2 + (CENTER - (startPos.x + endPos.x) / 2) * 0.1;
                                            const cpY = (startPos.y + endPos.y) / 2 + (CENTER - (startPos.y + endPos.y) / 2) * 0.1;

                                            return (
                                                <motion.path
                                                    key={`${skill.id}-${connId}`}
                                                    d={`M ${startPos.x} ${startPos.y} Q ${cpX} ${cpY} ${endPos.x} ${endPos.y}`}
                                                    stroke={isHighlighted ? "#52b788" : "#778da9"}
                                                    strokeWidth={isHighlighted ? "1.5" : "0.5"}
                                                    fill="none"
                                                    opacity={isHighlighted ? 0.8 : 0.15}
                                                    initial={{ pathLength: 0, opacity: 0 }}
                                                    animate={{ pathLength: 1, opacity: isHighlighted ? 0.8 : 0.15 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.8 }}
                                                />
                                            );
                                        });
                                    })}
                                </AnimatePresence>
                            </svg>

                            {/* Hexagon Nodes */}
                            <div className="absolute inset-0 pointer-events-none">
                                {filteredSkills.map((skill) => {
                                    const pos = nodePositions[skill.id];
                                    if (!pos) return null;

                                    const isCore = skill.core;
                                    const size = isCore ? 85 : 68;
                                    const isHovered = hoveredSkill === skill.id;
                                    const isConnected = hoveredSkill && (skill.connections.includes(hoveredSkill) || skills.find(s => s.id === hoveredSkill)?.connections.includes(skill.id));
                                    const isActive = !hoveredSkill || isHovered || isConnected;

                                    const textLines = getWrappedText(skill.name);
                                    const leftPercent = (pos.x / DIAGRAM_SIZE) * 100;
                                    const topPercent = (pos.y / DIAGRAM_SIZE) * 100;

                                    return (
                                        <motion.div
                                            key={skill.id}
                                            className="absolute cursor-pointer pointer-events-auto"
                                            style={{
                                                left: `${leftPercent}%`,
                                                top: `${topPercent}%`,
                                                width: size,
                                                height: size,
                                                x: "-50%",
                                                y: "-50%"
                                            }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: isActive ? 1 : 0.2,
                                                scale: isHovered ? 1.15 : 1,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            onMouseEnter={() => setHoveredSkill(skill.id)}
                                            onMouseLeave={() => setHoveredSkill(null)}
                                        >
                                            {isHovered && (
                                                <motion.div
                                                    className="absolute inset-0 bg-[#52b788]/20 blur-2xl rounded-full"
                                                    layoutId="skill-glow"
                                                />
                                            )}
                                            <div className={`w-full h-full flex items-center justify-center relative transition-colors duration-300 ${isActive ? (isCore ? 'text-[#52b788]' : 'text-[#e0e1dd]') : 'text-[#778da9]/40'}`}>
                                                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm overflow-visible">
                                                    <motion.polygon
                                                        points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                                                        fill={isHovered ? "rgba(82, 183, 136, 0.1)" : "rgba(13, 27, 42, 0.6)"}
                                                        stroke="currentColor"
                                                        strokeWidth={isCore ? "2" : "1"}
                                                    />
                                                </svg>
                                                <div className="flex flex-col items-center justify-center z-10 px-1 text-center select-none">
                                                    {textLines.map((line, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={`${isCore ? 'text-[9.5px] font-medium' : 'text-[8.5px]'} uppercase font-mono tracking-tighter leading-[1.1] ${isHovered ? 'text-[#e0e1dd] font-bold' : 'text-inherit'}`}
                                                        >
                                                            {line}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ——— MOBILE VIEW: Tech Stream ——— */}
                <div className="block md:hidden w-full relative pl-4 border-l border-dashed border-[#778da9]/20">
                    <div className="flex flex-col gap-10">
                        {skillCategories.filter(cat => cat.id !== 'all').map((category, index) => (
                            <motion.div
                                key={category.id}
                                className="relative"
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0d1b2a] border border-[#52b788] z-10" />

                                <h3 className="text-base text-[#e0e1dd] font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
                                    {category.label}
                                </h3>

                                <div className="flex flex-wrap gap-1.5">
                                    {skillsByCategory[category.id]?.map((skill) => (
                                        <div
                                            key={skill.id}
                                            className={`px-2.5 py-1 rounded-sm text-xs font-mono border ${
                                                skill.core
                                                    ? 'bg-[#52b788]/10 border-[#52b788]/40 text-[#52b788]'
                                                    : 'bg-[#0d1b2a]/40 border-[#778da9]/20 text-[#778da9]'
                                            }`}
                                        >
                                            {skill.name}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
