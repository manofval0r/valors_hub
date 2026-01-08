'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Section from '../ui/Section';
import { skills, skillCategories, Skill } from '@/data/skills';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Skills() {
    const [filter, setFilter] = useState('all');
    const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

    const filteredSkills = skills.filter(s => filter === 'all' || s.category === filter);

    // Constants for diagram layout
    const DIAGRAM_SIZE = 600;
    const CENTER = DIAGRAM_SIZE / 2;

    // Simple layout logic: core skills in middle, others orbit
    const coreSkills = filteredSkills.filter(s => s.core);
    const orbitalSkills = filteredSkills.filter(s => !s.core);

    const getPos = (index: number, total: number, radius: number) => {
        // Offset angle to prevent overlap with core
        const angle = (index / total) * 2 * Math.PI;
        return {
            x: CENTER + radius * Math.cos(angle),
            y: CENTER + radius * Math.sin(angle)
        };
    };

    return (
        <Section id="skills" background="default">
            <div className="flex flex-col gap-16 items-start w-full">
                <motion.h2
                    className="text-4xl md:text-5xl font-normal text-[#e0e1dd] text-left"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    Skills Constellation
                </motion.h2>

                {/* Filter System: Row of pills, 12px spacing */}
                <div className="flex flex-wrap justify-start gap-[12px] w-full">
                    {skillCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-5 py-2 border transition-all duration-300 rounded-full text-sm tracking-wide ${filter === cat.id
                                ? 'bg-[#e0e1dd] border-[#e0e1dd] text-[#0d1b2a]'
                                : 'bg-transparent border-[#778da9]/30 text-[#778da9] hover:border-[#778da9]'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Constellation Diagram */}
                <div className="relative w-full max-w-[600px] aspect-square">
                    <svg
                        viewBox={`0 0 ${DIAGRAM_SIZE} ${DIAGRAM_SIZE}`}
                        className="w-full h-full"
                    >
                        {/* Connection Lines */}
                        <AnimatePresence>
                            {filteredSkills.map((skill, i) => {
                                const startPos = skill.core ? { x: CENTER, y: CENTER } : getPos(i, filteredSkills.length, 180);

                                return skill.connections.map(connId => {
                                    const targetIndex = filteredSkills.findIndex(s => s.id === connId);
                                    if (targetIndex === -1) return null;

                                    const targetSkill = filteredSkills[targetIndex];
                                    const endPos = targetSkill.core ? { x: CENTER, y: CENTER } : getPos(targetIndex, filteredSkills.length, 180);

                                    return (
                                        <motion.line
                                            key={`${skill.id}-${connId}`}
                                            x1={startPos.x}
                                            y1={startPos.y}
                                            x2={endPos.x}
                                            y2={endPos.y}
                                            stroke="var(--lavender)"
                                            strokeWidth="1"
                                            opacity="0.2"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    );
                                })
                            })}
                        </AnimatePresence>
                    </svg>

                    {/* Hexagon Nodes */}
                    <div className="absolute inset-0 pointer-events-none">
                        {filteredSkills.map((skill, i) => {
                            const isCore = skill.core;
                            const size = isCore ? 60 : 40;
                            const pos = isCore ? { x: CENTER, y: CENTER } : getPos(i, filteredSkills.length, 200);

                            return (
                                <motion.div
                                    key={skill.id}
                                    className="absolute pointer-events-auto cursor-pointer"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        transform: 'translate(-50%, -50%)',
                                        width: size,
                                        height: size
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: hoveredSkill && hoveredSkill !== skill.id && !skill.connections.includes(hoveredSkill) ? 0.3 : 1,
                                        scale: 1
                                    }}
                                    whileHover={{ scale: 1.15 }}
                                    onMouseEnter={() => setHoveredSkill(skill.id)}
                                    onMouseLeave={() => setHoveredSkill(null)}
                                >
                                    {/* Hexagon Shape */}
                                    <div className={`w-full h-full flex items-center justify-center relative ${hoveredSkill === skill.id || (hoveredSkill && skill.connections.includes(hoveredSkill))
                                        ? 'text-[#e0e1dd]'
                                        : 'text-[#778da9]'
                                        }`}>
                                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                                            <polygon
                                                points="50 1, 93 25, 93 75, 50 99, 7 75, 7 25"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={isCore ? "3" : "2"}
                                                className="transition-colors duration-300"
                                            />
                                        </svg>
                                        <span className={`${isCore ? 'text-[11px]' : 'text-[9px]'} text-center font-normal z-10 p-1 leading-none uppercase tracking-tighter`}>
                                            {skill.name.split(' ')[0]}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Section>
    );
}
