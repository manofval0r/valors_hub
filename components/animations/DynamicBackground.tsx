'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionTemplate } from 'framer-motion';

export default function DynamicBackground() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const springX = useSpring(0, { stiffness: 40, damping: 25 });
    const springY = useSpring(0, { stiffness: 40, damping: 25 });

    useEffect(() => {
        const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
        setIsTouchDevice(isTouch);

        if (isTouch) return;

        let rafId: number;
        const updateMousePosition = (e: MouseEvent) => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY });
            });
        };

        window.addEventListener('mousemove', updateMousePosition, { passive: true });
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            cancelAnimationFrame(rafId);
        };
    }, []);

    useEffect(() => {
        if (isTouchDevice) return;
        springX.set(mousePosition.x);
        springY.set(mousePosition.y);
    }, [mousePosition, springX, springY, isTouchDevice]);

    const dynamicBg = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(119, 141, 169, 0.08), transparent 40%)`;

    if (isTouchDevice) {
        return (
            <div
                className="pointer-events-none fixed inset-0 z-[-1] opacity-30 mix-blend-screen"
                style={{
                    background: 'radial-gradient(circle at 50% 30%, rgba(119, 141, 169, 0.08), transparent 60%)',
                }}
            />
        );
    }

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-[-1] opacity-40 mix-blend-screen"
            style={{ background: dynamicBg }}
        />
    );
}
