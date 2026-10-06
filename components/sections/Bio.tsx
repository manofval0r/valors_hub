'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import { bioContent, personalInfo } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Bio() {
    return (
        <Section id="my-story" background="default">
            <motion.div
                className="grid md:grid-cols-[32%_68%] gap-10 md:gap-16 items-start"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
            >
                {/* Left Column: Architectural Profile Card */}
                <motion.div
                    className="flex flex-col gap-4 border border-[var(--rule)]/20 bg-[var(--ground)]/40 p-6 rounded-sm"
                    variants={fadeInUp}
                >
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--rule)]/15">
                        <span className="text-[10px] font-mono text-[var(--ink-strong)] uppercase tracking-widest">
                            PROFILE // 01
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[var(--ink-strong)]" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-base text-[var(--ink-strong)] font-normal">{personalInfo.name}</span>
                        <span className="text-xs text-[var(--ink-faint)] font-mono leading-snug">{personalInfo.title}</span>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-[var(--rule)]/10 text-xs font-mono">
                        <div className="flex justify-between text-[var(--ink-faint)]">
                            <span>Status:</span>
                            <span className="text-[var(--ink-strong)]">Active / Available</span>
                        </div>
                        <div className="flex justify-between text-[var(--ink-faint)]">
                            <span>Focus:</span>
                            <span className="text-[var(--ink-strong)]">Security & Full-Stack</span>
                        </div>
                        <div className="flex justify-between text-[var(--ink-faint)]">
                            <span>Education:</span>
                            <span className="text-[var(--ink-strong)]">NUTM Scholar</span>
                        </div>
                    </div>

                    <a
                        href="/resumes/SWE_David_Idowu.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full py-2 bg-[var(--ground-2)] hover:bg-[var(--ground-2)] border border-[var(--rule-strong)] text-[var(--ink-strong)] text-center text-[10px] font-mono uppercase tracking-widest transition-colors rounded-sm flex items-center justify-center gap-1.5"
                    >
                        <span>View Primary SWE Resume</span>
                        <span>↗</span>
                    </a>
                </motion.div>

                {/* Right Column: Bio Narrative */}
                <motion.div
                    className="flex flex-col gap-6"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--ink-strong)]">
                            About Me
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light text-[var(--ink-strong)] tracking-tight">
                            Security-Conscious Full-Stack Engineering
                        </h2>
                    </motion.div>

                    <div className="flex flex-col gap-4 text-[var(--ink-strong)]/80 leading-relaxed text-sm md:text-base font-light">
                        {bioContent.paragraphs.map((para, index) => (
                            <motion.p key={index} variants={fadeInUp}>
                                {para}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    );
}
