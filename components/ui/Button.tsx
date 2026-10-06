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
    const baseStyles = "font-normal transition-all duration-200 rounded-[2px] inline-flex items-center justify-center";

    const variants = {
        primary: "bg-transparent border border-[var(--rule-strong)] text-[var(--ink-strong)] hover:-translate-y-0.5 hover:border-[var(--rule-fn)]",
        secondary: "text-[var(--ink-soft)] hover:text-[var(--ink-strong)] relative group",
        ghost: "text-[var(--ink-strong)] hover:bg-[var(--ground-2)]"
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
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--ink-strong)] group-hover:w-full transition-all duration-200" />
            )}
        </motion.button>
    );
}
