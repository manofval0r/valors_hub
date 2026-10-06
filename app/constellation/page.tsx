import type { Metadata } from 'next';
import Link from 'next/link';
import ConstellationCanvas from '@/components/ui/ConstellationCanvas';

export const metadata: Metadata = {
  title: 'Project Constellation — David Idowu',
  description: 'An interactive map of all 17 projects. Shared technologies and architectural patterns across the portfolio.',
};

export default function ConstellationPage() {
  return (
    <main className="h-screen h-[100dvh] flex flex-col overflow-hidden" style={{ background: 'var(--ground)' }}>
      <div className="flex items-center justify-between pl-6 md:pl-12 pr-24 md:pr-28 py-5 border-b flex-shrink-0" style={{ borderColor: 'var(--rule)' }}>
        <div>
          <h1 className="text-sm font-mono uppercase" style={{ letterSpacing: '0.3em', color: 'var(--ink-strong)' }}>Project Constellation</h1>
          <p className="text-[9px] font-mono uppercase mt-0.5" style={{ letterSpacing: '0.2em', color: 'var(--ink-faint)' }}>17 projects. Shared architectures. Click to explore.</p>
        </div>
        <Link
          href="/work"
          className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest transition-colors group"
          style={{ color: 'var(--ink-faint)' }}
        >
          <svg className="group-hover:-translate-x-0.5 transition-transform" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          All Projects
        </Link>
      </div>

      <div className="flex-1 relative">
        <ConstellationCanvas />
      </div>
    </main>
  );
}
