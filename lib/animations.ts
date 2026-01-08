import { Variants } from 'framer-motion';

// Framer Motion animation variants

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.6 } 
  }
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20, 
    filter: 'blur(4px)' 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export const slideInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

export const slideInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5 }
  }
};

export const pageTransition = {
  initial: { 
    opacity: 0, 
    scale: 0.98 
  },
  animate: { 
    opacity: 1, 
    scale: 1 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95 
  },
  transition: { 
    duration: 0.4, 
    ease: [0.22, 1, 0.36, 1] as any
  }
};

// Hover animations
export const hoverLift = {
  y: -2,
  transition: { duration: 0.2 }
};

export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2 }
};
