'use client';

import { motion, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import { useActiveSection } from '@/lib/hooks';

export default function MobileNav() {
    const { activeSection, navItems } = useActiveSection();

    return (
        <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#0d1b2a]/95 backdrop-blur-sm border-b border-[#778da9]/20 lg:hidden font-rubik">
            <div className="overflow-x-auto no-scrollbar flex justify-center ">
                <LayoutGroup id="mobile-nav">
                    <ul className="flex items-center gap-8 px-4 py-4 whitespace-nowrap relative ml-[44px]">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <li key={item.id} className="relative py-1">
                                    <Link
                                        href={item.href}
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
                    </ul>
                </LayoutGroup>
            </div>
            {/* Edge fade gradients for overflow */}
            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#0d1b2a] to-transparent pointer-events-none opacity-50" />
            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#0d1b2a] to-transparent pointer-events-none opacity-50" />
        </nav>
    );
}
