'use client';

import { motion, LayoutGroup } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'my-story', label: 'My Story', href: '#my-story' },
    { id: 'projects', label: 'Work', href: '#projects' },
    { id: 'experience', label: 'Experience', href: '#experience' },
    { id: 'contact', label: 'Contact', href: '#contact' },
];

export default function SideNav() {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            const sections = navItems.map(item => item.id);
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
            <LayoutGroup id="sidenav">
                <ul className="flex flex-col gap-6">
                    {navItems.map((link) => {
                        const isActive = activeSection === link.id;

                        return (
                            <li key={link.id} className="relative py-1">
                                <Link
                                    href={link.href}
                                    className={`relative z-10 text-sm tracking-[0.2em] uppercase transition-colors duration-300 pl-4 ${isActive
                                        ? 'text-[#e0e1dd]'
                                        : 'text-[#778da9] hover:text-[#e0e1dd]'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-indicator-side"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-full bg-[#e0e1dd]"
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </LayoutGroup>
        </nav>
    );
}
