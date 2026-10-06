'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { baselineDraw } from '@/lib/animations';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: 'default' | 'alternate';
  noPadding?: boolean;
  index?: string;
  label?: string;
}

export default function Section({
  children, id, className = '', background = 'default', noPadding = false, index, label,
}: SectionProps) {
  const paddingClass = noPadding ? '' : 'py-20 lg:py-28 px-6 md:px-12 lg:px-24';
  const bg = background === 'alternate' ? 'var(--ground-2)' : 'var(--ground)';

  return (
    <section
      id={id}
      className={`scroll-mt-24 relative ${paddingClass} ${className}`}
      style={{ background: bg, borderTop: '1px solid var(--rule)' }}
    >
      <div className="max-w-7xl mx-auto">
        {(index || label) && (
          <div className="mb-10">
            <motion.div
              variants={baselineDraw}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="baseline-draw flex items-center gap-4 pb-3"
              style={{ borderBottom: '1px solid var(--rule-strong)' }}
            >
              <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>
                {index} {label ? `/ ${label}` : ''}
              </span>
              <span className="ml-auto font-mono" style={{ fontSize: 11, color: 'var(--ink-faint)' }} aria-hidden="true">+</span>
            </motion.div>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
