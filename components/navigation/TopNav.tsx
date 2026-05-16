'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActiveSection } from '@/lib/hooks';

export default function TopNav() {
    const pathname = usePathname();
    const { activeSection, isScrolled, navItems } = useActiveSection();

    // Check if we are on a specific project case study page
    const isProjectPage = pathname.startsWith('/work/') && pathname.length > 6;
    const projectSlug = isProjectPage ? pathname.split('/')[2] : null;
    const formattedProjectName = projectSlug ? projectSlug.replace(/-/g, ' ') : '';

    return (
        <nav
            aria-label="Top Navigation"
            className={`fixed top-6 right-6 lg:right-12 z-[60] hidden md:flex items-center transition-all duration-500 rounded-full ${
                isScrolled || isProjectPage
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
                    </>
                ) : (
                    // Standard section links
                    navItems.map((link) => {
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
                    })
                )}
            </ul>
        </nav>
    );
}
