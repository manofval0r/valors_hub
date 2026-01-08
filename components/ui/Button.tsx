'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = "font-normal transition-all duration-200 rounded-sm inline-flex items-center justify-center";

    const variants = {
        primary: "bg-transparent border border-[var(--alabaster)] text-[var(--alabaster)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[var(--lavender)]/20",
        secondary: "text-[var(--lavender)] hover:text-[var(--alabaster)] relative group",
        ghost: "text-[var(--alabaster)] hover:bg-[var(--alabaster)]/10"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg"
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {children}
            {variant === 'secondary' && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--alabaster)] group-hover:w-full transition-all duration-200" />
            )}
        </motion.button>
    );
}
