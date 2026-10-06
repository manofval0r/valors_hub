'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type World = 'ink' | 'paper' | 'abyss';

// Floating vertical world toggle. Right rail, below the top nav.
export default function WorldToggle() {
  const [world, setWorld] = useState<World>('ink');

  useEffect(() => {
    const stored = localStorage.getItem('world') as World | null;
    const initial: World =
      stored === 'paper' || stored === 'abyss' || stored === 'ink'
        ? stored
        : document.documentElement.dataset.world === 'paper' ? 'paper' : 'ink';
    setWorld(initial);
    document.documentElement.dataset.world = initial;
  }, []);

  const toggle = (next: World) => {
    setWorld(next);
    document.documentElement.dataset.world = next;
    localStorage.setItem('world', next);
  };

  const items: { id: World; short: string; title: string; dot: string }[] = [
    { id: 'ink', short: 'Ink', title: 'Ink world (dark)', dot: '#0B0B0C' },
    { id: 'abyss', short: 'Aby', title: 'Abyss world (deep blue glass)', dot: '#12263F' },
    { id: 'paper', short: 'Pap', title: 'Paper world (light)', dot: '#FFFFFF' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="fixed right-4 lg:right-8 top-28 z-[65] hidden sm:flex flex-col items-center overflow-hidden rounded-full border"
      style={{
        borderColor: 'var(--rule-strong)',
        background: 'color-mix(in srgb, var(--ground) 82%, transparent)',
        backdropFilter: 'blur(12px)',
      }}
      role="group"
      aria-label="Toggle world theme"
    >
      {items.map((w) => {
        const active = world === w.id;
        return (
          <button
            key={w.id}
            onClick={() => toggle(w.id)}
            aria-pressed={active}
            title={w.title}
            className="w-9 h-11 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
            style={{ background: active ? 'var(--ink-strong)' : 'transparent' }}
          >
            <span
              className="block w-3.5 h-3.5 rounded-full border"
              style={{
                borderColor: active ? 'var(--accent-ink)' : 'var(--rule-fn)',
                background: active ? 'var(--accent-ink)' : w.dot,
              }}
            />
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 8, letterSpacing: '0.14em',
                color: active ? 'var(--accent-ink)' : 'var(--ink-faint)',
                fontWeight: active ? 700 : 400,
              }}
            >
              {w.short}
            </span>
          </button>
        );
      })}
    </motion.div>
  );
}
