'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import { currentActivities } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

function OutlineIcon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const CARDS = [
  {
    n: '01', label: 'Currently Reading', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
    title: currentActivities.reading.title, body: currentActivities.reading.description, status: 'In progress',
  },
  {
    n: '02', label: 'Currently Making', icon: 'M8 9l-4 3 4 3 M16 9l4 3-4 3 M13 5l-2 14',
    title: currentActivities.building.title, body: currentActivities.building.description, status: 'Active build',
  },
];

export default function WhatImUpTo() {
  return (
    <Section id="what-im-up-to" index="005" label="Now" background="default">
      <motion.div
        className="grid md:grid-cols-2 gap-6 mb-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {CARDS.map((c) => (
          <motion.div key={c.n} variants={fadeInUp} className="h-full">
            <Card className="h-full bg-[var(--ground-2)] border-[var(--rule)] p-8 flex flex-col gap-4 min-h-[220px] rounded-[2px]">
              <div className="flex items-center justify-between" style={{ color: 'var(--ink-faint)' }}>
                <div className="flex items-center gap-3">
                  <OutlineIcon d={c.icon} />
                  <h2 className="text-[11px] uppercase tracking-[0.22em] font-mono">{c.label}</h2>
                </div>
                <span className="font-mono" style={{ fontSize: 10 }}>{c.n}</span>
              </div>
              <h3 className="text-2xl text-[var(--ink-strong)] font-normal">{c.title}</h3>
              <p className="text-[var(--ink-body)] text-sm leading-relaxed">{c.body}</p>
              <div className="mt-auto pt-2 flex items-center gap-2 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-faint)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--ink-strong)' }} />
                {c.status}
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Card className="bg-[var(--ground-2)] border-[var(--rule)] p-8 flex flex-col gap-4 min-h-[180px] rounded-[2px]">
          <div className="flex items-center justify-between" style={{ color: 'var(--ink-faint)' }}>
            <div className="flex items-center gap-3">
              <OutlineIcon d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.1 2.1 M16.3 16.3l2.1 2.1 M5.6 18.4l2.1-2.1 M16.3 7.7l2.1-2.1" />
              <h2 className="text-[11px] uppercase tracking-[0.22em] font-mono">What is Next</h2>
            </div>
            <span className="font-mono" style={{ fontSize: 10 }}>03</span>
          </div>
          <h3 className="text-2xl text-[var(--ink-strong)] font-normal">Future Goals</h3>
          <p className="text-[var(--ink-body)] text-sm leading-relaxed max-w-4xl">
            Master advanced AI integration, contribute to open source, and build tools that connect human creativity with machine intelligence.
          </p>
        </Card>
      </motion.div>
    </Section>
  );
}
