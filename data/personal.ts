// Personal information and content

export const personalInfo = {
  name: 'David Idowu',
  title: 'Full-Stack Software Engineer | Cybersecurity Science Scholar',
  location: 'Open to Remote / Hybrid',
  workStatus: ['Open to Remote', 'Open to Hybrid'],
  imageUrl: '/Hero-image.jpg',
  metrics: [
    { label: 'Shipped Codebases', value: '8' },
    { label: 'Production Commits', value: '330+' },
    { label: 'Work Status', value: 'Open to Remote / Hybrid' },
  ],
};

export const contactInfo = {
  email: 'apexheightgames.valor@gmail.com',
  phone: '07037000448',
  socials: {
    github: 'https://github.com/manofval0r',
    linkedin: 'https://www.linkedin.com/in/david-idowu',
  },
};

export const professionalSummary = [
  'Full-stack software engineer and Cybersecurity Science scholar with production experience across React/Next.js, React Native, Django, Node.js, and Supabase/PostgreSQL.',
  'Sole contributor across 8 shipped or in-progress codebases and 330+ commits since November 2025, spanning e-commerce, marketplace, fintech-adjacent, and AI-integrated products.',
  'Builds security-conscious systems by default — JWT and OAuth-based auth, Row Level Security, rate limiting, and audit-friendly financial ledgers — while using AI-assisted workflows (Claude Code, GitHub Copilot) deliberately, with full architectural ownership and manual review.',
];

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  impactHighlight?: string;
  details: string[];
}

export const experience: ExperienceItem[] = [
  {
    id: '1',
    role: 'Full Stack Software Engineer',
    company: 'LeForce / Coit Booking',
    location: 'Remote',
    startDate: '2026',
    endDate: 'Present',
    impactHighlight: 'Engineered Stripe Connect escrow & race-condition-safe PostgreSQL integer cent ledger with automated DB triggers.',
    details: [
      'Sole contributor to a monorepo spanning a React Native (Expo SDK 54) mobile app with Reanimated-driven gesture interactions and a Next.js App Router web portal for booking and admin management.',
      'Built the platform\'s financial engine: integrated Stripe Connect for escrow and payouts, and implemented a dual-wallet append-only ledger (service and affiliate balances tracked in integer cents) using Postgres triggers for auditable, race-condition-safe transactions.',
      'Designed a Supabase backend spanning 29 tables and 12 SQL migrations under strict Row Level Security, and wrote Deno Edge Functions for timezone-aware slot generation, atomic booking creation, and a tiered late-cancellation penalty system.',
    ],
  },
  {
    id: '2',
    role: 'Frontend Developer',
    company: 'Klo\'s House of Fashion',
    location: 'Remote',
    startDate: 'Aug 2025',
    endDate: 'Present',
    impactHighlight: 'Zero-build lightweight architecture with GSAP scroll-triggered animation system, eliminating bundle overhead.',
    details: [
      'Built a mobile-first e-commerce storefront in vanilla HTML5/CSS/JS with a GSAP + ScrollTrigger animation system, integrated without a build tool for a lightweight, dependency-free deployment.',
      'Executed a full design pivot to a minimalist aesthetic and resolved mobile layout and overflow issues on product detail pages, iterating directly against client feedback.',
    ],
  },
  {
    id: '3',
    role: 'Full Stack Developer',
    company: 'Sidedish Foods',
    location: 'Remote',
    startDate: 'Apr 2025',
    endDate: 'Present',
    impactHighlight: 'Hardened auth security with bcrypt 12 rounds, tiered rate limiting, and Helmet CSP across 10.5 months of active uptime.',
    details: [
      'Architected a full-stack ordering platform (Node.js/Express) with 10 REST endpoints spanning authentication, order management, and admin operations.',
      'Hardened the auth layer with JWT sessions, bcrypt password hashing at 12 salt rounds, server-side Google OAuth token verification, and tiered rate limiting (5 req/15min on auth routes, 100 req/15min platform-wide) behind a custom Helmet.js CSP.',
      'Sole contributor and maintainer across 51 commits and ~10.5 months of active development, shipping fixes and new functionality as requirements evolved.',
    ],
  },
  {
    id: '4',
    role: 'Contract Web Developer',
    company: 'Hashebi Construction',
    location: 'Remote',
    startDate: 'Jan 2026',
    endDate: 'Feb 2026',
    impactHighlight: 'Delivered end-to-end Next.js portal solo within a fixed contract window with zero runtime dependencies on Vercel.',
    details: [
      'Owned a production website end-to-end in Next.js, TypeScript, and TailwindCSS — requirements, architecture, UI build, and Vercel deployment, solo, within a fixed contract window.',
      'Managed all client communication, revision cycles, and handoff documentation independently.',
    ],
  },
  {
    id: '5',
    role: 'Hackathon Team Lead',
    company: 'Undefined Variables, NUTM',
    location: 'Lagos, Nigeria',
    startDate: '2024',
    endDate: 'Present',
    impactHighlight: 'Led student team building EMIA B2B microinsurance platform with AI chatbot and dynamic pricing engine across 2 hackathons.',
    details: [
      'Led a student engineering team building EMIA, a B2B embedded microinsurance API platform for Nigerian digital partners, including an AI chatbot and a dynamic pricing engine, across two university hackathons.',
    ],
  },
];

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  duration: string;
  description: string;
  focus: string[];
}

export const education: EducationItem[] = [
  {
    id: '1',
    degree: 'B.Sc. Cybersecurity Science (In Progress)',
    institution: 'Nigerian University of Technology and Management (NUTM)',
    location: 'Lagos, Nigeria',
    duration: '2024 – Present',
    description: 'Undergraduate scholar focusing on network security, secure application development, cryptographic foundations, and threat modeling.',
    focus: ['Network & App Security', 'Cryptographic Protocols', 'Secure System Design', 'Threat Modeling'],
  },
];

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string | null;
}

export const certifications: CertificationItem[] = [
  {
    id: '1',
    name: 'Claude Code 4: Agentic Coding for Professional Developers',
    issuer: 'Anthropic / LinkedIn Learning',
    date: '2026',
    url: 'https://www.linkedin.com/learning/certificates/',
  },
  {
    id: '2',
    name: 'AI-Powered Software Development: Coding, Testing, and System Design',
    issuer: 'LinkedIn Learning',
    date: '2026',
    url: 'https://www.linkedin.com/learning/certificates/',
  },
  {
    id: '3',
    name: 'Advanced Prompting with GitHub Copilot',
    issuer: 'LinkedIn Learning',
    date: '2026',
    url: 'https://www.linkedin.com/learning/certificates/',
  },
  {
    id: '4',
    name: 'AI Fluency for Students',
    issuer: 'Anthropic / LinkedIn Learning',
    date: '2026',
    url: 'https://www.linkedin.com/learning/certificates/',
  },
  {
    id: '5',
    name: 'Responsive Web Design (Assessed Project-Based)',
    issuer: 'freeCodeCamp',
    date: '2025',
    url: '/certificates/responsive-web-design.png',
  },
  {
    id: '6',
    name: 'Learning Git and GitHub',
    issuer: 'LinkedIn Learning',
    date: '2025',
    url: 'https://www.linkedin.com/learning/certificates/',
  },
];

export interface AchievementItem {
  id: string;
  metric: string;
  title: string;
  subtitle: string;
  impact: string;
  tag: 'Fintech' | 'Architecture' | 'Security' | 'Leadership';
}

export const achievements: AchievementItem[] = [
  {
    id: '1',
    metric: '100% Async',
    title: 'Celery + Redis 500 Timeout Elimination',
    subtitle: 'What\'s Next AI Roadmap Engine',
    impact: 'Diagnosed and resolved recursive LLM timeout crashes across 6 debugging cycles by introducing Celery & Redis background task queuing, reducing response times to instant 202 Accepted polling across ~116 API endpoints.',
    tag: 'Architecture',
  },
  {
    id: '2',
    metric: 'Zero-Drift',
    title: 'Dual-Wallet Financial Ledger Architecture',
    subtitle: 'LeForce / Coit Booking Marketplace',
    impact: 'Engineered an append-only dual-wallet ledger in PostgreSQL (integer cents) with database triggers for automated affiliate vs service balance reconciliation, preventing race conditions and double-spending on Stripe payouts.',
    tag: 'Fintech',
  },
  {
    id: '3',
    metric: '330+ Commits',
    title: 'Sole Contributor Across 8 Active Codebases',
    subtitle: 'Multi-Repo Engineering Discipline',
    impact: 'Authored 330+ commits and maintained ~1,167 tracked files as sole developer across mobile (Expo), full-stack web (Next.js/Django), and security-hardened backend systems from Nov 2025 to present.',
    tag: 'Architecture',
  },
  {
    id: '4',
    metric: '2x Hackathons',
    title: 'Hackathon Engineering Team Lead',
    subtitle: 'Undefined Variables, NUTM',
    impact: 'Led student engineering team designing EMIA embedded microinsurance platform with conversational AI chatbot and dynamic pricing engine for Nigerian digital partners.',
    tag: 'Leadership',
  },
];

export interface Resume {
  id: string;
  role: string;
  description: string;
  url: string;
  isPrimary?: boolean;
}

export const resumes: Resume[] = [
  {
    id: '1',
    role: 'Software Engineer (Primary)',
    description: 'Comprehensive software engineering — Full-stack, mobile, security & AI systems',
    url: '/resumes/SWE_David_Idowu.pdf',
    isPrimary: true,
  },
  {
    id: '2',
    role: 'Full-Stack Developer',
    description: 'Production web systems — React, Next.js, Django, Node.js, PostgreSQL',
    url: '/resumes/Full Stack Developer.pdf',
  },
  {
    id: '3',
    role: 'AI Product Engineer',
    description: 'AI roadmap synthesis, LLM integrations, prompt engineering & agentic workflows',
    url: '/resumes/AI Product Engineer.pdf',
  },
  {
    id: '4',
    role: 'Mobile Developer',
    description: 'Cross-platform mobile apps — React Native, Expo SDK 54, Reanimated, Supabase',
    url: '/resumes/Mobile Developer.pdf',
  },
  {
    id: '5',
    role: 'Web Developer',
    description: 'High-performance responsive web applications — TypeScript, Tailwind CSS, Next.js',
    url: '/resumes/Web Developer.pdf',
  },
  {
    id: '6',
    role: 'AI Developer & Rapid Prototyping',
    description: 'Modern agentic workflows, LLM orchestration, structured output validation',
    url: '/resumes/Vibe Coder and AI Developer Resume.pdf',
  },
  {
    id: '7',
    role: 'WordPress & Web Systems',
    description: 'CMS architectures, custom templates, and client business portals',
    url: '/resumes/Wordpress oriented Web Developer.pdf',
  },
];

// Bio content for "My Story" section
export const bioContent = {
  heading: 'About Me',
  paragraphs: [
    'I\'m David Idowu, a Full-Stack Software Engineer and Cybersecurity Science scholar at NUTM. I build secure, high-performance systems across React/Next.js, React Native, Django, and Node.js with database and cloud persistence in Supabase and PostgreSQL.',
    'As the sole contributor across 8 shipped or in-progress codebases and 330+ commits since November 2025, I focus on solving complex architectural challenges: designing race-condition-safe financial ledgers in integer cents, hardening REST APIs with tiered rate-limiting and RLS, and scaling asynchronous LLM pipelines with Celery and Redis.',
    'I leverage modern AI-assisted engineering workflows (Claude Code, GitHub Copilot) deliberately—maintaining complete architectural ownership, manual code review, and strict security-by-default standards across every line of code I deploy.',
  ],
};

// Why Web content
export const whyWebContent = {
  heading: 'Engineering Philosophy',
  paragraphs: [
    'Software engineering is at its best when security, performance, and user intuition converge. Building systems with intentional constraints—immutable ledgers, strict Row Level Security, and asynchronous background queues—ensures products remain reliable under scale.',
    'I thrive at the intersection of full-stack product execution and security science: taking ambitious product ideas from empty repositories to resilient, recruiter-ready production deployments.',
  ],
};

// Current activities
export const currentActivities = {
  building: {
    title: 'Koji & LeForce Platforms',
    description: 'Building mobile-first productivity and dual-sided service marketplace platforms using React Native Expo SDK 54, Supabase RLS, and Stripe Connect.',
  },
  reading: {
    title: 'Designing Data-Intensive Applications by Martin Kleppmann',
    description: 'Deepening foundations in distributed data systems, consensus algorithms, partition tolerance, and transactional ledger reliability.',
  },
  learning: {
    title: 'Cybersecurity Science & Threat Modeling',
    description: 'Advancing network defense, penetration testing methodologies, and cryptographic protocol verification at NUTM.',
  },
};
