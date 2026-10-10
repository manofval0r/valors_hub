'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useEffect, useRef } from 'react';
import Section from '../ui/Section';
import { skills, skillCategories } from '@/data/skills';
import { fadeInUp } from '@/lib/animations';

// Coordinate contract (the whole stability story):
// - One fixed plate space: 1000 x 620 viewBox units. The container locks
//   the same aspect, so 1 viewBox unit scales uniformly on any zoom.
// - One source of truth for node position: basePositions + offsets state.
//   No animation library writes transforms on nodes, so nothing can fight
//   over position and nothing accumulates twice (the old runaway bug).
// - Pointer deltas arrive in screen px and are converted to viewBox units
//   by the live measured scale. Drags are clamped to the plate.
const W = 1000;
const H = 620;
const CX = W / 2;
const CY = H / 2;
const MARGIN_X = 62;
const MARGIN_Y = 58;

function seedRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function Skills() {
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [isMobile, setIsMobile] = useState(false);
  // The plate is client-only: deterministic layout still differs at the
  // last float between Node and browser math, and isMobile starts false
  // on the server. Render a static skeleton until mount so SSR and the
  // first client pass are byte-identical.
  const [mounted, setMounted] = useState(false);
  const plateRef = useRef<HTMLDivElement>(null);

  // Live drag session. Kept in a ref so moves never trigger renders
  // themselves; a single rAF-flushed setState commits each frame.
  const dragRef = useRef<{
    id: string;
    pointerX: number;
    pointerY: number;
    baseOX: number;
    baseOY: number;
    pending: { x: number; y: number } | null;
    raf: number;
  } | null>(null);

  const filteredSkills = useMemo(
    () => skills.filter((s) => filter === 'all' || (filter === 'core' ? s.core : s.category === filter)),
    [filter]
  );

  const skillsByCategory = useMemo(() => {
    const grouped: Record<string, typeof skills> = {};
    skillCategories.forEach((cat) => {
      if (cat.id === 'all') return;
      grouped[cat.id] = cat.id === 'core' ? skills.filter((s) => s.core) : skills.filter((s) => s.category === cat.id);
    });
    return grouped;
  }, []);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // New set, clean plate. Also aborts any in-flight drag.
  useEffect(() => {
    setOffsets({});
    setActiveId(null);
    if (dragRef.current) {
      cancelAnimationFrame(dragRef.current.raf);
      dragRef.current = null;
    }
  }, [filter]);

  useEffect(() => () => {
    if (dragRef.current) cancelAnimationFrame(dragRef.current.raf);
  }, []);

  const basePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number; layer: number }> = {};
    const coreNodes = filteredSkills.filter((s) => s.core);
    const orbitNodes = filteredSkills.filter((s) => !s.core);
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    coreNodes.forEach((skill, i) => {
      const rng = seedRandom(skill.id);
      const angle = i * GOLDEN + (rng() - 0.5) * 0.4;
      const radius = coreNodes.length > 1 ? 110 + rng() * 50 : 0;
      positions[skill.id] = {
        x: clamp(CX + radius * Math.cos(angle), MARGIN_X, W - MARGIN_X),
        y: clamp(CY + radius * Math.sin(angle) * 0.8, MARGIN_Y, H - MARGIN_Y),
        layer: 0,
      };
    });
    orbitNodes.forEach((skill, i) => {
      const rng = seedRandom(skill.id);
      const angle = i * GOLDEN + 0.7 + (rng() - 0.5) * 0.5;
      const rx = 400 + rng() * 60;
      const ry = 225 + rng() * 40;
      positions[skill.id] = {
        x: clamp(CX + rx * Math.cos(angle), MARGIN_X, W - MARGIN_X),
        y: clamp(CY + ry * Math.sin(angle), MARGIN_Y, H - MARGIN_Y),
        layer: 1,
      };
    });
    return positions;
  }, [filteredSkills]);

  const pos = (id: string) => {
    const b = basePositions[id];
    if (!b) return null;
    const o = offsets[id] ?? { x: 0, y: 0 };
    return {
      x: clamp(b.x + o.x, MARGIN_X, W - MARGIN_X),
      y: clamp(b.y + o.y, MARGIN_Y, H - MARGIN_Y),
      layer: b.layer,
    };
  };

  // Screen px -> viewBox units, measured live so zoom never skews a drag.
  const unitScale = () => {
    const el = plateRef.current;
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 ? rect.width / W : 1;
  };

  const flushDrag = () => {
    const d = dragRef.current;
    if (!d || !d.pending) return;
    const p = d.pending;
    d.pending = null;
    setOffsets((prev) => ({ ...prev, [d.id]: p }));
  };

  const queueDrag = (clientX: number, clientY: number) => {
    const d = dragRef.current;
    if (!d) return;
    const s = unitScale();
    const b = basePositions[d.id];
    if (!b) return;
    const ox = d.baseOX + (clientX - d.pointerX) / s;
    const oy = d.baseOY + (clientY - d.pointerY) / s;
    d.pending = {
      x: clamp(b.x + ox, MARGIN_X, W - MARGIN_X) - b.x,
      y: clamp(b.y + oy, MARGIN_Y, H - MARGIN_Y) - b.y,
    };
    cancelAnimationFrame(d.raf);
    d.raf = requestAnimationFrame(flushDrag);
  };

  const beginDrag = (id: string, e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const o = offsets[id] ?? { x: 0, y: 0 };
    dragRef.current = {
      id, pointerX: e.clientX, pointerY: e.clientY,
      baseOX: o.x, baseOY: o.y, pending: null, raf: 0,
    };
    setActiveId(id);
  };

  const endDrag = () => {
    const d = dragRef.current;
    if (d) {
      cancelAnimationFrame(d.raf);
      if (d.pending) {
        const p = d.pending;
        setOffsets((prev) => ({ ...prev, [d.id]: p }));
      }
      dragRef.current = null;
    }
  };

  // Arrow keys nudge the pinned node. Deterministic, 8 units a step.
  const nudge = (id: string, dx: number, dy: number) => {
    const b = basePositions[id];
    if (!b) return;
    const o = offsets[id] ?? { x: 0, y: 0 };
    setOffsets((prev) => ({
      ...prev,
      [id]: {
        x: clamp(b.x + o.x + dx, MARGIN_X, W - MARGIN_X) - b.x,
        y: clamp(b.y + o.y + dy, MARGIN_Y, H - MARGIN_Y) - b.y,
      },
    }));
  };

  const getLines = (name: string) => {
    if (name.length <= 10) return [name];
    const parts = name.split(/(?=[&/(])|\s/);
    if (parts.length > 1) return parts.slice(0, 2);
    return [name.slice(0, 12)];
  };

  const dailyCore = useMemo(() => skills.filter((s) => s.core), []);
  const matchCount = (id: string) =>
    skills.find((s) => s.id === id)?.connections.filter((c) => filteredSkills.some((f) => f.id === c)).length ?? 0;

  const activeSkill = activeId ? skills.find((s) => s.id === activeId) : null;

  return (
    <Section id="skills" index="003" label="Stack" background="default">
      <div className="flex flex-col gap-10 items-start w-full">
        <motion.div className="flex flex-col gap-3 max-w-2xl" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--ink-strong)' }} />
            <span className="text-[11px] font-mono uppercase" style={{ letterSpacing: '0.2em', color: 'var(--ink-soft)' }}>
              Technical index
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl" style={{ color: 'var(--ink-strong)', letterSpacing: '-0.03em' }}>
            Core Competencies and Stack
          </h2>
          <p className="text-xs md:text-sm font-mono leading-relaxed" style={{ color: 'var(--ink-faint)' }}>
            Daily production stack, security architecture, cloud infrastructure, and AI workflows. Hover to trace shared edges. Drag any hexagon. Layout holds on zoom.
          </p>
        </motion.div>

        {/* Daily core: ruled index, not a chip wall */}
        <motion.div
          className="w-full border rounded-[2px] overflow-hidden"
          style={{ borderColor: 'var(--rule-strong)', background: 'var(--ground-2)' }}
          variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <div className="flex items-baseline justify-between gap-4 px-4 md:px-5 pt-4">
            <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: 'var(--ink-strong)' }}>
              Daily production core
            </span>
            <span className="font-mono" style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink-strong)' }}>
              {String(dailyCore.length).padStart(2, '0')}
            </span>
          </div>
          <div className="px-4 md:px-5 pb-2 font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--ink-faint)' }}>
            The tools in active use. Full taxonomy below.
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3">
            {dailyCore.map((s, i) => (
              <li
                key={s.id}
                className="flex items-center gap-3 px-4 md:px-5 py-2.5 border-t"
                style={{ borderColor: 'var(--rule)' }}
              >
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ink-strong)' }} />
                <span className="font-mono uppercase truncate" style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-strong)' }}>{s.name}</span>
              </li>
            ))}
          </ol>
        </motion.div>

        <div className="hidden md:flex flex-col w-full gap-6">
          <div className="flex flex-wrap gap-2 w-full" role="tablist" aria-label="Filter skills">
            {skillCategories.map((cat) => {
              const active = filter === cat.id;
              const n = cat.id === 'all' ? skills.length : cat.id === 'core' ? dailyCore.length : skills.filter((s) => s.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(cat.id)}
                  className="weight-hover px-4 py-1.5 border rounded-[2px] text-[11px] font-mono uppercase cursor-pointer transition-colors"
                  style={{
                    letterSpacing: '0.14em',
                    borderColor: active ? 'var(--ink-strong)' : 'var(--rule)',
                    background: active ? 'var(--ink-strong)' : 'transparent',
                    color: active ? 'var(--accent-ink)' : 'var(--ink-faint)',
                    fontWeight: active ? 700 : 400,
                  }}
                >
                  {cat.label} · {n}
                </button>
              );
            })}
          </div>

          {!mounted ? (
            <div className="relative w-full border rounded-[2px] overflow-hidden" style={{ borderColor: 'var(--rule-strong)', background: 'var(--ground)', aspectRatio: '1000 / 620' }} aria-label="Loading skills plate">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--ink-faint)' }}>Plotting plate</span>
              </div>
            </div>
          ) : (
          <div className="relative w-full border rounded-[2px] overflow-hidden" style={{ borderColor: 'var(--rule-strong)', background: 'var(--ground)' }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--ground-dot) 1px, transparent 0)', backgroundSize: '28px 28px' }} aria-hidden="true" />
            {/* Fixed aspect matches viewBox so zoom never squishes nodes */}
            <div ref={plateRef} className="relative w-full" style={{ aspectRatio: '1000 / 620' }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                {filteredSkills.map((skill) => {
                  const a = pos(skill.id);
                  if (!a) return null;
                  return skill.connections.map((connId) => {
                    const b = pos(connId);
                    if (!b) return null;
                    const hl = activeId === skill.id || activeId === connId;
                    const mx = (a.x + b.x) / 2;
                    const my = (a.y + b.y) / 2 - 14;
                    return (
                      <g key={`${skill.id}-${connId}`}>
                        <path
                          d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
                          fill="none"
                          stroke="var(--ink-strong)"
                          strokeWidth={hl ? 1.4 : 0.7}
                          opacity={hl ? 0.85 : 0.22}
                        />
                        {hl && <circle cx={mx} cy={my} r={2.5} fill="var(--ink-strong)" opacity={0.9} />}
                      </g>
                    );
                  });
                })}
              </svg>

              <div className="absolute inset-0">
                {filteredSkills.map((skill, i) => {
                  const p = pos(skill.id);
                  if (!p) return null;
                  const isCore = skill.core;
                  const size = isCore ? 104 : 88;
                  const isHov = activeId === skill.id;
                  const neighbor = !!activeId && (skill.connections.includes(activeId) || skills.find((s) => s.id === activeId)?.connections.includes(skill.id));
                  const dim = !!activeId && !isHov && !neighbor;
                  const lines = getLines(skill.name);
                  return (
                    <div
                      key={skill.id}
                      className="node-in absolute cursor-grab active:cursor-grabbing"
                      style={{
                        left: `${(p.x / W) * 100}%`,
                        top: `${(p.y / H) * 100}%`,
                        width: size,
                        height: size,
                        marginLeft: -size / 2,
                        marginTop: -size / 2,
                        zIndex: isHov ? 20 : 10,
                        opacity: dim ? 0.25 : 1,
                        touchAction: 'none',
                        animationDelay: `${Math.min(i * 28, 600)}ms`,
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                      }}
                      onPointerDown={(e) => beginDrag(skill.id, e)}
                      onPointerMove={(e) => { if (dragRef.current?.id === skill.id) queueDrag(e.clientX, e.clientY); }}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                      onMouseEnter={() => { if (!dragRef.current) setActiveId(skill.id); }}
                      onMouseLeave={() => { if (!dragRef.current) setActiveId(null); }}
                      onClick={() => setActiveId(activeId === skill.id ? null : skill.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${skill.name}, ${matchCount(skill.id)} links${isCore ? ', daily core' : ''}. Press arrow keys to move, Enter to pin.`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveId(activeId === skill.id ? null : skill.id); }
                        else if (e.key.startsWith('Arrow')) {
                          e.preventDefault();
                          const step = e.shiftKey ? 24 : 8;
                          nudge(skill.id,
                            e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0,
                            e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0);
                          setActiveId(skill.id);
                        }
                      }}
                      onFocus={() => setActiveId(skill.id)}
                      onBlur={() => { if (!dragRef.current) setActiveId(null); }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center relative transition-transform duration-150"
                        style={{ color: dim ? 'var(--ink-faint)' : 'var(--ink-strong)', transform: isHov ? 'scale(1.1)' : 'scale(1)' }}
                      >
                        {isHov && <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--ink-strong) 20%, transparent) 0%, transparent 65%)' }} />}
                        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                          <polygon
                            points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                            fill={isHov ? 'color-mix(in srgb, var(--ink-strong) 12%, var(--ground))' : 'var(--ground-2)'}
                            stroke="currentColor"
                            strokeWidth={isCore ? 2 : 1.1}
                          />
                        </svg>
                        <div className="flex flex-col items-center justify-center z-10 px-2 text-center select-none pointer-events-none">
                          {lines.map((line, idx) => (
                            <span key={idx} className="font-mono uppercase leading-[1.15]" style={{ fontSize: isCore ? 10 : 9, fontWeight: isHov || isCore ? 700 : 400, color: dim ? 'var(--ink-faint)' : 'var(--ink-strong)' }}>
                              {line}
                            </span>
                          ))}
                          <span className="font-mono mt-0.5" style={{ fontSize: 8, color: 'var(--ink-faint)' }}>{matchCount(skill.id)} links</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute left-3 bottom-3 font-mono uppercase px-3 py-2 border rounded-[2px] backdrop-blur-md pointer-events-none" style={{ fontSize: 10, letterSpacing: '0.12em', borderColor: 'var(--rule-strong)', background: 'color-mix(in srgb, var(--ground) 88%, transparent)', color: 'var(--ink-soft)', maxWidth: '70%' }} aria-live="polite">
                {activeSkill
                  ? `${activeSkill.name} links to ${activeSkill.connections.filter((c) => filteredSkills.some((f) => f.id === c)).slice(0, 3).join(', ') || 'core set'}`
                  : `${filteredSkills.length} nodes. Hover to trace a relation. Drag to rearrange.`}
              </div>
            </div>
          </div>
          )}
        </div>

          {mounted && (
        <div className="block md:hidden w-full relative pl-4" style={{ borderLeft: '1px dashed var(--rule-strong)' }}>
          <div className="flex flex-col gap-10">
            {skillCategories.filter((c) => c.id !== 'all').map((category, index) => (
              <motion.div key={category.id} className="relative" initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.32, delay: index * 0.05 }}>
                <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: 'var(--ground)', border: '1px solid var(--ink-strong)' }} />
                <h3 className="text-base font-mono uppercase mb-3" style={{ letterSpacing: '0.1em', color: 'var(--ink-strong)' }}>{category.label}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skillsByCategory[category.id]?.map((skill) => (
                    <div key={skill.id} className="px-2.5 py-1 rounded-[2px] text-xs font-mono border" style={{ borderColor: skill.core ? 'var(--ink-strong)' : 'var(--rule)', color: skill.core ? 'var(--ink-strong)' : 'var(--ink-faint)', background: 'var(--ground-2)' }}>
                      {skill.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
          )}
      </div>
    </Section>
  );
}
