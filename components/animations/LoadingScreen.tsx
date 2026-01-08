'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setMounted(true);
        // Check if user has visited before
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (hasVisited) {
            setIsVisible(false);
            return;
        }

        // Mark as visited
        sessionStorage.setItem('hasVisited', 'true');

        // Hide loading screen after animation completes
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    if (!mounted || !isVisible) return null;

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1b2a]/95 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 1.0, duration: 0.2 }}
            onAnimationComplete={() => setIsVisible(false)}
        >
            <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 1. Three horizontal lines fade in simultaneously (0.2s) */}
                {/* 2. Lines grow sequentially (0.5s total) */}
                <motion.line
                    x1="50" y1="80" x2="50" y2="80"
                    stroke="#e0e1dd" strokeWidth="3" strokeLinecap="round"
                    initial={{ x2: 50, opacity: 0 }}
                    animate={{ x2: 150, opacity: 1 }}
                    transition={{
                        opacity: { duration: 0.2 },
                        x2: { duration: 0.3, delay: 0.15, ease: "easeInOut" }
                    }}
                />
                <motion.line
                    x1="50" y1="100" x2="50" y2="100"
                    stroke="#e0e1dd" strokeWidth="3" strokeLinecap="round"
                    initial={{ x2: 50, opacity: 0 }}
                    animate={{ x2: 150, opacity: 1 }}
                    transition={{
                        opacity: { duration: 0.2 },
                        x2: { duration: 0.3, delay: 0.3, ease: "easeInOut" }
                    }}
                />
                <motion.line
                    x1="50" y1="120" x2="50" y2="120"
                    stroke="#e0e1dd" strokeWidth="3" strokeLinecap="round"
                    initial={{ x2: 50, opacity: 0 }}
                    animate={{ x2: 150, opacity: 1 }}
                    transition={{
                        opacity: { duration: 0.2 },
                        x2: { duration: 0.3, delay: 0.45, ease: "easeInOut" }
                    }}
                />

                {/* 4. Morph into checkmark + underline (0.3s) after pause (0.1s) */}
                {/* Transition starts at ~0.8s */}
                <motion.path
                    d="M 70 95 L 95 120 L 135 75"
                    stroke="#e0e1dd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                />

                <motion.line
                    x1="60" y1="145" x2="60" y2="145"
                    stroke="#e0e1dd" strokeWidth="2" strokeLinecap="round"
                    initial={{ x2: 60, opacity: 0 }}
                    animate={{ x2: 140, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                />
            </svg>
        </motion.div>
    );
}
