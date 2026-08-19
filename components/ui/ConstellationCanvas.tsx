'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false must live in a Client Component
const GlobalConstellation = dynamic(
    () => import('@/components/ui/GlobalConstellation'),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center w-full h-full">
                <span className="text-[#778da9] text-[10px] font-mono uppercase tracking-widest animate-pulse">
                    Loading constellation...
                </span>
            </div>
        ),
    }
);

export default function ConstellationCanvas() {
    return <GlobalConstellation />;
}
