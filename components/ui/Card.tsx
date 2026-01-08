'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverable?: boolean;
    onClick?: () => void;
}

export default function Card({
    children,
    className = '',
    hoverable = false,
    onClick
}: CardProps) {
    const hoverProps = hoverable ? {
        whileHover: { y: -5, transition: { duration: 0.2 } },
        whileTap: { y: 0 }
    } : {};

    return (
        <motion.div
            className={`border border-[var(--lavender)]/30 bg-[var(--ink-black)] p-6 rounded-sm ${hoverable ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
            {...hoverProps}
        >
            {children}
        </motion.div>
    );
}
