'use client';

import { motion } from 'framer-motion';

export default function AvailabilityBadge({ className = '' }: { className?: string }) {
  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-200 cursor-pointer group ${className}`}
      style={{ borderColor: 'var(--rule-strong)', background: 'color-mix(in srgb, var(--ground) 80%, transparent)' }}
      title="Open to remote and hybrid opportunities"
      aria-label="Open to Work, click to contact"
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ background: 'var(--ink-strong)', opacity: 0.5 }} />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--ink-strong)' }} />
      </span>
      <span className="text-[10px] font-mono uppercase whitespace-nowrap" style={{ letterSpacing: '0.2em', color: 'var(--ink-strong)' }}>
        Open to Work
      </span>
    </motion.a>
  );
}
