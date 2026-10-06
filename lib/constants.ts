// Design system constants — INK & PLATE (monochrome, dual-world)
// Single source of truth. No raw hex outside globals.css + this mirror.

export const tokens = {
  ground: 'var(--ground)',
  ground2: 'var(--ground-2)',
  ground3: 'var(--ground-3)',
  inkStrong: 'var(--ink-strong)',
  inkBody: 'var(--ink-body)',
  inkSoft: 'var(--ink-soft)',
  inkFaint: 'var(--ink-faint)',
  rule: 'var(--rule)',
  ruleStrong: 'var(--rule-strong)',
  ruleFn: 'var(--rule-fn)',
  accent: 'var(--accent)',
  accentInk: 'var(--accent-ink)',
} as const;

// Legacy alias — do not extend. Use `tokens` for new code.
export const colors = {
  inkBlack: '#0B0B0C',
  alabaster: '#FCFCFB',
  lavender: '#8A8A90',
};

export const spacing = {
  sectionDesktop: 'clamp(4.5rem, 11vw, 11rem)',
  sectionMobile: '4.5rem',
  componentGap: '3rem',
  elementGap: '1.5rem',
  textGap: '1rem',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const typography = {
  hero: 'clamp(3.2rem, 8vw, 7rem)',
  h1: '3rem',
  h2: '2.75rem',
  h3: '1.875rem',
  bodyLarge: '1.0625rem',
  body: '0.9375rem',
  small: '0.8125rem',
  micro: '0.6875rem',
};

export const motion = {
  ease: 'cubic-bezier(.22,1,.36,1)',
  micro: 120,
  state: 220,
  enter: 420,
  orchestrated: 900,
} as const;
