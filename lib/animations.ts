import { Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as any;

// INK & PLATE motion: one orchestrated load, quiet states. No per-section fade-up walls.

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.42, ease: EASE },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.32, ease: EASE } },
};

// Tight staggers — 0.2s reads as generated. 0.04–0.06 reads as printed.
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

export const plotterLine: Variants = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i: number = 0) => ({
    y: '0%', opacity: 1,
    transition: { duration: 0.6, ease: EASE, delay: 0.08 + i * 0.04 },
  }),
};

export const baselineDraw: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.42, ease: EASE } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } },
};

export const pageTransition = {
  initial: { opacity: 0, scale: 0.99 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.32, ease: EASE },
};

export const hoverLift = { y: -2, transition: { duration: 0.12 } };
export const hoverScale = { scale: 1.03, transition: { duration: 0.12 } };
