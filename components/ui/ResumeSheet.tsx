'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumes } from '@/data/personal';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ResumeSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResumeSheet({ isOpen, onClose }: ResumeSheetProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-50 bg-[#030910]/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[51] bg-[#0d1b2a]/95 backdrop-blur-2xl border-t border-[#778da9]/25 rounded-t-lg max-h-[85vh] flex flex-col shadow-[0_-12px_48px_rgba(0,0,0,0.5)]"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Select a targeted resume"
                    >
                        <div className="w-full max-w-xl mx-auto flex flex-col h-full overflow-hidden px-6 pt-8 pb-4">
                            {/* Header */}
                            <div className="flex items-center justify-between shrink-0 mb-6 pb-3 border-b border-[#778da9]/15">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-[#52b788]" />
                                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#52b788]">
                                            Targeted CV Library
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-normal text-[#e0e1dd]">Select Role Version</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="text-[#778da9] hover:text-[#e0e1dd] transition-colors p-2 text-sm font-mono cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Scrollable List of 7 Verified Resumes */}
                            <div className="flex flex-col gap-2.5 overflow-y-auto pb-8 pr-1 custom-scrollbar">
                                {resumes.map((resume, i) => (
                                    <motion.a
                                        key={resume.id}
                                        href={resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group flex items-center justify-between p-4 border rounded-sm transition-all ${
                                            resume.isPrimary
                                                ? 'bg-[#52b788]/5 border-[#52b788]/40 hover:border-[#52b788] hover:bg-[#52b788]/10'
                                                : 'bg-[#0d1b2a]/40 border-[#778da9]/20 hover:border-[#e0e1dd]/40 hover:bg-[#0d1b2a]/80'
                                        }`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.22, ease: EASE_OUT }}
                                    >
                                        <div className="flex flex-col gap-1 pr-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-[#e0e1dd] group-hover:text-[#52b788] transition-colors font-medium">
                                                    {resume.role}
                                                </span>
                                                {resume.isPrimary && (
                                                    <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.2 bg-[#52b788]/20 text-[#52b788] border border-[#52b788]/40 rounded-sm">
                                                        Recommended
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs text-[#778da9] font-mono leading-relaxed font-light">
                                                {resume.description}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono text-[#778da9] group-hover:text-[#52b788] flex-shrink-0 transition-colors">
                                            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">PDF</span>
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 3v8M4 8l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
