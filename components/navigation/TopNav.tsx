'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActiveSection } from '@/lib/hooks';
import AvailabilityBadge from '@/components/ui/AvailabilityBadge';

const WORK_MENU = [
  { label: 'Projects Section', href: '/#projects', note: 'Featured on this page' },
  { label: 'All Projects', href: '/work', note: '16 case studies' },
  { label: 'Constellation', href: '/constellation', note: 'Relation map' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { activeSection, isScrolled, navItems } = useActiveSection();
  const [workOpen, setWorkOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const isProjectPage = pathname.startsWith('/work/') && pathname.length > 6;
  const isConstellationPage = pathname === '/constellation';
  const isWorkPage = pathname === '/work';
  const projectSlug = isProjectPage ? pathname.split('/')[2] : null;

  return (
    <>
      <motion.nav
        aria-label="Top Navigation"
        className="fixed top-6 right-6 lg:right-12 z-[60] hidden md:flex items-center transition-all duration-300 rounded-full border"
        style={{
          background: isScrolled || isProjectPage || isWorkPage || isConstellationPage
            ? 'color-mix(in srgb, var(--ground) 66%, transparent)' : 'color-mix(in srgb, var(--ground) 40%, transparent)',
          borderColor: 'var(--rule-strong)',
          backdropFilter: 'blur(18px) saturate(1.4)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
        }}
        drag
        dragConstraints={{ left: -40, right: 40, top: 0, bottom: 20 }}
        dragElastic={0.2}
        dragMomentum={false}
        title="Drag to nudge the nav"
      >
        <ul className="flex items-center px-2 py-2">
          {(isProjectPage ? [
            { id: 'home', label: 'Home', href: '/' },
            { id: 'work', label: 'All Projects', href: '/work' },
            { id: 'cur', label: (projectSlug ?? '').replace(/-/g, ' '), href: '#' },
          ] : navItems).map((link) => {
            const isActive = activeSection === link.id && pathname === '/';
            const isWork = link.id === 'projects';
            const showHover = hovered === link.id;
            return (
              <li
                key={link.id}
                className="relative"
                onMouseEnter={() => { setHovered(link.id); if (isWork) setWorkOpen(true); }}
                onMouseLeave={() => { setHovered(null); if (isWork) setWorkOpen(false); }}
              >
                <Link
                  href={pathname === '/' ? link.href : link.href.startsWith('/') ? link.href : `/${link.href}`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-expanded={isWork ? workOpen : undefined}
                  aria-haspopup={isWork ? 'menu' : undefined}
                  onFocus={() => { if (isWork) setWorkOpen(true); }}
                  onBlur={() => { if (isWork) setWorkOpen(false); }}
                  className="weight-hover relative z-10 px-5 py-2 flex items-center gap-1.5 text-xs uppercase font-mono"
                  style={{ letterSpacing: '0.14em', color: isActive ? 'var(--ink-strong)' : 'var(--ink-faint)', fontWeight: isActive ? 700 : 400 }}
                >
                  {link.label}
                  {isWork && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" className="transition-transform" style={{ transform: workOpen ? 'rotate(180deg)' : 'none' }}>
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  )}
                  {(isActive || showHover) && (
                    <motion.div
                      layoutId={isActive ? 'active-nav-rule' : undefined}
                      className="absolute left-5 right-5 -bottom-0.5 h-px"
                      style={{ background: 'var(--ink-strong)', opacity: isActive ? 1 : 0.45 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    />
                  )}
                </Link>
                {isWork && (
                  <AnimatePresence>
                    {workOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        role="menu"
                        aria-label="Work destinations"
                        className="absolute top-full mt-2 left-0 min-w-[240px] rounded-[4px] border p-1.5 backdrop-blur-xl"
                        style={{ borderColor: 'var(--rule-strong)', background: 'color-mix(in srgb, var(--ground) 88%, transparent)', boxShadow: '0 16px 48px rgba(0,0,0,0.35)' }}
                      >
                        {WORK_MENU.map((w) => (
                          <Link
                            key={w.href + w.label}
                            href={w.href}
                            role="menuitem"
                            className="flex items-center justify-between gap-4 px-3.5 py-2.5 rounded-[2px] text-[11px] font-mono uppercase transition-colors hover:bg-[var(--ground-3)]"
                            style={{ letterSpacing: '0.12em', color: 'var(--ink-body)' }}
                            onClick={() => setWorkOpen(false)}
                          >
                            <span>{w.label}</span>
                            <span style={{ fontSize: 9, color: 'var(--ink-faint)' }}>{w.note}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </li>
            );
          })}
        </ul>
      </motion.nav>

      {pathname === '/' && (
        <div className="fixed top-6 left-6 lg:left-12 z-[60] hidden md:flex items-center gap-3">
          <AvailabilityBadge />
          <a
            href="/resumes/SWE_David_Idowu.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="weight-hover flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-mono uppercase transition-colors"
            style={{ letterSpacing: '0.2em', borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}
            title="Download primary resume (PDF)"
          >
            <span>CV PDF</span>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v8M4 8l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      )}
    </>
  );
}
