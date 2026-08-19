'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import BreathingSmile from '../animations/BreathingSmile';
import { personalInfo } from '@/data/personal';
import ResumeSheet from '../ui/ResumeSheet';
import Link from 'next/link';

export default function Hero() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 350], [1, 0]);
    const [resumeOpen, setResumeOpen] = useState(false);

    return (
        <motion.section
            id="home"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-6 select-none"
            style={{ opacity }}
        >
            {/* Background Animation */}
            <div className="absolute top-1/4 right-[8%] -z-10 pointer-events-none opacity-60 md:opacity-100">
                <BreathingSmile />
            </div>

            <div className="flex flex-col items-center z-10 max-w-4xl text-center">
                {/* 1. Metric Badges Strip (Recruiter Fast-Signal) */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1b2a]/60 border border-[#778da9]/20 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] animate-pulse" />
                        <span className="text-[10px] font-mono text-[#e0e1dd] uppercase tracking-wider">
                            8 Shipped Codebases
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#0d1b2a]/60 border border-[#778da9]/20 rounded-full">
                        <span className="text-[10px] font-mono text-[#778da9] uppercase tracking-wider">
                            330+ Commits
                        </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#52b788]/10 border border-[#52b788]/30 rounded-full">
                        <span className="text-[10px] font-mono text-[#52b788] uppercase tracking-wider">
                            Open to Remote / Hybrid
                        </span>
                    </div>
                </motion.div>

                {/* 2. Name */}
                <motion.h1
                    className="text-4xl sm:text-6xl md:text-[68px] font-normal text-[#e0e1dd] tracking-tight leading-[1.08]"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {personalInfo.name}
                </motion.h1>

                {/* 3. Job Title & Domain */}
                <motion.h2
                    className="text-xs sm:text-sm md:text-base font-mono text-[#52b788] mt-4 tracking-[0.2em] uppercase"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                >
                    {personalInfo.title}
                </motion.h2>

                {/* 4. Subtext / Value Prop */}
                <motion.p
                    className="text-sm sm:text-base md:text-lg text-[#e0e1dd]/80 max-w-2xl mt-6 leading-relaxed font-light"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Building secure, full-stack systems across <span className="text-[#e0e1dd] font-normal">React/Next.js, React Native, Django, and Node.js</span> with security-by-default — Row Level Security, JWT/OAuth auth, rate limiting, and race-condition-safe financial ledgers.
                </motion.p>

                {/* 5. CTAs: Direct 1-Click Resume + Projects + Role Resumes */}
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-3 mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <Link
                        href="/work"
                        className="px-6 py-2.5 bg-[#e0e1dd] text-[#0d1b2a] rounded-sm font-medium hover:bg-white transition-colors text-xs font-mono uppercase tracking-widest"
                    >
                        View Projects (16)
                    </Link>

                    {/* Direct 1-Click Primary Resume Download/View */}
                    <a
                        href="/resumes/SWE_David_Idowu.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-[#52b788]/15 border border-[#52b788]/40 text-[#52b788] hover:bg-[#52b788]/25 hover:border-[#52b788]/70 rounded-sm transition-all text-xs font-mono uppercase tracking-widest flex items-center gap-2"
                    >
                        <span>Download CV (PDF)</span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 3v8M4 8l4 4 4-4M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>

                    {/* Secondary Role Resumes Selector */}
                    <button
                        onClick={() => setResumeOpen(true)}
                        className="px-5 py-2.5 border border-[#778da9]/30 text-[#778da9] hover:text-[#e0e1dd] hover:border-[#778da9]/60 hover:bg-[#778da9]/5 rounded-sm transition-all text-xs font-mono uppercase tracking-widest cursor-pointer"
                    >
                        Role Resumes (7) ▾
                    </button>
                </motion.div>
            </div>

            {/* 6. Scroll Indicator */}
            <motion.div
                className="mt-16 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <span className="text-[#778da9]/60 text-[9px] font-mono uppercase tracking-[0.3em]">Scroll to Explore</span>
                <div className="w-5 h-8 border border-[#778da9]/30 rounded-full flex justify-center p-1">
                    <motion.div
                        className="w-1 h-1.5 bg-[#52b788] rounded-full"
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>

            {/* Resume Overlay */}
            <ResumeSheet isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
        </motion.section>
    );
}
