'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import { experience, education, certifications, achievements } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Experience() {
    return (
        <Section id="experience" background="alternate">
            <div className="flex flex-col gap-16">
                {/* ── Section Header ── */}
                <motion.div
                    className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#778da9]/15"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#52b788]" />
                            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#52b788]">
                                Track Record & Education
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light text-[#e0e1dd] tracking-tight">
                            Experience & Verified Impact
                        </h2>
                    </div>
                    <span className="text-xs font-mono text-[#778da9] uppercase tracking-widest">
                        5 Shipped Roles · 8 Codebases
                    </span>
                </motion.div>

                {/* ── Top Level: Experience Timeline vs. Achievements & Education ── */}
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    {/* ── Left Column: Experience Timeline (7 Cols) ── */}
                    <motion.div
                        className="lg:col-span-7 flex flex-col gap-10"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-normal text-[#e0e1dd] font-mono uppercase tracking-wider flex items-center gap-2">
                                <span>// Work Experience</span>
                            </h3>
                        </div>

                        <div className="flex flex-col gap-10 relative border-l border-[#778da9]/20 pl-6 md:pl-8 ml-2">
                            {experience.map((exp) => (
                                <motion.div
                                    key={exp.id}
                                    className="relative group"
                                    variants={fadeInUp}
                                >
                                    {/* Timeline Node */}
                                    <div className="absolute -left-[31px] md:-left-[39px] top-2 w-[8px] h-[8px] bg-[#0d1b2a] border border-[#52b788] rotate-45 group-hover:bg-[#52b788] transition-colors" />

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <span className="text-[#52b788] text-[11px] font-mono tracking-widest uppercase">
                                                {exp.startDate} — {exp.endDate}
                                            </span>
                                            <span className="text-[10px] font-mono text-[#778da9]/60 uppercase tracking-widest">
                                                {exp.location}
                                            </span>
                                        </div>

                                        <h4 className="text-xl md:text-2xl text-[#e0e1dd] font-normal leading-snug">
                                            {exp.role}
                                        </h4>

                                        <span className="text-sm font-mono text-[#778da9]">
                                            {exp.company}
                                        </span>

                                        {/* Impact Highlight Badge */}
                                        {exp.impactHighlight && (
                                            <div className="mt-2 p-2.5 bg-[#52b788]/5 border-l-2 border-[#52b788] text-[11px] font-mono text-[#52b788]/90 leading-relaxed">
                                                <span className="font-semibold uppercase tracking-wider text-[#52b788]">Key Outcome: </span>
                                                {exp.impactHighlight}
                                            </div>
                                        )}

                                        <ul className="mt-3 flex flex-col gap-2.5">
                                            {exp.details.map((detail, i) => (
                                                <li key={i} className="text-[#e0e1dd]/75 text-xs md:text-sm leading-relaxed flex items-start gap-2.5 font-light">
                                                    <span className="text-[#52b788] mt-1.5 font-mono text-[10px]">▹</span>
                                                    <span>{detail}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Right Column: Achievements Ledger + Education + Certifications (5 Cols) ── */}
                    <div className="lg:col-span-5 flex flex-col gap-12">
                        {/* ── Innovative Achievements & Architecture Milestones ── */}
                        <motion.div
                            className="flex flex-col gap-6"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-normal text-[#e0e1dd] font-mono uppercase tracking-wider flex items-center gap-2">
                                <span>// Architectural Milestones</span>
                            </h3>

                            <div className="flex flex-col gap-3">
                                {achievements.map((ach) => (
                                    <motion.div
                                        key={ach.id}
                                        variants={fadeInUp}
                                        className="p-4 border border-[#778da9]/20 bg-[#0d1b2a]/50 hover:border-[#52b788]/40 transition-colors rounded-sm flex flex-col gap-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#52b788]/10 text-[#52b788] border border-[#52b788]/30 rounded-sm uppercase tracking-wider">
                                                {ach.metric}
                                            </span>
                                            <span className="text-[9px] font-mono text-[#778da9]/70 uppercase tracking-widest">
                                                {ach.tag}
                                            </span>
                                        </div>

                                        <h5 className="text-sm font-normal text-[#e0e1dd]">
                                            {ach.title}
                                        </h5>

                                        <span className="text-[11px] font-mono text-[#778da9]">
                                            {ach.subtitle}
                                        </span>

                                        <p className="text-xs text-[#e0e1dd]/70 font-light leading-relaxed mt-1">
                                            {ach.impact}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* ── Education Section ── */}
                        <motion.div
                            className="flex flex-col gap-4 pt-4 border-t border-[#778da9]/15"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-normal text-[#e0e1dd] font-mono uppercase tracking-wider">
                                // Education
                            </h3>

                            {education.map((edu) => (
                                <motion.div
                                    key={edu.id}
                                    variants={fadeInUp}
                                    className="p-5 border border-[#778da9]/20 bg-[#0d1b2a]/40 rounded-sm flex flex-col gap-2"
                                >
                                    <div className="flex justify-between items-center text-[10px] font-mono text-[#52b788]">
                                        <span>{edu.duration}</span>
                                        <span className="text-[#778da9]">{edu.location}</span>
                                    </div>
                                    <h4 className="text-base text-[#e0e1dd] font-normal leading-snug">
                                        {edu.degree}
                                    </h4>
                                    <span className="text-xs font-mono text-[#778da9]">
                                        {edu.institution}
                                    </span>
                                    <p className="text-xs text-[#e0e1dd]/70 font-light leading-relaxed mt-1">
                                        {edu.description}
                                    </p>

                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {edu.focus.map((f) => (
                                            <span key={f} className="text-[9px] font-mono px-2 py-0.5 bg-[#030910]/40 text-[#778da9] border border-[#778da9]/15 rounded-sm">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* ── Credentials & Certifications ── */}
                        <motion.div
                            className="flex flex-col gap-4 pt-4 border-t border-[#778da9]/15"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-normal text-[#e0e1dd] font-mono uppercase tracking-wider">
                                // Credentials & AI Certifications
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {certifications.map((cert) => (
                                    <motion.a
                                        key={cert.id}
                                        href={cert.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variants={fadeInUp}
                                        className="p-3.5 border border-[#778da9]/15 bg-[#0d1b2a]/30 hover:border-[#e0e1dd]/40 hover:bg-[#0d1b2a]/60 transition-all rounded-sm flex flex-col justify-between group"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[9px] font-mono text-[#52b788]">{cert.date}</span>
                                                <span className="text-[10px] text-[#778da9] group-hover:text-[#e0e1dd] transition-colors">↗</span>
                                            </div>
                                            <h5 className="text-xs text-[#e0e1dd] leading-snug group-hover:text-[#52b788] transition-colors">
                                                {cert.name}
                                            </h5>
                                        </div>
                                        <span className="text-[9px] font-mono text-[#778da9]/60 mt-2 uppercase tracking-wider">
                                            {cert.issuer}
                                        </span>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
