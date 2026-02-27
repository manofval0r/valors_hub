'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const NAV_ITEMS = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'my-story', label: 'My Story', href: '#my-story' },
    { id: 'projects', label: 'Work', href: '#projects' },
    { id: 'experience', label: 'Experience', href: '#experience' },
    { id: 'contact', label: 'Contact', href: '#contact' },
];

/**
 * Shared hook for tracking the active section based on scroll position.
 * Throttled with rAF to avoid layout thrashing on every scroll event.
 */
export function useActiveSection() {
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const rafId = useRef<number>(0);
    const ticking = useRef(false);

    const updateActiveSection = useCallback(() => {
        const scrollY = window.scrollY;
        setIsScrolled(scrollY > 50);

        const scrollPosition = scrollY + window.innerHeight * 0.3;

        for (const item of NAV_ITEMS) {
            const element = document.getElementById(item.id);
            if (element) {
                const { offsetTop, offsetHeight } = element;
                if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                    setActiveSection(item.id);
                    break;
                }
            }
        }

        ticking.current = false;
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking.current) {
                ticking.current = true;
                rafId.current = requestAnimationFrame(updateActiveSection);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateActiveSection(); // Set initial state on mount
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafId.current);
        };
    }, [updateActiveSection]);

    return { activeSection, isScrolled, navItems: NAV_ITEMS };
}
