'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { animate, stagger } from 'animejs';
import type { resumes } from '@/data/personal';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const Document = dynamic(() => import('react-pdf').then((m) => m.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((m) => m.Page), { ssr: false });

type Resume = (typeof resumes)[number];

const ZOOMS = [0.7, 0.9, 1.1, 1.35];

// One-time worker wiring for pdf.js. The worker ships with the app at
// /pdf.worker.min.mjs (copied from the installed pdfjs-dist), so there is
// no CDN fetch and no version skew.
let workerReady = false;
function ensureWorker(done?: () => void) {
  if (typeof window === 'undefined') return;
  if (workerReady) { done?.(); return; }
  import('react-pdf').then(({ pdfjs }) => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    workerReady = true;
    done?.();
  }).catch(() => { workerReady = false; });
}

interface ResumeDossierProps {
  resume: Resume;
  onBack?: () => void;
  showBack?: boolean;
}

// Plate dossier reader: the PDF stays inside the portfolio. Mono ledger,
// zoom, keyboard, page scrubber. Entrance choreographed with animejs.
export default function ResumeDossier({ resume, onBack, showBack = true }: ResumeDossierProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [numPages, setNumPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const [zoomIdx, setZoomIdx] = useState(1);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [workerOk, setWorkerOk] = useState(false);

  // The Document mounts only after the worker path is assigned,
  // so pdf.js can never initialise with a bad worker.
  useEffect(() => {
    let cancelled = false;
    ensureWorker(() => { if (!cancelled) setWorkerOk(true); });
    return () => { cancelled = true; };
  }, []);

  // Reset per resume
  useEffect(() => {
    setNumPages(0);
    setCurrent(1);
    setFailed(false);
    setReady(false);
    pageRefs.current = [];
    scrollRef.current?.scrollTo({ top: 0 });
  }, [resume.url]);

  // Entrance: header draws, pages rise in stagger. Transform/opacity only.
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const root = rootRef.current;
    if (!root) return;
    const pages = Array.from(root.querySelectorAll('.dz-page'));
    const head = Array.from(root.querySelectorAll('.dz-head-item'));
    const anims = [
      animate(head, { opacity: [0, 1], y: [8, 0], duration: 320, delay: stagger(45), ease: 'outQuad' }),
      animate(pages, { opacity: [0, 1], y: [18, 0], duration: 420, delay: stagger(90, { start: 120 }), ease: 'outExpo' }),
    ];
    return () => { anims.forEach((a) => a.pause()); };
  }, [ready, resume.url]);

  // Track current page while scrolling
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || numPages === 0) return;
    const onScroll = () => {
      const top = scroller.scrollTop + scroller.clientHeight * 0.3;
      let idx = 1;
      pageRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= top) idx = i + 1;
      });
      setCurrent(idx);
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [numPages, zoomIdx]);

  const goTo = useCallback((n: number) => {
    const el = pageRefs.current[n - 1];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const zoom = ZOOMS[zoomIdx];
  const progress = numPages > 0 ? (current / numPages) * 100 : 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(Math.min(numPages, current + 1)); }
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(Math.max(1, current - 1)); }
      else if (e.key === '+' || e.key === '=') setZoomIdx((z) => Math.min(ZOOMS.length - 1, z + 1));
      else if (e.key === '-') setZoomIdx((z) => Math.max(0, z - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, numPages, goTo]);

  return (
    <div ref={rootRef} className="flex flex-col h-full min-h-0">
      {/* Dossier header */}
      <div className="shrink-0 border-b" style={{ borderColor: 'var(--rule)' }}>
        <div className="flex items-center justify-between gap-3 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            {showBack && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="dz-head-item px-3 py-1.5 border rounded-[2px] text-[10px] font-mono uppercase cursor-pointer transition-colors shrink-0"
                style={{ letterSpacing: '0.14em', borderColor: 'var(--rule)', color: 'var(--ink-faint)' }}
              >
                ← All
              </button>
            )}
            <div className="min-w-0">
              <div className="dz-head-item flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ink-strong)' }} />
                <span className="text-[10px] font-mono uppercase" style={{ letterSpacing: '0.2em', color: 'var(--ink-soft)' }}>
                  Dossier
                </span>
              </div>
              <h3 className="dz-head-item text-lg font-normal truncate" style={{ color: 'var(--ink-strong)' }}>
                {resume.role}
              </h3>
            </div>
          </div>
          <div className="dz-head-item flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => setZoomIdx((z) => Math.max(0, z - 1))} disabled={zoomIdx === 0} aria-label="Zoom out" className="w-8 h-8 border rounded-[2px] font-mono cursor-pointer disabled:opacity-30" style={{ borderColor: 'var(--rule)', color: 'var(--ink-strong)' }}>−</button>
            <span className="font-mono w-11 text-center" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoomIdx((z) => Math.min(ZOOMS.length - 1, z + 1))} disabled={zoomIdx === ZOOMS.length - 1} aria-label="Zoom in" className="w-8 h-8 border rounded-[2px] font-mono cursor-pointer disabled:opacity-30" style={{ borderColor: 'var(--rule)', color: 'var(--ink-strong)' }}>+</button>
            <a href={resume.url} download className="px-3 h-8 hidden sm:inline-flex items-center border rounded-[2px] text-[10px] font-mono uppercase" style={{ letterSpacing: '0.12em', borderColor: 'var(--ink-strong)', background: 'var(--ink-strong)', color: 'var(--accent-ink)', fontWeight: 700 }}>
              PDF ↓
            </a>
          </div>
        </div>
        {/* Page ledger + progress rail */}
        <div className="flex items-center gap-3 pb-3">
          <span className="dz-head-item font-mono" style={{ fontSize: 11, color: 'var(--ink-strong)', fontWeight: 700 }}>
            {String(current).padStart(2, '0')} <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>/ {String(numPages).padStart(2, '0')}</span>
          </span>
          <div className="dz-head-item relative flex-1 h-px" style={{ background: 'var(--rule)' }} role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={Math.max(numPages, 1)} aria-label="Reading progress">
            <div className="absolute left-0 top-0 h-px transition-all duration-200" style={{ width: `${progress}%`, background: 'var(--ink-strong)' }} />
          </div>
          <div className="dz-head-item hidden md:flex items-center gap-1">
            {Array.from({ length: numPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i + 1)}
                aria-label={`Go to page ${i + 1}`}
                className="h-4 px-1 font-mono cursor-pointer"
                style={{ fontSize: 9, color: current === i + 1 ? 'var(--ink-strong)' : 'var(--ink-faint)', fontWeight: current === i + 1 ? 700 : 400 }}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto pt-4 pb-6 px-1">
        {failed ? (
          <div className="border rounded-[2px] p-8 text-center" style={{ borderColor: 'var(--rule-strong)' }}>
            <p className="font-mono text-sm" style={{ color: 'var(--ink-strong)' }}>Reader failed to load this file.</p>
            <a href={resume.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 px-5 py-2 border rounded-[2px] text-[11px] font-mono uppercase" style={{ letterSpacing: '0.14em', borderColor: 'var(--rule-fn)', color: 'var(--ink-strong)' }}>
              Open original in new tab
            </a>
          </div>
        ) : !workerOk ? (
          <div className="flex flex-col gap-2 py-16 items-center" aria-label="Preparing reader">
            {[0, 1, 2].map((i) => (
              <div key={i} className="dz-loading-bar h-2 rounded-full" style={{ width: `${220 - i * 40}px`, background: 'var(--rule-strong)', animationDelay: `${i * 0.15}s` }} />
            ))}
            <span className="font-mono uppercase mt-2" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-faint)' }}>Preparing reader</span>
          </div>
        ) : (
          <Document
            file={resume.url}
            onLoadSuccess={({ numPages: n }) => { setNumPages(n); setReady(true); }}
            onLoadError={() => setFailed(true)}
            loading={
              <div className="flex flex-col gap-2 py-16 items-center" aria-label="Loading resume">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="dz-loading-bar h-2 rounded-full" style={{ width: `${220 - i * 40}px`, background: 'var(--rule-strong)', animationDelay: `${i * 0.15}s` }} />
                ))}
                <span className="font-mono uppercase mt-2" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-faint)' }}>Printing plate</span>
              </div>
            }
          >
            {Array.from({ length: numPages }).map((_, i) => (
              <div
                key={`${resume.url}-${i}`}
                ref={(el) => { pageRefs.current[i] = el; }}
                className="dz-page mb-4 border rounded-[2px] overflow-hidden mx-auto bg-white"
                style={{ borderColor: 'var(--rule-strong)', maxWidth: 720, boxShadow: '0 16px 48px rgba(0,0,0,0.3)' }}
              >
                <Page
                  pageNumber={i + 1}
                  width={Math.min(680, (scrollRef.current?.clientWidth ?? 680) - 16) * zoom}
                  renderAnnotationLayer
                  renderTextLayer
                  loading=""
                />
              </div>
            ))}
          </Document>
        )}
      </div>

      {/* Footer strip */}
      <div className="shrink-0 flex items-center justify-between pt-3 border-t font-mono uppercase" style={{ borderColor: 'var(--rule)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--ink-faint)' }}>
        <div className="flex gap-2">
          <button type="button" onClick={() => goTo(Math.max(1, current - 1))} disabled={current <= 1} className="px-3 py-1.5 border rounded-[2px] cursor-pointer disabled:opacity-30" style={{ borderColor: 'var(--rule)' }}>← Prev</button>
          <button type="button" onClick={() => goTo(Math.min(numPages, current + 1))} disabled={current >= numPages} className="px-3 py-1.5 border rounded-[2px] cursor-pointer disabled:opacity-30" style={{ borderColor: 'var(--rule)' }}>Next →</button>
        </div>
        <span className="hidden sm:inline">Arrows turn pages · + and − zoom</span>
      </div>
    </div>
  );
}
