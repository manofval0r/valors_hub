'use client';

import { useRef, useEffect } from 'react';

// Dot-matrix plate with cursor lens. Hovering the plate raises dot
// visibility (the hero ask). Theme aware via data-world.
export default function DotField({ className = '', density = 26, hoverBoost = false }: { className?: string; density?: number; hoverBoost?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const boostRef = useRef(hoverBoost);
  boostRef.current = hoverBoost;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let raf = 0;
    let w = 0, h = 0;
    const mouse = { x: -9999, y: -9999 };
    let t = 0;
    let boost = 0;

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    if (!coarse) {
      wrap.addEventListener('pointermove', onMove, { passive: true });
      wrap.addEventListener('pointerleave', onLeave);
    }

    const isPaper = () => document.documentElement.dataset.world === 'paper';

    const draw = () => {
      t += 0.008;
      const target = boostRef.current ? 1 : 0;
      boost += (target - boost) * 0.08;
      ctx.clearRect(0, 0, w, h);
      const gap = density;
      const paper = isPaper();
      const R = 140 + boost * 90;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const lens = Math.max(0, 1 - dist / R);
          const noise = Math.sin(x * 0.02 + t * 2) * Math.cos(y * 0.02 + t * 1.6);
          const base = (reduced ? 0.5 : 0.32 + noise * 0.06) + boost * 0.22;
          const r = 1 + lens * (1.6 + boost * 1.2) + (reduced ? 0 : noise * 0.25) + boost * 0.5;
          const alpha = Math.min(1, base + lens * 0.55);
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.4, r), 0, Math.PI * 2);
          ctx.fillStyle = paper
            ? `rgba(11,11,12,${(alpha * 0.55).toFixed(3)})`
            : `rgba(252,252,251,${(alpha * 0.6).toFixed(3)})`;
          ctx.fill();
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
    };
  }, [density]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
