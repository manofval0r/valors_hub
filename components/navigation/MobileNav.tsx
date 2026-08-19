'use client';

import { motion, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useActiveSection } from '@/lib/hooks';
import AvailabilityBadge from '@/components/ui/AvailabilityBadge';

export default function MobileNav() {
    const pathname = usePathname();
    const { activeSection, navItems } = useActiveSection();

    const isHome = pathname === '/';
    const isProjectPage = pathname.startsWith('/work/') && pathname.length > 6;
    const isConstellationPage = pathname === '/constellation';
    const isWorkPage = pathname === '/work';
    const showConstellation = isWorkPage || isConstellationPage || isProjectPage;

    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#0d1b2a]/95 backdrop-blur-sm border-b border-[#778da9]/20 lg:hidden font-rubik">
            <div className="flex items-center px-3 py-3">
                {/* Availability badge — left slot */}
                {isHome ? (
                    <AvailabilityBadge />
                ) : (
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#778da9]/20 text-[#778da9] hover:text-[#e0e1dd] text-[10px] font-mono uppercase tracking-widest bg-[#0d1b2a]/80"
                    >
                        Home
                    </Link>
                )}

                {/* Nav links — scrollable row */}
                <div className="flex-1 overflow-x-auto no-scrollbar">
                    <LayoutGroup id="mobile-nav">
                        <ul className="flex items-center gap-8 px-4 py-1 whitespace-nowrap relative">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.id && isHome;
                                const href = isHome ? item.href : (item.href.startsWith('#') ? `/${item.href}` : item.href);
                                return (
                                    <li key={item.id} className="relative py-1">
                                        <Link
                                            href={href}
                                            aria-current={isActive ? 'page' : undefined}
                                            className={`text-sm tracking-widest transition-colors duration-200 block ${isActive
                                                ? 'text-[#e0e1dd]'
                                                : 'text-[#778da9] hover:text-[#e0e1dd]'
                                                }`}
                                        >
                                            {item.label}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="mobileActiveIndicator"
                                                    className="absolute -bottom-[-2px] left-0 right-0 h-[2px] bg-[#e0e1dd]"
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 500,
                                                        damping: 30
                                                    }}
                                                />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                            {showConstellation && (
                                <li className="relative py-1">
                                    <Link
                                        href="/constellation"
                                        className={`text-sm tracking-widest transition-colors duration-200 block ${isConstellationPage
                                            ? 'text-[#52b788]'
                                            : 'text-[#778da9] hover:text-[#e0e1dd]'
                                            }`}
                                    >
                                        Constellation
                                        {isConstellationPage && (
                                            <motion.div
                                                layoutId="mobileActiveIndicator"
                                                className="absolute -bottom-[-2px] left-0 right-0 h-[2px] bg-[#52b788]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30
                                                }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </LayoutGroup>
                </div>
            </div>
            {/* Edge fade gradient on right for overflow */}
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#0d1b2a] to-transparent pointer-events-none opacity-50" />
        </nav>
    );
}
