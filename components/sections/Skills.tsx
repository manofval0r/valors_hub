'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Section from '../ui/Section';
import { skills, skillCategories } from '@/data/skills';
import { fadeInUp } from '@/lib/animations';

export default function Skills() {
    const [filter, setFilter] = useState('all');
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    // Filter skills based on category
    const filteredSkills = useMemo(() =>
        skills.filter(s => filter === 'all' || s.category === filter),
        [filter]);

    // Constants for diagram layout
    const DIAGRAM_SIZE = 800; // Increased for more "breathing" space
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

        // Define layers/rings
        const coreNodes = filteredSkills.filter(s => s.core);
        const nonCoreNodes = filteredSkills.filter(s => !s.core);

        // Core Layer (Ring 0) - Distributed in a small center radius
        coreNodes.forEach((skill, i) => {
            const rng = seedRandom(skill.id);
            const angle = (i / coreNodes.length) * 2 * Math.PI;
            const radius = coreNodes.length > 1 ? 60 + rng() * 40 : 0;
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
            const radius = 220 + rng() * 60; // Spread out more
            positions[skill.id] = {
                x: CENTER + radius * Math.cos(angle),
                y: CENTER + radius * Math.sin(angle),
                layer: 1
            };
        });

        return positions;
    }, [filteredSkills, CENTER]);

    // Helper to get text lines for better wrapping
    const getWrappedText = (name: string) => {
        if (name.length <= 8) return [name];
        // Split by common delimiters or spaces
        const parts = name.split(/(?=[&])|\s/);
        if (parts.length > 1) return parts;
        // If single long word, split in middle if very long
        if (name.length > 10) return [name.slice(0, name.length / 2), name.slice(name.length / 2)];
        return [name];
    };

    return (
        <Section id="skills" background="default">
            <div className="flex flex-col gap-12 items-start w-full">
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
                    <p className="text-[#778da9] text-sm uppercase tracking-[0.3em] font-mono">
                        A dynamic mapping of my technical ecosystem
                    </p>
                </motion.div>

                {/* Filter System */}
                <div className="flex flex-wrap justify-start gap-3 w-full">
                    {skillCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-2 border transition-all duration-300 rounded-full text-[10px] uppercase font-mono tracking-widest ${filter === cat.id
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
                    <div className="relative w-[800px] h-[800px] scale-[0.5] md:scale-[0.8] lg:scale-100 transition-transform duration-700">
                        <svg
                            viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
                            className="absolute inset-0 w-full h-full"
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

                                        // Calculate quadratic bezier control point (slightly offset towards center)
                                        const cpX = (startPos.x + endPos.x) / 2 + (CENTER - (startPos.x + endPos.x) / 2) * 0.1;
                                        const cpY = (startPos.y + endPos.y) / 2 + (CENTER - (startPos.y + endPos.y) / 2) * 0.1;

                                        return (
                                            <motion.path
                                                key={`${skill.id}-${connId}`}
                                                d={`M ${startPos.x} ${startPos.y} Q ${cpX} ${cpY} ${endPos.x} ${endPos.y}`}
                                                stroke={isHighlighted ? "#e0e1dd" : "#778da9"}
                                                strokeWidth={isHighlighted ? "1.5" : "0.5"}
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
                        {filteredSkills.map((skill) => {
                            const pos = nodePositions[skill.id];
                            if (!pos) return null;

                            const isCore = skill.core;
                            const size = isCore ? 80 : 60;
                            const isHovered = hoveredSkill === skill.id;
                            const isConnected = hoveredSkill && (skill.connections.includes(hoveredSkill) || skills.find(s => s.id === hoveredSkill)?.connections.includes(skill.id));
                            const isActive = !hoveredSkill || isHovered || isConnected;

                            const textLines = getWrappedText(skill.name);

                            return (
                                <motion.div
                                    key={skill.id}
                                    className="absolute cursor-pointer group"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        width: size,
                                        height: size,
                                        x: "-50%",
                                        y: "-50%"
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0.2,
                                        scale: isHovered ? 1.1 : 1,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    onMouseEnter={() => setHoveredSkill(skill.id)}
                                    onMouseLeave={() => setHoveredSkill(null)}
                                >
                                    {/* Neon Glow Layer */}
                                    {isHovered && (
                                        <motion.div
                                            className="absolute inset-0 bg-[#e0e1dd]/20 blur-xl rounded-full"
                                            layoutId="skill-glow"
                                        />
                                    )}

                                    {/* Hexagon Shape */}
                                    <div className={`w-full h-full flex items-center justify-center relative transition-colors duration-300 ${isActive ? 'text-[#e0e1dd]' : 'text-[#778da9]/40'}`}>
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-sm">
                                            <motion.polygon
                                                points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                                                fill={isHovered ? "rgba(119, 141, 169, 0.1)" : "transparent"}
                                                stroke="currentColor"
                                                strokeWidth={isCore ? "2.5" : "1.5"}
                                                animate={isCore ? {
                                                    strokeWidth: [2.5, 3.5, 2.5],
                                                    opacity: [1, 0.7, 1]
                                                } : {}}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            />
                                        </svg>

                                        {/* Scaled Multi-line Text */}
                                        <div className="flex flex-col items-center justify-center z-10 px-2 text-center pointer-events-none">
                                            {textLines.map((line, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`${isCore ? 'text-[10px]' : 'text-[8px]'} uppercase font-mono tracking-tighter leading-tight ${isHovered ? 'text-[#e0e1dd]' : 'text-inherit'}`}
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

                {/* Legend/Context */}
                <div className="flex gap-8 text-[10px] uppercase font-mono tracking-widest text-[#778da9]/60">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 border border-[#778da9] rotate-45" />
                        <span>Core Focus</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-[1px] bg-[#778da9]/30" />
                        <span>Technical Synergy</span>
                    </div>
                </div>
            </div>
        </Section>
    );
}
