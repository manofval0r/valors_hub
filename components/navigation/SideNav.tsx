'use client';

import { motion, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { useActiveSection } from '@/lib/hooks';

export default function SideNav() {
    const { activeSection, isScrolled, navItems } = useActiveSection();
    const [isHovered, setIsHovered] = useState(false);

    // Labels visible ONLY when hovered or interacted with
    const showLabels = isHovered;

    return (
        <nav
            aria-label="Side Navigation"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-[60] hidden lg:flex flex-col items-end transition-all duration-500 rounded-2xl group cursor-pointer ${isHovered
                    ? 'bg-[#0d1b2a]/80 backdrop-blur-xl border border-[#e0e1dd]/20 py-8 pl-8 pr-4 shadow-2xl'
                    : isScrolled
                        ? 'bg-[#0d1b2a]/20 backdrop-blur-md border border-[#e0e1dd]/5 py-6 pl-3 pr-3 shadow-lg'
                        : 'bg-transparent py-4 pl-0 pr-0 border-transparent shadow-none'
                }`}
        >
            <LayoutGroup id="sidenav">
                <ul className="flex flex-col gap-6 items-end">
                    {navItems.map((link) => {
                        const isActive = activeSection === link.id;

                        return (
                            <li key={link.id} className="relative flex items-center justify-end">
                                <Link
                                    href={link.href}
                                    onClick={() => setIsHovered(false)} // Collapse after selection
                                    aria-label={`Navigate to ${link.label}`}
                                    aria-current={isActive ? 'page' : undefined}
                                    className="relative z-10 flex items-center justify-end gap-1 py-1"
                                >
                                    {/* Text Label — visible when hovered */}
                                    <span
                                        className={`text-sm tracking-[0.2em] uppercase transition-all duration-500 transform origin-right whitespace-nowrap overflow-hidden
                                            ${isActive ? 'text-[#e0e1dd]' : 'text-[#778da9]'}
                                            ${showLabels ? 'opacity-100 translate-x-0 max-w-[200px] mr-3' : 'opacity-0 translate-x-4 max-w-0 mr-0'}
                                        `}
                                    >
                                        {link.label}
                                    </span>

                                    {/* Active indicator (animated bar) or passive dot */}
                                    <div className="relative flex items-center justify-center w-6 h-6">
                                        {isActive ? (
                                            <motion.div
                                                layoutId="active-indicator-side"
                                                className="absolute right-0 w-[2px] h-full bg-[#e0e1dd]"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30
                                                }}
                                            />
                                        ) : (
                                            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${showLabels ? 'bg-[#e0e1dd]/50' : 'bg-[#778da9]/50'}`} />
                                        )}
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </LayoutGroup>
        </nav>
    );
}
