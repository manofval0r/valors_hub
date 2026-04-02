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
                        className="fixed inset-0 z-50 bg-[#0d1b2a]/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[51] bg-[#0d1b2a]/95 backdrop-blur-xl border-t border-[#778da9]/20 rounded-t-lg max-h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.3)]"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Select a resume"
                    >
                        <div className="w-full max-w-lg mx-auto flex flex-col h-full overflow-hidden px-6 pt-8">
                            {/* Header (Sticky) */}
                            <div className="flex items-center justify-between shrink-0 mb-6 pb-2 border-b border-[#778da9]/10">
                                <div>
                                    <h3 className="text-lg text-[#e0e1dd]">Resume</h3>
                                    <p className="text-xs text-[#778da9] font-mono uppercase tracking-widest mt-1">
                                        Select the version that fits
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="text-[#778da9] hover:text-[#e0e1dd] transition-colors p-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Scrollable List */}
                            <div className="flex flex-col gap-3 overflow-y-auto pb-8 pr-2 custom-scrollbar">
                                {resumes.map((resume, i) => (
                                    <motion.a
                                        key={resume.id}
                                        href={resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        // download attribute removed to allow browser PDF viewing
                                        className="group flex items-center justify-between px-5 py-4 border border-[#778da9]/20 rounded-[2px] hover:border-[#e0e1dd]/50 hover:bg-[#e0e1dd]/[0.03] transition-all"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05, duration: 0.25, ease: EASE_OUT }}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-[#e0e1dd]">{resume.role}</span>
                                            <span className="text-xs text-[#778da9] font-mono">{resume.description}</span>
                                        </div>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            className="text-[#778da9] group-hover:text-[#e0e1dd] transition-colors flex-shrink-0 ml-4"
                                        >
                                            <path d="M8 3v8M4 8l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
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
