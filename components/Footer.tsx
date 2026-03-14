'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, contactInfo } from '@/data/personal';
import ResumeSheet from '@/components/ui/ResumeSheet';

export default function Footer() {
    const [year, setYear] = useState<number>(2024);
    const [resumeOpen, setResumeOpen] = useState(false);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <>
            <footer className="py-12 px-6 border-t border-[var(--lavender)]/10 bg-[var(--ink-black)]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">

                    <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                        <p className="text-[#778da9] text-sm">
                            Built with <span className="text-[#e0e1dd]">Next.js</span>,
                            <span className="text-[#e0e1dd]"> React</span> &amp;
                            <span className="text-[#e0e1dd]"> Framer Motion</span>
                        </p>
                        <p className="text-[#778da9]/60 text-[10px] uppercase font-mono tracking-widest">
                            Designed &amp; Developed by {personalInfo.name}
                        </p>
                    </div>

                    <div className="flex items-center gap-8">
                        <a
                            href={contactInfo.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#778da9] hover:text-[#e0e1dd] text-[10px] uppercase font-mono tracking-widest transition-colors link-underline"
                        >
                            GitHub
                        </a>
                        <a
                            href={contactInfo.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#778da9] hover:text-[#e0e1dd] text-[10px] uppercase font-mono tracking-widest transition-colors link-underline"
                        >
                            LinkedIn
                        </a>
                        <span className="text-[#778da9]/20">|</span>
                        <span className="text-[#778da9]/60 text-[10px] font-mono">© {year}</span>
                    </div>

                    <motion.button
                        type="button"
                        onClick={() => setResumeOpen(true)}
                        className="px-6 py-2 border border-[#778da9]/30 text-[#778da9] text-[10px] uppercase font-mono tracking-widest hover:border-[#778da9] hover:text-[#e0e1dd] transition-all rounded-sm flex items-center gap-2"
                        whileHover={{ y: -2 }}
                    >
                        Resume
                        <span className="text-[10px]">↓</span>
                    </motion.button>
                </div>
            </footer>

            <ResumeSheet isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
        </>
    );
}
