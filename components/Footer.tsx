'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, contactInfo } from '@/data/personal';
import ResumeSheet from '@/components/ui/ResumeSheet';

export default function Footer() {
  const [year, setYear] = useState<number>(2024);
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <>
      <footer className="px-6 md:px-12 pt-14 pb-10 border-t" style={{ borderColor: 'var(--rule-strong)', background: 'var(--ground-2)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-2 pb-8" style={{ borderBottom: '1px solid var(--rule)' }}>
            <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.22em', color: 'var(--ink-faint)' }}>
              Colophon
            </span>
            <p className="font-mono" style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--ink-strong)' }}>
              David Idowu
            </p>
            <p className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-faint)' }}>
              Full-stack engineer. Security science. Plate 001.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 py-8 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.16em' }}>
            <div className="flex flex-col gap-2.5">
              <span style={{ color: 'var(--ink-faint)' }}>Stack</span>
              <span style={{ color: 'var(--ink-body)' }}>Next.js · React · Framer Motion</span>
              <span style={{ color: 'var(--ink-body)' }}>Bricolage Grotesque · Martian Mono</span>
            </div>
            <div className="flex flex-col gap-2.5">
              <span style={{ color: 'var(--ink-faint)' }}>Elsewhere</span>
              <a href={contactInfo.socials.github} target="_blank" rel="noopener noreferrer" className="link-underline w-fit" style={{ color: 'var(--ink-body)' }}>GitHub</a>
              <a href={contactInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline w-fit" style={{ color: 'var(--ink-body)' }}>LinkedIn</a>
            </div>
            <div className="flex flex-col gap-2.5 sm:items-end">
              <span style={{ color: 'var(--ink-faint)' }}>Record</span>
              <span style={{ color: 'var(--ink-body)' }}>© {year} {personalInfo.name}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setResumeOpen(true)}
                  className="weight-hover px-5 py-2 border rounded-[2px] uppercase font-mono cursor-pointer transition-colors"
                  style={{ fontSize: 10, letterSpacing: '0.16em', borderColor: 'var(--rule-strong)', color: 'var(--ink-strong)' }}
                >
                  Resume ↓
                </button>
                <a
                  href="#home"
                  className="weight-hover px-5 py-2 border rounded-[2px] uppercase font-mono transition-colors"
                  style={{ fontSize: 10, letterSpacing: '0.16em', borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}
                >
                  Top ↑
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <ResumeSheet isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
}
