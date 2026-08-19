import type { Metadata } from 'next';
import Link from 'next/link';
import ConstellationCanvas from '@/components/ui/ConstellationCanvas';

export const metadata: Metadata = {
    title: 'Project Constellation — David Idowu',
    description: 'An interactive map of all 16 projects — visualizing shared technologies, architectural patterns, and cross-project connections across the portfolio.',
};

export default function ConstellationPage() {
    return (
        <main className="h-screen h-[100dvh] bg-[#030910] flex flex-col overflow-hidden">
            {/* ── Header bar ── */}
            <div className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-[#778da9]/10 flex-shrink-0">
                <div>
                    <h1 className="text-sm font-mono text-[#e0e1dd] uppercase tracking-[0.3em]">Project Constellation</h1>
                    <p className="text-[#778da9] text-[9px] font-mono uppercase tracking-[0.2em] mt-0.5">16 projects · shared architectures · click to explore</p>
                </div>
                <Link
                    href="/work"
                    className="flex items-center gap-2 text-[#778da9] hover:text-[#e0e1dd] text-[10px] font-mono uppercase tracking-widest transition-colors group"
                >
                    <svg className="group-hover:-translate-x-0.5 transition-transform" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    All Projects
                </Link>
            </div>

            {/* ── Full-screen canvas ── */}
            <div className="flex-1 relative">
                <ConstellationCanvas />
            </div>
        </main>
    );
}
