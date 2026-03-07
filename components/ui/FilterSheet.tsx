'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSheetProps {
    allTech: string[];
    techFilters: string[];
    onToggleTech: (tech: string) => void;
    onClearAll: () => void;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function FilterSheet({
    allTech,
    techFilters,
    onToggleTech,
    onClearAll,
}: FilterSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);

    // Pulse animation on load (once)
    useEffect(() => {
        const timer = setTimeout(() => setHasAnimated(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Lock body scroll when sheet is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleClose = useCallback(() => setIsOpen(false), []);

    const activeCount = techFilters.length;

    return (
        <>
            {/* Floating Filter Button */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={`Open filters. ${activeCount} active`}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#778da9] text-[#0d1b2a] flex items-center justify-center shadow-[0_4px_12px_rgba(119,141,169,0.3)] hover:shadow-[0_6px_20px_rgba(119,141,169,0.4)] transition-shadow"
                initial={false}
                animate={!hasAnimated ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={!hasAnimated ? { duration: 0.6, delay: 1, ease: 'easeInOut' } : {}}
            >
                {/* Filter icon */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5h14M5 10h10M7 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                {/* Badge */}
                {activeCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#e0e1dd] text-[#0d1b2a] text-xs flex items-center justify-center leading-none">
                        {activeCount}
                    </span>
                )}
            </motion.button>

            {/* Backdrop + Bottom Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-50 bg-[#0d1b2a]/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleClose}
                        />

                        {/* Sheet */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-[51] bg-[#0d1b2a]/95 backdrop-blur-xl border-t border-[#778da9]/20 rounded-t-lg max-h-[70vh] overflow-y-auto"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Filter projects"
                        >
                            <div className="px-6 py-8 flex flex-col gap-8">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg text-[#e0e1dd]">Filters</h3>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        aria-label="Close filters"
                                        className="text-[#778da9] hover:text-[#e0e1dd] transition-colors p-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Technology Filters */}
                                <div className="flex flex-col gap-4">
                                    <span className="text-xs text-[#778da9] uppercase tracking-widest font-mono">Technology</span>
                                    <div className="flex flex-wrap gap-2">
                                        {allTech.map((tech) => {
                                            const isActive = techFilters.includes(tech.toLowerCase());
                                            return (
                                                <button
                                                    key={tech}
                                                    type="button"
                                                    onClick={() => onToggleTech(tech.toLowerCase())}
                                                    className={`px-4 py-2.5 border rounded-[2px] text-xs uppercase font-mono tracking-widest transition-all duration-200 whitespace-nowrap ${isActive
                                                            ? 'bg-[#778da9] border-[#778da9] text-[#0d1b2a]'
                                                            : 'border-[#778da9]/20 text-[#778da9]/70 hover:border-[#778da9]/50'
                                                        }`}
                                                >
                                                    {tech}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-[#778da9]/10">
                                    <button
                                        type="button"
                                        onClick={() => { onClearAll(); }}
                                        disabled={activeCount === 0}
                                        className="flex-1 px-4 py-3 border border-[#778da9]/30 text-[#778da9] text-xs uppercase tracking-widest font-mono rounded-[2px] hover:border-[#e0e1dd] hover:text-[#e0e1dd] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#778da9]/30 disabled:hover:text-[#778da9]"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-3 bg-[#e0e1dd] text-[#0d1b2a] text-xs uppercase tracking-widest font-mono rounded-[2px] hover:bg-[#e0e1dd]/90 transition-all"
                                    >
                                        Apply{activeCount > 0 ? ` (${activeCount})` : ''}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
