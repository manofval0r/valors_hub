'use client';

import { motion } from 'framer-motion';

interface AvailabilityBadgeProps {
    /** 'pill' = compact floating pill (for nav/reel). Default is 'pill'. */
    variant?: 'pill';
    className?: string;
}

export default function AvailabilityBadge({ className = '' }: AvailabilityBadgeProps) {
    return (
        <motion.a
            href="#contact"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#52b788]/30 bg-[#0a1a14]/80 backdrop-blur-md hover:border-[#52b788]/60 hover:bg-[#0a1a14] transition-all duration-300 cursor-pointer group ${className}`}
            title="Open to remote and hybrid opportunities"
            aria-label="Open to Work — click to contact"
        >
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52b788]" />
            </span>
            <span className="text-[#52b788] text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap group-hover:text-[#6ee7b7] transition-colors">
                Open to Work
            </span>
        </motion.a>
    );
}
