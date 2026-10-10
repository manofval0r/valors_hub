'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumes } from '@/data/personal';
import ResumeDossier from './ResumeDossier';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface ResumeSheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResumeSheet({ isOpen, onClose }: ResumeSheetProps) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = resumes.find((r) => r.id === selectedId) ?? null;
    const expanded = selected !== null;

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Fresh list each time the sheet opens
    useEffect(() => {
        if (isOpen) setSelectedId(null);
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedId) setSelectedId(null);
                else onClose();
            }
        };
        if (isOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, selectedId, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-50 bg-[var(--ground)]/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[51] bg-[var(--ground)]/95 backdrop-blur-2xl border-t border-[var(--rule-strong)] rounded-t-[2px] flex flex-col"
                        style={{ maxHeight: expanded ? '92vh' : '85vh', height: expanded ? '92vh' : undefined }}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                        role="dialog"
                        aria-modal="true"
                        aria-label={expanded && selected ? `Reading ${selected.role}` : 'Select a targeted resume'}
                    >
                        <div
                            className="w-full mx-auto flex flex-col h-full min-h-0 overflow-hidden px-6 pt-8 pb-4"
                            style={{ maxWidth: expanded ? '52rem' : '36rem' }}
                        >
                            {expanded && selected ? (
                                <div className="flex flex-col h-full min-h-0">
                                    <ResumeDossier
                                        resume={selected}
                                        onBack={() => setSelectedId(null)}
                                    />
                                    {/* Role switcher rail */}
                                    <div className="shrink-0 flex gap-1.5 overflow-x-auto hide-scrollbar pt-3 border-t mt-1" style={{ borderColor: 'var(--rule)' }} aria-label="Switch role version">
                                        {resumes.map((r) => {
                                            const active = r.id === selected.id;
                                            return (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setSelectedId(r.id)}
                                                    aria-pressed={active}
                                                    className="shrink-0 px-3 py-1.5 border rounded-[2px] text-[10px] font-mono uppercase cursor-pointer transition-colors"
                                                    style={{
                                                        letterSpacing: '0.1em',
                                                        borderColor: active ? 'var(--ink-strong)' : 'var(--rule)',
                                                        background: active ? 'var(--ink-strong)' : 'transparent',
                                                        color: active ? 'var(--accent-ink)' : 'var(--ink-faint)',
                                                        fontWeight: active ? 700 : 400,
                                                    }}
                                                >
                                                    {r.role.replace(' (Primary)', '')}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* Header */}
                                    <div className="flex items-center justify-between shrink-0 mb-6 pb-3 border-b border-[var(--rule)]">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-2 h-2 rounded-full bg-[var(--ink-strong)]" />
                                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--ink-strong)]">
                                                    Targeted CV Library
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-normal text-[var(--ink-strong)]">Select Role Version</h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            aria-label="Close"
                                            className="text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-colors p-2 text-sm font-mono cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* List: click reads in place, icon downloads */}
                                    <div className="flex flex-col gap-2.5 overflow-y-auto pb-8 pr-1 custom-scrollbar">
                                        {resumes.map((resume, i) => (
                                            <motion.div
                                                key={resume.id}
                                                className={`group flex items-center justify-between p-4 border rounded-[2px] transition-all cursor-pointer ${
                                                    resume.isPrimary
                                                        ? 'bg-[var(--ground-2)] border-[var(--rule-strong)] hover:border-[var(--rule-fn)]'
                                                        : 'bg-[var(--ground)]/40 border-[var(--rule)] hover:border-[var(--rule-strong)] hover:bg-[var(--ground-2)]'
                                                }`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.04, duration: 0.22, ease: EASE_OUT }}
                                                onClick={() => setSelectedId(resume.id)}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Read ${resume.role} without leaving the portfolio`}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(resume.id); }
                                                }}
                                            >
                                                <div className="flex flex-col gap-1 pr-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-[var(--ink-strong)] font-medium">
                                                            {resume.role}
                                                        </span>
                                                        {resume.isPrimary && (
                                                            <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.2 bg-[var(--ground-2)] text-[var(--ink-soft)] border border-[var(--rule-strong)] rounded-[2px]">
                                                                Recommended
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-[var(--ink-faint)] font-mono leading-relaxed font-light">
                                                        {resume.description}
                                                    </span>
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--ink-faint)] group-hover:text-[var(--ink-strong)] transition-colors">
                                                        Read here →
                                                    </span>
                                                </div>
                                                <a
                                                    href={resume.url}
                                                    download
                                                    onClick={(e) => e.stopPropagation()}
                                                    aria-label={`Download ${resume.role} PDF`}
                                                    className="flex items-center gap-2 text-xs font-mono text-[var(--ink-faint)] hover:text-[var(--ink-strong)] flex-shrink-0 transition-colors p-2"
                                                >
                                                    <span className="hidden sm:inline text-[10px] uppercase tracking-wider">PDF</span>
                                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 3v8M4 8l4 4 4-4M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </a>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
