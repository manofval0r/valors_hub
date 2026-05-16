'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border border-[#778da9]/20 rounded-xl overflow-hidden bg-[#0d1b2a]/50 backdrop-blur-sm transition-colors hover:border-[#778da9]/40">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 outline-none focus-visible:bg-[#778da9]/10 group"
            >
                <h2 className="text-xl md:text-2xl text-[#e0e1dd] font-normal tracking-wide group-hover:text-white transition-colors">{title}</h2>
                <div className="relative w-6 h-6 flex items-center justify-center rounded-full bg-[#112131] border border-[#778da9]/30 group-hover:border-[#e0e1dd]/50 transition-colors">
                    <motion.div 
                        animate={{ rotate: isOpen ? 180 : 0 }} 
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e0e1dd]">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </motion.div>
                </div>
            </button>
            
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto", marginBottom: 24 },
                            collapsed: { opacity: 0, height: 0, marginBottom: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <div className="px-6 md:px-8 pb-2 text-[#e0e1dd]/70 leading-relaxed font-light">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
