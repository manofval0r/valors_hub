'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BreathingSmile from '../animations/BreathingSmile';
import DotField from '../animations/DotField';
import { personalInfo } from '@/data/personal';
import ResumeSheet from '../ui/ResumeSheet';
import Link from 'next/link';
import { plotterLine, staggerContainer } from '@/lib/animations';

export default function Hero() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [plateHot, setPlateHot] = useState(false);

  return (
    <motion.section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16 px-6 select-none"
      style={{ borderBottom: '1px solid var(--rule)' }}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setPlateHot(true)}
      onMouseLeave={() => setPlateHot(false)}
    >
      <div className="absolute inset-y-0 right-0 w-full md:w-[46%] overflow-hidden" aria-hidden="true">
        <DotField density={24} hoverBoost={plateHot} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--ground) 0%, transparent 28%)' }} />
      </div>

      <div className="absolute top-[22%] right-[6%] md:right-[8%] z-0 pointer-events-none opacity-90">
        <div className="absolute -inset-8 rounded-full" style={{ border: '1px solid var(--rule)' }} aria-hidden="true" />
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono uppercase px-2" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--ink-faint)', background: 'var(--ground)' }}>
          study 001
        </span>
        <BreathingSmile />
      </div>

      <div className="flex flex-col items-start md:items-center z-10 max-w-4xl text-left md:text-center w-full">
        <motion.div className="flex flex-wrap items-center md:justify-center gap-2 mb-6" variants={staggerContainer} initial="hidden" animate="visible">
          {[
            { dot: true, text: '17 Projects' },
            { dot: false, text: '600+ Commits' },
            { dot: true, text: 'Open to Remote / Hybrid' },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 px-3 py-1 rounded-full border" style={{ borderColor: 'var(--rule-strong)', background: 'color-mix(in srgb, var(--ground) 70%, transparent)' }}>
              {b.dot && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--ink-strong)' }} />}
              <span className="text-[10px] font-mono uppercase" style={{ letterSpacing: '0.14em', color: 'var(--ink-soft)' }}>{b.text}</span>
            </div>
          ))}
        </motion.div>

        <h1 className="overflow-hidden text-4xl sm:text-6xl md:text-[68px] leading-[1.05]" style={{ letterSpacing: '-0.03em', color: 'var(--ink-strong)' }}>
          <motion.span className="block" variants={plotterLine} custom={0}>{personalInfo.name}</motion.span>
        </h1>

        <div className="overflow-hidden mt-4">
          <motion.h2
            className="text-xs sm:text-sm md:text-base font-mono uppercase"
            style={{ letterSpacing: '0.2em', color: 'var(--ink-soft)' }}
            variants={plotterLine} custom={1}
          >
            {personalInfo.title}
          </motion.h2>
        </div>

        <motion.p
          className="text-sm sm:text-base md:text-lg max-w-2xl mt-6 leading-relaxed"
          style={{ color: 'var(--ink-body)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.32 }}
        >
          Building secure full-stack systems across <span style={{ color: 'var(--ink-strong)', fontWeight: 560 }}>React/Next.js, React Native, Django, and Node.js</span> with security by default: Row Level Security, JWT and OAuth auth, rate limiting, race-condition-safe financial ledgers.
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center md:justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.42 }}
        >
          <Link
            href="/work"
            className="px-6 py-2.5 rounded-[2px] text-xs font-mono uppercase transition-colors"
            style={{ letterSpacing: '0.14em', background: 'var(--ink-strong)', color: 'var(--accent-ink)', fontWeight: 600 }}
          >
            View Projects (17)
          </Link>
          <a
            href="/resumes/SWE_David_Idowu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-[2px] border text-xs font-mono uppercase flex items-center gap-2 transition-colors"
            style={{ letterSpacing: '0.14em', borderColor: 'var(--rule-fn)', color: 'var(--ink-strong)' }}
          >
            <span>Download CV (PDF)</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 3v8M4 8l4 4 4-4M3 13h10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            onClick={() => setResumeOpen(true)}
            className="weight-hover px-5 py-2.5 rounded-[2px] border text-xs font-mono uppercase cursor-pointer transition-colors"
            style={{ letterSpacing: '0.14em', borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}
          >
            Role Resumes (7)
          </button>
        </motion.div>

        <motion.div
          className="mt-10 w-full max-w-2xl grid grid-cols-3 border-t"
          style={{ borderColor: 'var(--rule-strong)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.42 }}
          aria-label="Fast-signal ledger"
        >
          {[
            ['17', 'projects'],
            ['600+', 'commits'],
            ['07', 'role CVs'],
          ].map(([n, l]) => (
            <div key={l} className="py-3 pr-4 border-r last:border-r-0 pl-4 first:pl-0" style={{ borderColor: 'var(--rule)' }}>
              <div className="font-mono text-lg" style={{ color: 'var(--ink-strong)', fontWeight: 600 }}>{n}</div>
              <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-faint)' }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div className="mt-14 flex flex-col items-center gap-2 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6 }}>
        <span className="font-mono uppercase" style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--ink-faint)' }}>Scroll to Explore</span>
        <div className="w-5 h-8 rounded-full flex justify-center p-1 border" style={{ borderColor: 'var(--rule-strong)' }}>
          <motion.div className="w-1 h-1.5 rounded-full" style={{ background: 'var(--ink-strong)' }} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
      </motion.div>

      <ResumeSheet isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </motion.section>
  );
}
