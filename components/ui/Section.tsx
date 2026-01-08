'use client';

import { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    id?: string;
    className?: string;
    background?: 'default' | 'alternate';
    noPadding?: boolean;
}

export default function Section({
    children,
    id,
    className = '',
    background = 'default',
    noPadding = false
}: SectionProps) {
    const bgClass = background === 'alternate'
        ? 'bg-[#112131]' // Ink Black + 2% Alabaster overlay equivalent
        : 'bg-[#0d1b2a]';

    const paddingClass = noPadding
        ? ''
        : 'py-20 lg:py-[200px] px-6 md:px-12 lg:px-24';

    return (
        <section
            id={id}
            className={`${bgClass} ${paddingClass} scroll-mt-24 ${className}`}
        >
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </section>
    );
}
