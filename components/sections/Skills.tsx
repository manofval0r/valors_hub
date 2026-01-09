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

    // Filter skills based on category
    const filteredSkills = useMemo(() =>
        skills.filter(s => filter === 'all' || s.category === filter),
        [filter]);

    // Handle viewport detection for coordinate adjustments
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Constants for diagram layout
    const DIAGRAM_SIZE = 800;
    const CENTER = DIAGRAM_SIZE / 2;

    // Deterministic random for organic feel
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

    // Calculate node positions with layers and organic drift
    const nodePositions = useMemo(() => {
        const positions: Record<string, { x: number; y: number; layer: number }> = {};

        const coreNodes = filteredSkills.filter(s => s.core);
        const nonCoreNodes = filteredSkills.filter(s => !s.core);

        // Adaptive radii for mobile vs desktop
        const coreRadiusBase = isMobile ? 40 : 60;
        const orbitalRadiusBase = isMobile ? 180 : 250;
        const orbitalSpread = isMobile ? 40 : 80;

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

    // Helper to get text lines for better wrapping
    const getWrappedText = (name: string) => {
        if (name.length <= 8) return [name];
        const parts = name.split(/(?=[&])|\s/);
        if (parts.length > 1) return parts;
        if (name.length > 10) return [name.slice(0, name.length / 2), name.slice(name.length / 2)];
        return [name];
    };

    return (
        <Section id="skills" background="default">
            <div className="flex flex-col gap-10 md:gap-12 items-start w-full">
                <motion.div
                    className="flex flex-col gap-4"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-normal text-[#e0e1dd]">
                        Skills Constellation
                    </h2>
                    <p className="text-[#778da9] text-xs md:text-sm uppercase tracking-[0.3em] font-mono leading-relaxed max-w-lg">
                        A dynamic mapping of my technical ecosystem. <span className="hidden md:inline">Hover</span><span className="md:hidden">Tap</span> a skill to see synergies.
                    </p>
                </motion.div>

                {/* Filter System */}
                <div className="flex flex-wrap justify-start gap-2 md:gap-3 w-full">
                    {skillCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-4 md:px-5 py-2 border transition-all duration-300 rounded-full text-[9px] md:text-[10px] uppercase font-mono tracking-widest ${filter === cat.id
                                ? 'bg-[#e0e1dd] border-[#e0e1dd] text-[#0d1b2a]'
                                : 'bg-transparent border-[#778da9]/20 text-[#778da9] hover:border-[#778da9]/50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Constellation Diagram Wrapper */}
                <div className="relative w-full aspect-square md:aspect-video bg-[#0d1b2a]/20 border border-[#778da9]/5 rounded-sm overflow-hidden flex items-center justify-center">
                    {/* The Inner Container now scales fluidly via SVG viewBox instead of fixed CSS scale */}
                    <div className="relative w-full h-full max-w-[800px] max-h-[800px]">
                        <svg
                            viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
                            className="absolute inset-0 w-full h-full preserve-3d"
                        >
                            {/* Connection Lines (Curved) */}
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
                                                stroke={isHighlighted ? "#e0e1dd" : "#778da9"}
                                                strokeWidth={isHighlighted ? (isMobile ? "2" : "1.5") : "0.5"}
                                                fill="none"
                                                opacity={isHighlighted ? 0.6 : 0.15}
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{ pathLength: 1, opacity: isHighlighted ? 0.6 : 0.15 }}
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
                                const size = isMobile ? (isCore ? 70 : 55) : (isCore ? 85 : 65);
                                const isHovered = hoveredSkill === skill.id;
                                const isConnected = hoveredSkill && (skill.connections.includes(hoveredSkill) || skills.find(s => s.id === hoveredSkill)?.connections.includes(skill.id));
                                const isActive = !hoveredSkill || isHovered || isConnected;

                                const textLines = getWrappedText(skill.name);

                                // Use percentages for top/left instead of fixed DIAGRAM_SIZE units to work better with fluid containers
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
                                        onMouseEnter={() => !isMobile && setHoveredSkill(skill.id)}
                                        onMouseLeave={() => !isMobile && setHoveredSkill(null)}
                                        onClick={() => isMobile && setHoveredSkill(hoveredSkill === skill.id ? null : skill.id)}
                                    >
                                        {/* Neon Glow Layer */}
                                        {isHovered && (
                                            <motion.div
                                                className="absolute inset-0 bg-[#e0e1dd]/20 blur-2xl rounded-full"
                                                layoutId="skill-glow"
                                            />
                                        )}

                                        {/* Hexagon Shape */}
                                        <div className={`w-full h-full flex items-center justify-center relative transition-colors duration-300 ${isActive ? 'text-[#e0e1dd]' : 'text-[#778da9]/40'}`}>
                                            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm overflow-visible">
                                                <motion.polygon
                                                    points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                                                    fill={isHovered ? "rgba(224, 225, 221, 0.05)" : "transparent"}
                                                    stroke="currentColor"
                                                    strokeWidth={isCore ? "2.5" : "1.5"}
                                                    animate={isCore ? {
                                                        strokeWidth: [2.5, 3.5, 2.5],
                                                        opacity: [1, 0.8, 1]
                                                    } : {}}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                />
                                            </svg>

                                            <div className="flex flex-col items-center justify-center z-10 px-1 text-center select-none">
                                                {textLines.map((line, idx) => (
                                                    <span
                                                        key={idx}
                                                        className={`${isCore ? (isMobile ? 'text-[9px]' : 'text-[10px]') : (isMobile ? 'text-[7.5px]' : 'text-[8.5px]')} uppercase font-mono tracking-tighter leading-[1.1] ${isHovered ? 'text-[#e0e1dd] font-bold' : 'text-inherit'}`}
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

                {/* Legend/Context */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-[#778da9]/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 border border-[#778da9] rotate-45" />
                        <span>Core Focus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-[1px] bg-[#778da9]/50" />
                        <span>Technical Synergy</span>
                    </div>
                </div>
            </div>
        </Section>
    );
}
