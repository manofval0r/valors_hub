'use client';

import { motion } from 'framer-motion';

// Kept emotional anchor — now inherits plate ink via currentColor so it
// survives both ink and paper worlds. No glow, no hard-coded hex.
// Static when the OS asks for reduced motion.
import { useEffect, useState } from 'react';

export default function BreathingSmile() {
  // Start true so SSR and first client pass render the identical static frame.
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // SSR and first client pass render the static frame identically.
  const staticRender = typeof window === 'undefined' || reduced;
  const anim = (values: string[] | number[]) => (staticRender ? values[0] : values);
  return (
    <div className="relative w-[220px] h-[220px] md:w-[256px] md:h-[256px] flex items-center justify-center" style={{ color: 'var(--ink-strong)' }}>
      <motion.div
        className="relative w-full h-full"
        animate={{ scale: anim([1, 1, 1, 1, 1.02, 1, 1]) }}
        transition={{ duration: 9.5, repeat: Infinity, times: [0, 0.2, 0.4, 0.5, 0.7, 0.9, 1], ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 flex"
          animate={{ gap: anim(['36px', '36px', '30px', '30px', '30px', '30px', '36px']) }}
          transition={{ duration: 8, repeat: Infinity, times: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], ease: 'easeInOut' }}
        >
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              className="w-[13px] h-[13px]"
              style={{ background: 'currentColor' }}
              animate={{ scaleY: anim([1, 0, 1, 1, 0, 1, 1]) }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.2, times: [0, 0.05, 0.1, 0.5, 0.55, 0.6, 1], ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
        <svg viewBox="0 0 100 100" className="absolute top-[45%] left-0 w-full h-[100px]">
          <motion.path
            d="M 25 50 Q 50 30 75 50"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            animate={{
              d: anim([
                'M 25 50 Q 50 30 75 50',
                'M 25 50 Q 50 30 75 50',
                'M 25 50 Q 50 50 75 50',
                'M 25 50 Q 50 65 75 50',
                'M 25 50 Q 50 65 75 50',
                'M 25 50 Q 50 50 75 50',
                'M 25 50 Q 50 30 75 50',
              ]),
            }}
            transition={{ duration: 8, repeat: Infinity, times: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], ease: 'easeInOut' }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
