'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';

export default function DynamicBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const springX = useSpring(0, { stiffness: 50, damping: 20 });
    const springY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    useEffect(() => {
        springX.set(mousePosition.x);
        springY.set(mousePosition.y);
    }, [mousePosition, springX, springY]);

    const background = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(119, 141, 169, 0.1), transparent 40%)`;

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[-1] opacity-40 mix-blend-screen"
            style={{ background }}
        />
    );
}
