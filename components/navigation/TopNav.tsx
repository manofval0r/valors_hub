'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActiveSection } from '@/lib/hooks';
import AvailabilityBadge from '@/components/ui/AvailabilityBadge';

export default function TopNav() {
    const pathname = usePathname();
    const { activeSection, isScrolled, navItems } = useActiveSection();

    // Check if we are on a specific project case study page
    const isProjectPage = pathname.startsWith('/work/') && pathname.length > 6;
    const isConstellationPage = pathname === '/constellation';
    const isWorkPage = pathname === '/work';
    const projectSlug = isProjectPage ? pathname.split('/')[2] : null;
    const formattedProjectName = projectSlug ? projectSlug.replace(/-/g, ' ') : '';

    return (
        <>
        <nav
            aria-label="Top Navigation"
            className={`fixed top-6 right-6 lg:right-12 z-[60] hidden md:flex items-center transition-all duration-500 rounded-full ${
                isScrolled || isProjectPage || isWorkPage || isConstellationPage
                    ? 'bg-[#0d1b2a]/60 backdrop-blur-xl border border-[#e0e1dd]/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
                    : 'bg-transparent border-transparent'
            }`}
        >
            <ul className="flex items-center px-2 py-2">
                {isProjectPage ? (
                    // Breadcrumb style for project pages
                    <>
                        <li className="px-4">
                            <Link href="/" className="text-[#778da9] hover:text-[#e0e1dd] text-xs uppercase tracking-widest font-mono transition-colors">
                                Home
                            </Link>
                        </li>
                        <li className="text-[#778da9]/50 text-xs">/</li>
                        <li className="px-4">
                            <Link href="/work" className="text-[#778da9] hover:text-[#e0e1dd] text-xs uppercase tracking-widest font-mono transition-colors">
                                All Projects
                            </Link>
                        </li>
                        <li className="text-[#778da9]/50 text-xs">/</li>
                        <li className="px-4">
                            <span className="text-[#e0e1dd] text-xs uppercase tracking-widest font-mono">
                                {formattedProjectName}
                            </span>
                        </li>
                        <li className="text-[#778da9]/50 text-xs">/</li>
                        <li className="px-4">
                            <Link href="/constellation" className="text-[#778da9] hover:text-[#e0e1dd] text-xs uppercase tracking-widest font-mono transition-colors">
                                Constellation
                            </Link>
                        </li>
                    </>
                ) : (
                    // Standard section links
                    <>
                        {navItems.map((link) => {
                            const isActive = activeSection === link.id && pathname === '/';
                            return (
                                <li key={link.id} className="relative">
                                    <Link
                                        href={pathname === '/' ? link.href : `/${link.href}`}
                                        className={`relative z-10 px-5 py-2 block text-xs uppercase tracking-widest font-mono transition-colors ${
                                            isActive ? 'text-[#0d1b2a]' : 'text-[#778da9] hover:text-[#e0e1dd]'
                                        }`}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                layoutId="active-nav-pill"
                                                className="absolute inset-0 bg-[#e0e1dd] rounded-full -z-10"
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                        {(isWorkPage || isConstellationPage) && (
                            <li className="relative">
                                <Link
                                    href="/constellation"
                                    className={`relative z-10 px-5 py-2 block text-xs uppercase tracking-widest font-mono transition-colors ${
                                        isConstellationPage ? 'text-[#0d1b2a]' : 'text-[#778da9] hover:text-[#e0e1dd]'
                                    }`}
                                >
                                    Constellation
                                    {isConstellationPage && (
                                        <motion.div
                                            layoutId="active-nav-pill"
                                            className="absolute inset-0 bg-[#e0e1dd] rounded-full -z-10"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </li>
                        )}
                    </>
                )}
            </ul>
        </nav>

        {/* ── Top-Left Action Badges — desktop only, fixed top-left, home page only ── */}
        {pathname === '/' && (
            <div className="fixed top-6 left-6 lg:left-12 z-[60] hidden md:flex items-center gap-3">
                <AvailabilityBadge />
                <a
                    href="/resumes/SWE_David_Idowu.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#778da9]/20 bg-[#0d1b2a]/80 backdrop-blur-md hover:border-[#52b788]/50 text-[#778da9] hover:text-[#52b788] text-[10px] font-mono uppercase tracking-[0.2em] transition-all"
                    title="1-Click Download Primary Software Engineer Resume (PDF)"
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
