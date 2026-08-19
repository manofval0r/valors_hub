// Project data types and content

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  client: string;
  date: string;
  tech: string;
  imageUrl: string;
  liveLink: string | null;
  codeLink: string | null;
  category: 'full-stack' | 'web' | 'side-project';
  techStack: string[];
  featured: boolean;
  videoUrl?: string; // Optional video demo URL
  videoPublicId?: string; // Optional Cloudinary public ID for video demo
  collaborator?: {
    name: string;
    github: string;
  };
  journey?: {
    date: string;
    phase: string;
    description: string;
  }[];
  mindMap?: {
    nodes: {
      id: string;
      type: 'hub' | 'task' | 'project';
      label: string;
      description?: string;
      date?: string;
      x: number;
      y: number;
      link?: string;
    }[];
    edges: {
      source: string;
      target: string;
      label?: string;
      animated?: boolean;
    }[];
  };
}

export const projects: Project[] = [
  {
    id: '10',
    slug: 'koji-ai-chief-of-staff',
    title: 'Koji: AI Chief of Staff',
    tagline: 'AI Assistant for Student Developers',
    description: 'A mobile-first, chat-first execution layer designed to help student developers manage coursework, self-learning, freelance projects, and job applications simultaneously. Features a daily brief synthesis, timeline management, and a read-only Gmail integration for deadline tracking.',
    client: 'Personal Startup',
    date: 'Mar 2026 - May 2026',
    tech: 'React Native, Supabase, Node.js, AI/LLMs',
    imageUrl: '/projects/placeholder.jpg',
    liveLink: null,
    codeLink: null,
    category: 'full-stack',
    techStack: ['React Native', 'Supabase', 'Node.js', 'LLMs'],
    featured: true,
    mindMap: {
      nodes: [
        // Central genesis at the heart of the web
        { id: 'k-start', type: 'hub', label: 'Project Genesis', description: 'AI Chief of Staff for student devs. Chat → Intent Extraction → Daily Brief.', date: 'Early Mar', x: 1400, y: 1100 },

        // Phase 1 — upper-left quadrant
        { id: 'k-mvp', type: 'hub', label: 'Phase 1: MVP Audit & Foundations', x: 700, y: 800 },
        { id: 'k-audit', type: 'task', label: 'Codebase Gap Audit', description: 'Conducted a peer-review style audit to identify security and UX gaps.', x: 400, y: 600 },
        { id: 'k-secrets', type: 'task', label: 'Secret Remediation', description: 'Extracted OpenRouter API keys into environment variables with startup validation.', x: 700, y: 550 },
        { id: 'k-rls', type: 'task', label: 'RLS Enforcement', description: 'Enforced strict Row-Level Security on profiles, briefings, and timeline_entries.', x: 1000, y: 600 },
        { id: 'k-rate', type: 'task', label: 'Rate Limiting', description: 'Implemented dual-tier rate limiting: 20 RPM authenticated, 5 RPM anonymous.', x: 500, y: 400 },

        // Phase 2 — upper-right quadrant
        { id: 'k-db', type: 'hub', label: 'Phase 2: DB & Domain Consolidation', x: 2100, y: 800 },
        { id: 'k-mig', type: 'task', label: 'Deterministic Migrations', description: 'Established YYYYMMDDHHMM canonical schema migrations tracked via idempotent ledger.', x: 1900, y: 550 },
        { id: 'k-chk', type: 'task', label: 'Checksum Normalization', description: 'Solved cross-platform CRLF vs LF SHA-256 hashing failures between Windows dev and Render Linux.', x: 2200, y: 550 },
        { id: 'k-rem', type: 'task', label: 'Deprecation of Reminders', description: 'Migrated all scheduled tasks into timeline_entries as the single source of truth.', x: 2450, y: 700 },
        { id: 'k-ledger', type: 'task', label: 'Migration Ledger', description: 'Built koji_schema_migrations table for tracking applied migrations with checksums.', x: 2050, y: 400 },

        // Phase 3 — center cluster
        { id: 'k-perf', type: 'hub', label: 'Phase 3: Backend Performance', x: 1400, y: 600 },
        { id: 'k-sub', type: 'task', label: 'Non-blocking Sublime', description: 'Offloaded intent extraction to async background promises, eliminating chat latency.', x: 1100, y: 350 },
        { id: 'k-gmail', type: 'task', label: 'Gmail Delta Scanning', description: 'Modified Gmail fetcher to use after: timestamp queries, massively reducing LLM token costs.', x: 1400, y: 300 },
        { id: 'k-notif', type: 'task', label: 'Notification Batching', description: 'Optimized with limit(500) batching and an in-memory isProcessing mutex lock.', x: 1700, y: 350 },
        { id: 'k-dedup', type: 'task', label: 'Deduplication Logic', description: 'Added idempotent checks so repeated chat mentions cannot spawn duplicate timeline entries.', x: 1200, y: 180 },

        // Phase 4 — lower-left quadrant
        { id: 'k-ux', type: 'hub', label: 'Phase 4: Onboarding UX Pivot', x: 500, y: 1350 },
        { id: 'k-typo', type: 'task', label: 'Macro Typography', description: 'Stripped clutter for dominant fontSize:42 typography and hanging Pencil K watermark.', x: 400, y: 1600 },
        { id: 'k-bento', type: 'task', label: 'Bento Preview Screen', description: 'Created a 3-page horizontal swipeable feature showcase: Timeline, CGPA Tracker, Smart Nudges.', x: 700, y: 1650 },
        { id: 'k-parallax', type: 'task', label: 'Z-Axis Parallax Carousel', description: 'Implemented 3D depth composition showing concrete Before/After app state transformations.', x: 400, y: 1850 },
        { id: 'k-type', type: 'task', label: 'Live Typing Simulation', description: 'Built TypingSimulation.tsx: animated typewriter chat bubble with blinking cursor and typing badge.', x: 750, y: 1880 },
        { id: 'k-bleed', type: 'task', label: 'Bleeding Edge Fix', description: 'Pivoted from 1.3x diagonal panning grid to paginated ScrollView after text bled off-screen.', x: 550, y: 2050 },

        // Phase 5 — lower-right quadrant
        { id: 'k-sdk', type: 'hub', label: 'Phase 5: Expo SDK 54 & OAuth', x: 2300, y: 1350 },
        { id: 'k-worklet', type: 'task', label: 'Worklets Alignment', description: 'Locked react-native-worklets to 0.5.1 for Reanimated v4 compatibility on SDK 54.', x: 2100, y: 1600 },
        { id: 'k-shadow', type: 'task', label: 'Shadow Modernization', description: 'Replaced all legacy shadow* props with CSS boxShadow for React 19 / RN Web compliance.', x: 2400, y: 1650 },
        { id: 'k-oauth', type: 'task', label: 'OAuth Proxy Resolution', description: 'Resolved bad_oauth_state by migrating to Expo Auth Proxy (auth.expo.io/@manofval0r/valor).', x: 2200, y: 1850 },
        { id: 'k-regex', type: 'task', label: 'Token Extraction Regex', description: 'Built dual-extraction regex to capture tokens from both URL fragments (#) and query strings (?).', x: 2500, y: 1880 },
        { id: 'k-notifmod', type: 'task', label: 'Notification API Modernization', description: 'Replaced deprecated removeNotificationSubscription with modern sub.remove() pattern.', x: 2350, y: 2050 },

        // Cross-project constellation points — far edges
        { id: 'p-budgetfit', type: 'project', label: 'BudgetFit', description: 'Desktop Financial Tracker sharing Security and DB hardening concepts.', x: 2700, y: 400, link: 'budgetfit' },
        { id: 'p-whatsnext', type: 'project', label: "What's Next", description: 'Tech career guide utilizing similar LLM prompt engineering flows.', x: 500, y: 100, link: 'whats-next' },
      ],
      edges: [
        // Genesis branches
        { source: 'k-start', target: 'k-mvp' },
        { source: 'k-start', target: 'k-db' },
        { source: 'k-start', target: 'k-ux' },
        { source: 'k-start', target: 'k-sdk' },
        // Phase 1
        { source: 'k-mvp', target: 'k-audit' },
        { source: 'k-mvp', target: 'k-secrets' },
        { source: 'k-mvp', target: 'k-rls' },
        { source: 'k-mvp', target: 'k-rate' },
        { source: 'k-mvp', target: 'k-perf' },
        // Phase 2
        { source: 'k-db', target: 'k-mig' },
        { source: 'k-db', target: 'k-chk' },
        { source: 'k-db', target: 'k-rem' },
        { source: 'k-db', target: 'k-ledger' },
        { source: 'k-db', target: 'k-perf' },
        // Phase 3
        { source: 'k-perf', target: 'k-sub' },
        { source: 'k-perf', target: 'k-gmail' },
        { source: 'k-perf', target: 'k-notif' },
        { source: 'k-perf', target: 'k-dedup' },
        { source: 'k-sub', target: 'k-dedup' },
        // Phase 4
        { source: 'k-ux', target: 'k-typo' },
        { source: 'k-ux', target: 'k-bento' },
        { source: 'k-ux', target: 'k-parallax' },
        { source: 'k-ux', target: 'k-type' },
        { source: 'k-bento', target: 'k-bleed' },
        { source: 'k-parallax', target: 'k-bleed' },
        // Phase 5
        { source: 'k-sdk', target: 'k-worklet' },
        { source: 'k-sdk', target: 'k-shadow' },
        { source: 'k-sdk', target: 'k-oauth' },
        { source: 'k-oauth', target: 'k-regex' },
        { source: 'k-sdk', target: 'k-notifmod' },
        // Cross-project connections
        { source: 'k-rls', target: 'p-budgetfit', label: 'DB Hardening', animated: true },
        { source: 'k-sub', target: 'p-whatsnext', label: 'LLM Routing', animated: true },
        { source: 'k-chk', target: 'p-budgetfit', label: 'Deploy Pipeline', animated: true }
      ]
    }
  },
  {
    id: '11',
    slug: 'amber',
    title: 'Amber',
    tagline: 'Real-time Paramedic Dispatch & Fleet Mapping Platform',
    description: 'A full-stack internal operations platform for emergency medical services. Features real-time paramedic dispatch, live fleet tracking via Mapbox GL, hospital network management, client and partner portals, and a Supabase-backed authentication and data layer. Built as a PWA for offline resilience.',
    client: 'Internal / Confidential',
    date: 'Apr 2026',
    tech: 'Next.js, TypeScript, Mapbox GL, Supabase, Framer Motion, Recharts',
    imageUrl: '/projects/amber.png',
    liveLink: null,
    codeLink: null,
    category: 'full-stack',
    techStack: ['Next.js', 'TypeScript', 'Mapbox GL', 'Supabase', 'Recharts', 'Framer Motion'],
    featured: true,
    mindMap: {
      nodes: [
        { id: 'a-start', type: 'hub', label: 'Amber Platform', description: 'Real-time EMS dispatch & fleet tracking PWA for emergency medical services.', x: 1000, y: 900 },
        { id: 'a-auth', type: 'task', label: 'Supabase Auth & RLS', description: 'Role-based auth for paramedics, dispatchers, hospital staff, and partners.', x: 650, y: 600 },
        { id: 'a-map', type: 'task', label: 'Mapbox GL Live Tracking', description: 'Real-time fleet map with animated paramedic pins and hospital overlays.', x: 1350, y: 600 },
        { id: 'a-dispatch', type: 'task', label: 'Dispatch Dashboard', description: 'Central control for assigning cases and monitoring active units.', x: 1000, y: 400 },
        { id: 'a-portal', type: 'task', label: 'Multi-Portal Architecture', description: 'Separate client, partner, hospital, and paramedic views from one codebase.', x: 700, y: 350 },
        { id: 'a-pwa', type: 'task', label: 'PWA Offline Resilience', description: 'Service worker caching via @ducanh2912/next-pwa for field-ready offline use.', x: 1300, y: 350 },
        { id: 'a-charts', type: 'task', label: 'Recharts Analytics', description: 'Fleet performance dashboards and response-time trend visualizations.', x: 1000, y: 200 },
        { id: 'p-budgetfit', type: 'project', label: 'BudgetFit', description: 'Shares Supabase-backed data architecture and dashboard design patterns.', x: 1500, y: 150, link: 'budgetfit' }
      ],
      edges: [
        { source: 'a-start', target: 'a-auth' },
        { source: 'a-start', target: 'a-map' },
        { source: 'a-auth', target: 'a-dispatch' },
        { source: 'a-map', target: 'a-dispatch' },
        { source: 'a-auth', target: 'a-portal' },
        { source: 'a-map', target: 'a-pwa' },
        { source: 'a-dispatch', target: 'a-charts' },
        { source: 'a-portal', target: 'a-charts' },
        { source: 'a-pwa', target: 'a-charts' },
        { source: 'a-charts', target: 'p-budgetfit', label: 'Dashboard Patterns', animated: true }
      ]
    }
  },
  {
    id: '12',
    slug: 'budgetfit',
    title: 'BudgetFit',
    tagline: 'Modern Desktop Financial Tracker',
    description: 'A comprehensive JavaFX desktop application for personal finance management. Features a highly usable three-column sheet layout, real-time data visualization with Pie Charts, and advanced financial insights including historical trend analysis.',
    client: 'Personal Project',
    date: 'May 2026',
    tech: 'Java, JavaFX, SQL, Maven',
    imageUrl: '/projects/budgetfit.png',
    liveLink: null,
    codeLink: null,
    category: 'full-stack',
    techStack: ['Java', 'JavaFX', 'SQL', 'Maven'],
    featured: true,
    mindMap: {
      nodes: [
        { id: 'b-start', type: 'hub', label: 'BudgetFit Core', description: 'Comprehensive JavaFX desktop tracker for personal finance.', x: 1200, y: 1200 },

        { id: 'b-ux', type: 'hub', label: 'UI/UX Transition', x: 600, y: 900 },
        { id: 'b-glass', type: 'task', label: 'Warm Minimalism', description: 'Adopted glassmorphism aesthetic with frosted glass panels and subtle depth.', x: 350, y: 650 },
        { id: 'b-bento', type: 'task', label: 'Summary Bento Box', description: 'Implemented dynamic multi-card dashboard with real-time financial metrics.', x: 650, y: 600 },
        { id: 'b-sheet', type: 'task', label: 'Three-Column Sheet Layout', description: 'Restructured dashboard into spreadsheet-style inline-editing columns.', x: 400, y: 450 },
        { id: 'b-dark', type: 'task', label: 'Dark Mode', description: 'Implemented full dark mode theme toggle with CSS variable switching.', x: 700, y: 400 },

        { id: 'b-arch', type: 'hub', label: 'Architectural Overhaul', x: 1800, y: 900 },
        { id: 'b-dao', type: 'task', label: 'DAO-Based Architecture', description: 'Refactored all data access into isolated DAO layer with prepared statements.', x: 1600, y: 650 },
        { id: 'b-sec', type: 'task', label: 'Security Remediation', description: 'End-to-end audit patching SQL injection vulnerabilities.', x: 1900, y: 600 },
        { id: 'b-valid', type: 'task', label: 'Input Validation', description: 'Added comprehensive input guards and data deletion confirmations.', x: 2100, y: 700 },
        { id: 'b-csv', type: 'task', label: 'CSV Export', description: 'Implemented one-click CSV export for all transaction data.', x: 2000, y: 450 },

        { id: 'b-feat', type: 'hub', label: 'Data Visualization', x: 1200, y: 550 },
        { id: 'b-trend', type: 'task', label: 'Multi-chart Trends', description: 'Added Net Balance line charts and Category Breakdown pie visualizations.', x: 900, y: 300 },
        { id: 'b-sync', type: 'task', label: 'Real-time Sync', description: 'Bound all UI directly to observable JavaFX Property models for instant reactivity.', x: 1200, y: 250 },
        { id: 'b-recur', type: 'task', label: 'Recurring Transactions', description: 'Automated recurring income/expense workflows with new DB schema.', x: 1500, y: 300 },
        { id: 'b-jar', type: 'task', label: 'Fat JAR Packaging', description: 'Configured Maven for portable single-file deployment via maven-shade-plugin.', x: 1100, y: 100 },

        { id: 'p-amber', type: 'project', label: 'Amber', description: 'Internal precursor establishing JavaFX baseline and UI patterns.', x: 400, y: 200, link: 'amber' },
        { id: 'p-koji', type: 'project', label: 'Koji', description: 'Shares rigorous DB security and audit-driven architecture.', x: 2200, y: 200, link: 'koji-ai-chief-of-staff' }
      ],
      edges: [
        { source: 'b-start', target: 'b-ux' },
        { source: 'b-start', target: 'b-arch' },
        { source: 'b-ux', target: 'b-glass' },
        { source: 'b-ux', target: 'b-bento' },
        { source: 'b-ux', target: 'b-sheet' },
        { source: 'b-ux', target: 'b-dark' },
        { source: 'b-arch', target: 'b-dao' },
        { source: 'b-arch', target: 'b-sec' },
        { source: 'b-arch', target: 'b-valid' },
        { source: 'b-arch', target: 'b-csv' },
        { source: 'b-ux', target: 'b-feat' },
        { source: 'b-arch', target: 'b-feat' },
        { source: 'b-feat', target: 'b-trend' },
        { source: 'b-feat', target: 'b-sync' },
        { source: 'b-feat', target: 'b-recur' },
        { source: 'b-feat', target: 'b-jar' },
        { source: 'b-glass', target: 'p-amber', label: 'Aesthetics', animated: true },
        { source: 'b-sec', target: 'p-koji', label: 'DB Auditing', animated: true }
      ]
    }
  },

  {
    id: '1',
    slug: 'restaurant-website',
    title: 'Restaurant Website',
    tagline: 'Complete e-commerce solution for food ordering',
    description: 'An end-to-end web solution for a restaurant, featuring a customer-facing menu, dynamic cart functionality, and an automated checkout process.',
    client: 'Sidedish Foods',
    date: '2025',
    tech: 'HTML, CSS, Java, Node.js',
    imageUrl: '/projects/restaurant.jpg',
    liveLink: 'https://sidedishfoodsweb.vercel.app',
    codeLink: 'https://github.com/manofval0r/webstt',
    category: 'full-stack',
    techStack: ['HTML', 'CSS', 'Node.js'],
    featured: true,
    videoUrl: 'https://res.cloudinary.com/dv4vlphsy/video/upload/v1/restaurant_qmacok.mp4',
    videoPublicId: 'restaurant_qmacok',
    journey: [
      { date: 'Apr 2025', phase: 'MVP & Design', description: 'Initial e-commerce prototype and UI conceptualization.' },
      { date: 'Dec 2025', phase: 'Backend Integration', description: 'Integrated Node.js cart and checkout flows.' },
      { date: 'Feb 2026', phase: 'Launch & Polish', description: 'Finalized user-facing menu and automated checkout process.' }
    ],
    mindMap: {
      nodes: [
        { id: 'sd-start', type: 'hub', label: 'Sidedish Foods Architecture', description: 'Responsive e-commerce platform with Node.js backend.', x: 1000, y: 900 },
        { id: 'sd-front', type: 'task', label: 'Static Frontend Foundation', description: 'Core pages and initial CSS layouts.', x: 600, y: 650 },
        { id: 'sd-cart', type: 'task', label: 'Client-Side Cart Logic', description: 'Vanilla JS shopping cart utilizing localStorage state persistence.', x: 1400, y: 650 },
        { id: 'sd-back', type: 'task', label: 'Node.js Backend Integration', description: 'Express.js server with .env secrets for API routing.', x: 1000, y: 450 },
        { id: 'sd-auth', type: 'task', label: 'Google Auth & Mobile Polish', description: 'Modern OAuth 2.0 flow and responsive UI fixes.', x: 1000, y: 200 }
      ],
      edges: [
        { source: 'sd-start', target: 'sd-front' },
        { source: 'sd-start', target: 'sd-cart' },
        { source: 'sd-front', target: 'sd-back' },
        { source: 'sd-cart', target: 'sd-back' },
        { source: 'sd-back', target: 'sd-auth' }
      ]
    }
  },
  {
    id: '2',
    slug: 'whats-next',
    title: 'What\'s Next',
    tagline: 'Tech Career Guide',
    description: 'A web application that helps users learn whats needed in their tech career, and give info along the way.',
    client: '5VE',
    date: '2025',
    tech: 'React, Vite, Django, Node.js',
    imageUrl: '/projects/whats-next.jpg',
    videoUrl: 'https://res.cloudinary.com/dv4vlphsy/video/upload/v1/whats-next_us6wkj.mp4',
    liveLink: 'https://whats-next-ate2.onrender.com',
    codeLink: 'https://github.com/manofval0r/WHATS-NEXT',
    category: 'web',
    techStack: ['React', 'Vite', 'Django', 'Node.js'],
    featured: true,
    videoPublicId: 'whats-next_us6wkj',
    journey: [
      { date: 'Nov 2025', phase: 'Concept & Architecture', description: 'Designed architecture spanning React frontend and Django backend.' },
      { date: 'Jan 2026', phase: 'Core Features', description: 'Developed career guidance algorithms and interactive UI components.' },
      { date: 'Feb 2026', phase: 'Beta Release', description: 'Polished user interface and launched MVP for initial user testing.' }
    ],
    mindMap: {
      nodes: [
        { id: 'wn-start', type: 'hub', label: 'What\'s Next Architecture', description: 'AI-powered career roadmap generation and continuous learning platform ("Infinite Dev Loop"). Built with Django REST Framework and React 19.', x: 1000, y: 950 },
        { id: 'wn-p1', type: 'hub', label: 'Phase 1: Foundation', description: 'Configured Django REST Framework with SimpleJWT auth and built OAuth onboarding flow (niche -> target_career mapping).', x: 600, y: 800 },
        { id: 'wn-jwt', type: 'task', label: 'SimpleJWT & AllAuth', description: 'Secure token-based authentication and user model refactoring for clean data handoffs to the AI engine.', x: 400, y: 650 },
        { id: 'wn-p2', type: 'hub', label: 'Phase 2: AI & Graph UI', description: 'Integrated Google Generative AI for roadmap synthesis and XYFlow/ReactFlow + Dagre for node-based UI.', x: 1400, y: 800 },
        { id: 'wn-xyflow', type: 'task', label: 'XYFlow & Dagre Layout', description: 'Automated hierarchical layout calculation for complex prerequisite relationships with dynamic loading UIs.', x: 1600, y: 650 },
        { id: 'wn-p3', type: 'hub', label: 'Phase 3: Async & JADA', description: 'Decoupled LLM generation using Celery & Redis to resolve 500 timeout errors, and introduced JADA AI assistant.', x: 1000, y: 650 },
        { id: 'wn-celery', type: 'task', label: 'Celery & Redis Workers', description: 'Offloaded heavy roadmap generation and RSS fetching to background workers, returning 202 Accepted status instantly.', x: 800, y: 500 },
        { id: 'wn-jada', type: 'task', label: 'JADA AI Assistant', description: 'Persistent conversational assistant with lesson tracking, quizzing, and specific learning resource recommendations.', x: 1200, y: 500 },
        { id: 'wn-p4', type: 'hub', label: 'Phase 4: Mobile & Q&A', description: 'Engineered dedicated mobile presentation layer and Pillow-backed community Q&A forum.', x: 600, y: 350 },
        { id: 'wn-mobile', type: 'task', label: 'Mobile Roadmap Component', description: 'Replaced 2D canvas with vertical expandable tree layout using useMediaQuery to prevent touch-trapping.', x: 400, y: 200 },
        { id: 'wn-community', type: 'task', label: 'Community Forum & Pillow', description: 'Discussion forum supporting secure image uploads for user questions and project showcases.', x: 800, y: 200 },
        { id: 'wn-p5', type: 'hub', label: 'Phase 5: Production Hardening', description: 'Standardized Render deployment architecture using Gunicorn, dj-database-url, Whitenoise, and PostHog analytics.', x: 1400, y: 350 },
        { id: 'wn-render', type: 'task', label: 'Procfile & Automated Build', description: 'Automated database migrations and React frontend bundling during Render build phase with Whitenoise static serving.', x: 1400, y: 200 }
      ],
      edges: [
        { source: 'wn-start', target: 'wn-p1' },
        { source: 'wn-start', target: 'wn-p2' },
        { source: 'wn-p1', target: 'wn-jwt' },
        { source: 'wn-p2', target: 'wn-xyflow' },
        { source: 'wn-p1', target: 'wn-p3' },
        { source: 'wn-p2', target: 'wn-p3' },
        { source: 'wn-p3', target: 'wn-celery' },
        { source: 'wn-p3', target: 'wn-jada' },
        { source: 'wn-p3', target: 'wn-p4' },
        { source: 'wn-p3', target: 'wn-p5' },
        { source: 'wn-p4', target: 'wn-mobile' },
        { source: 'wn-p4', target: 'wn-community' },
        { source: 'wn-p5', target: 'wn-render' }
      ]
    }
  },
  {
    id: '3',
    slug: 'the-junxtion-platform',
    title: 'The Junxtion Platform',
    tagline: 'Educational platform for university students',
    description: 'Creating an educational platform for my university\'s students.',
    client: 'Personal Project',
    date: '2025 - Present',
    tech: 'Next.js, TypeScript, JavaScript, Java',
    imageUrl: '/projects/junxtion.jpg',
    liveLink: null,
    codeLink: null,
    category: 'full-stack',
    techStack: ['Next.js', 'TypeScript', 'JavaScript'],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'jx-start', type: 'hub', label: 'The Junxtion Architecture', description: 'Next.js & Java ecosystem for university students.', x: 1000, y: 900 },
        { id: 'jx-plan', type: 'task', label: 'Platform Specification', description: 'Defined core requirements for student collaboration and resources.', x: 600, y: 650 },
        { id: 'jx-front', type: 'task', label: 'Next.js Client Layer', description: 'Responsive student portal built with TypeScript.', x: 1400, y: 650 },
        { id: 'jx-back', type: 'task', label: 'Java Microservices', description: 'Robust backend handling user authentication and data processing.', x: 1000, y: 450 }
      ],
      edges: [
        { source: 'jx-start', target: 'jx-plan' },
        { source: 'jx-start', target: 'jx-front' },
        { source: 'jx-plan', target: 'jx-back' },
        { source: 'jx-front', target: 'jx-back' }
      ]
    }
  },
  {
    id: '4',
    slug: 'midwife-tracking-payroll-system',
    title: 'Midwife Tracking & Payroll System',
    tagline: 'Automated performance-based payroll for healthcare workers',
    description: 'Developed an automated system to solve a real-world data management problem, replacing a strenuous manual ledger process for midwives. The solution ensures accurate, performance-based pay calculations.',
    client: 'Client-Focused Project',
    date: 'Ongoing',
    tech: 'Google Apps Script, Google Sheets, JavaScript, HTML',
    imageUrl: '/projects/midwife.png',
    liveLink: 'https://script.google.com/macros/s/AKfycbz7BLj481tg4TeJ66u6RTobd5x8eb4kJz6CUyaAhquuZdx2zLfZ3id_xOzseqqzJ_Dw/exec',
    codeLink: 'https://github.com/manofval0r/Midwife-tracker-DT',
    category: 'full-stack',
    techStack: ['JavaScript', 'Google Apps Script', 'HTML'],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'mw-start', type: 'hub', label: 'Midwife Payroll Automation', description: 'Google Apps Script & Sheets integration.', x: 1000, y: 900 },
        { id: 'mw-manual', type: 'task', label: 'Manual Ledger Audit', description: 'Analyzed strenuous manual ledger process for midwives.', x: 600, y: 650 },
        { id: 'mw-calc', type: 'task', label: 'Calculation Engine', description: 'Automated performance-based pay calculations in JavaScript.', x: 1400, y: 650 },
        { id: 'mw-ui', type: 'task', label: 'WebApp Interface', description: 'HTML/JS frontend deployed as a Google Web App.', x: 1000, y: 450 }
      ],
      edges: [
        { source: 'mw-start', target: 'mw-manual' },
        { source: 'mw-start', target: 'mw-calc' },
        { source: 'mw-manual', target: 'mw-ui' },
        { source: 'mw-calc', target: 'mw-ui' }
      ]
    }
  },
  {
    id: '5',
    slug: 'solar-market-trend-analyzer',
    title: 'Solar Market Trend Analyzer',
    tagline: 'Real-time market analysis for renewable energy products',
    description: 'A comprehensive web app for analyzing solar, inverter, and battery market trends using real-time data scraping and partly free to use, open-source API integrations.',
    client: 'Confidential',
    date: 'Ongoing',
    tech: 'Node.js, Express.js, REST APIs, Web Scraping, HTML, CSS',
    imageUrl: '/projects/placeholder.jpg',
    liveLink: 'https://pes-analyser.vercel.app',
    codeLink: 'https://github.com/Anikin-kings/PES-analyzer',
    category: 'full-stack',
    techStack: ['Node.js', 'Express.js', 'HTML', 'CSS'],
    featured: false,
    collaborator: {
      name: 'Anikin Kings',
      github: 'https://github.com/Anikin-kings'
    },
    mindMap: {
      nodes: [
        { id: 'sm-start', type: 'hub', label: 'Solar Market Analyzer', description: 'Real-time data scraping & REST APIs.', x: 1000, y: 900 },
        { id: 'sm-scrape', type: 'task', label: 'Web Scraping Engine', description: 'Real-time market data extraction for solar, inverter, and battery products.', x: 600, y: 650 },
        { id: 'sm-api', type: 'task', label: 'API Integration', description: 'Aggregating third-party pricing and trend metrics.', x: 1400, y: 650 },
        { id: 'sm-express', type: 'task', label: 'Express.js Aggregator', description: 'Node backend serving cleaned data to the frontend.', x: 1000, y: 450 }
      ],
      edges: [
        { source: 'sm-start', target: 'sm-scrape' },
        { source: 'sm-start', target: 'sm-api' },
        { source: 'sm-scrape', target: 'sm-express' },
        { source: 'sm-api', target: 'sm-express' }
      ]
    }
  },
  {
    id: '6',
    slug: 'klos-house-prototype',
    title: 'Klo\'s House Prototype',
    tagline: 'Fashion house digital presence',
    description: 'Prototype for a fashion house.',
    client: 'Klo\'s House of Fashion',
    date: '2025 - 06.2025',
    tech: 'HTML, CSS, JavaScript, GSAP',
    imageUrl: '/projects/kloshouse.png',
    videoUrl: 'https://res.cloudinary.com/dv4vlphsy/video/upload/v1/kloshouse_oemuug.mp4',
    liveLink: 'https://kloshouse.vercel.app',
    codeLink: 'https://github.com/manofval0r/kloshouse',
    category: 'web',
    techStack: ['HTML', 'CSS', 'JavaScript', 'GSAP'],
    featured: true,
    videoPublicId: 'kloshouse_oemuug',
    mindMap: {
      nodes: [
        { id: 'kh-start', type: 'hub', label: 'Klo\'s Architecture', description: 'Premium static e-commerce storefront landing page.', x: 1000, y: 900 },
        { id: 'kh-struct', type: 'task', label: 'Structure & Styling', description: 'Modular HTML/CSS with premium Google Fonts.', x: 600, y: 650 },
        { id: 'kh-gsap', type: 'task', label: 'GSAP Animations', description: 'Fluid scroll-triggered animations via GreenSock CDN.', x: 1400, y: 650 },
        { id: 'kh-min', type: 'task', label: 'Minimalist Redesign', description: 'Stripped away borders, maximizing whitespace.', x: 1000, y: 450 },
        { id: 'kh-mob', type: 'task', label: 'Mobile Optimization', description: 'Refactored product detail section for single-column mobile view.', x: 1000, y: 200 }
      ],
      edges: [
        { source: 'kh-start', target: 'kh-struct' },
        { source: 'kh-start', target: 'kh-gsap' },
        { source: 'kh-struct', target: 'kh-min' },
        { source: 'kh-gsap', target: 'kh-min' },
        { source: 'kh-min', target: 'kh-mob' }
      ]
    }
  },
  {
    id: '7',
    slug: 'client-portfolio-websites',
    title: 'Client Portfolio Websites',
    tagline: 'Custom portfolio solutions',
    description: 'I made portfolio websites for a few personnels, but they remain confidential.',
    client: 'Confidential',
    date: '2025',
    tech: 'Details confidential.',
    imageUrl: '/projects/placeholder.jpg',
    liveLink: null,
    codeLink: null,
    category: 'web',
    techStack: [],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'cp-start', type: 'hub', label: 'Custom Client Portfolios', description: 'Bespoke web solutions for confidential clients.', x: 1000, y: 900 },
        { id: 'cp-req', type: 'task', label: 'Client Discovery', description: 'Gathering personal branding and professional milestone requirements.', x: 600, y: 650 },
        { id: 'cp-design', type: 'task', label: 'Tailored UI/UX', description: 'Crafting custom layouts optimized for high conversion and aesthetics.', x: 1400, y: 650 },
        { id: 'cp-deploy', type: 'task', label: 'Secure Deployment', description: 'Optimized hosting setup with custom domain configuration.', x: 1000, y: 450 }
      ],
      edges: [
        { source: 'cp-start', target: 'cp-req' },
        { source: 'cp-start', target: 'cp-design' },
        { source: 'cp-req', target: 'cp-deploy' },
        { source: 'cp-design', target: 'cp-deploy' }
      ]
    }
  },
  {
    id: '8',
    slug: 'company-projects',
    title: 'VoicePatches Consulting Company Website',
    tagline: 'Corporate website for a consulting firm',
    description: 'A corporate website for VoicePatches Consulting, showcasing their services, team, and contact information.',
    client: 'VoicePatches Consulting',
    date: '2026',
    tech: 'HTML, CSS, Vanilla JavaScript, NPM',
    imageUrl: '/projects/voicepatches.png',
    liveLink: 'http://voicepatches.vercel.app/',
    codeLink: 'https://github.com/manofval0r/voicepatches',
    category: 'web',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    featured: true,
    mindMap: {
      nodes: [
        { id: 'vp-start', type: 'hub', label: 'VoicePatches Platform', description: 'Professional consulting web presence.', x: 1000, y: 900 },
        { id: 'vp-ui', type: 'task', label: 'Semantic HTML/CSS', description: 'Accessible, responsive layout showcasing corporate services.', x: 600, y: 650 },
        { id: 'vp-js', type: 'task', label: 'Vanilla JS Interactivity', description: 'Lightweight client-side interactions and dynamic navigation.', x: 1400, y: 650 },
        { id: 'vp-opt', type: 'task', label: 'NPM Asset Bundling', description: 'Optimized build pipeline for lightning-fast page load times.', x: 1000, y: 450 }
      ],
      edges: [
        { source: 'vp-start', target: 'vp-ui' },
        { source: 'vp-start', target: 'vp-js' },
        { source: 'vp-ui', target: 'vp-opt' },
        { source: 'vp-js', target: 'vp-opt' }
      ]
    }
  },
  {
    id: '9',
    slug: 'hashebi-global-services',
    title: 'Hashebi Global Services Website',
    tagline: 'Corporate website for a construction & civil engineering firm',
    description: 'A corporate website for Hashebi Global Services Nigeria Ltd, a construction and civil engineering firm founded in 2007. The site showcases their services — building construction, civil engineering, project management, and consultancy — alongside a filterable project portfolio, company history, and a validated contact form with Web3Forms integration.',
    client: 'Hashebi Global Services Nigeria Ltd',
    date: '2026',
    tech: 'Next.js, TypeScript, Tailwind CSS, Framer Motion, Swiper.js',
    imageUrl: '/projects/hashebi.png',
    liveLink: "https://hashebiglobal.com/",
    codeLink: "",
    category: 'web',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Swiper.js', 'React Hook Form', 'Zod'],
    featured: true,
    mindMap: {
      nodes: [
        { id: 'hb-start', type: 'hub', label: 'Hashebi Global Architecture', description: 'Next.js & Framer Motion corporate showcase.', x: 1000, y: 900 },
        { id: 'hb-showcase', type: 'task', label: 'Swiper.js Portfolio Reel', description: 'Dynamic, filterable project portfolio for civil engineering works.', x: 600, y: 650 },
        { id: 'hb-motion', type: 'task', label: 'Framer Motion Choreography', description: 'Smooth scroll animations and premium page transitions.', x: 1400, y: 650 },
        { id: 'hb-form', type: 'task', label: 'Web3Forms Integration', description: 'Validated contact form powered by React Hook Form and Zod.', x: 1000, y: 450 }
      ],
      edges: [
        { source: 'hb-start', target: 'hb-showcase' },
        { source: 'hb-start', target: 'hb-motion' },
        { source: 'hb-showcase', target: 'hb-form' },
        { source: 'hb-motion', target: 'hb-form' }
      ]
    }
  },
  {
    id: '13',
    slug: 'ap-calculus-bc-platform',
    title: 'AP Calculus BC Platform',
    tagline: 'Online course platform for college-level mathematics',
    description: 'A full-featured online learning platform for AP Calculus BC, built for homeschoolers and private/public school students. Includes a student portal with login, assignment tracking, syllabus, AP score reporting, course documents, student reviews, and a Stripe-integrated enrollment flow. College Board Audit-approved curriculum.',
    client: 'Calculuse Learning Center (Mrs. Gilleran)',
    date: '2026',
    tech: 'HTML, CSS, JavaScript, Google Apps Script, Stripe',
    imageUrl: '/projects/apcalc.png',
    liveLink: null,
    codeLink: null,
    category: 'web',
    techStack: ['HTML', 'CSS', 'JavaScript', 'Google Apps Script', 'Stripe'],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'ap-start', type: 'hub', label: 'AP Calc Modernization', description: 'Injecting Stripe and Google Forms into a legacy Dreamweaver site.', x: 1000, y: 900 },
        { id: 'ap-audit', type: 'task', label: 'Legacy Codebase Audit', description: 'Mapped Dreamweaver artifacts and isolated enroll.html for integration.', x: 600, y: 650 },
        { id: 'ap-stripe', type: 'task', label: 'Stripe Payment Integration', description: 'Client-side Stripe Checkout script injected into static pages.', x: 1400, y: 650 },
        { id: 'ap-gforms', type: 'task', label: 'Registration Automation', description: 'Embedded Google Forms backed by Apps Script for automated emails.', x: 1000, y: 450 },
        { id: 'ap-handoff', type: 'task', label: 'End-to-End Funnel', description: 'Linear client-side funnel: Enroll -> Stripe -> Confirmation -> Google Form.', x: 1000, y: 200 }
      ],
      edges: [
        { source: 'ap-start', target: 'ap-audit' },
        { source: 'ap-start', target: 'ap-stripe' },
        { source: 'ap-audit', target: 'ap-gforms' },
        { source: 'ap-stripe', target: 'ap-gforms' },
        { source: 'ap-gforms', target: 'ap-handoff' }
      ]
    }
  },
  {
    id: '14',
    slug: 'recengine',
    title: 'recEngine (heygent)',
    tagline: 'LangGraph-based recommendation agent',
    description: 'A highly contextual recommendation engine designed for the BCT Hackathon. Solves the cold-start problem using LangGraph state machines, multi-stage persona building, intent classification, and semantic vector retrieval with a culturally resonant Nigerian English tone.',
    client: 'BCT Hackathon',
    date: '2026',
    tech: 'Python, FastAPI, LangGraph, LLM, Vector Store',
    imageUrl: '/projects/placeholder.jpg',
    liveLink: null,
    codeLink: null,
    category: 'full-stack',
    techStack: ['Python', 'FastAPI', 'LangGraph', 'Vector DB'],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'rc-start', type: 'hub', label: 'recEngine Architecture', description: 'LangGraph-based ReAct agent pipeline.', x: 1000, y: 900 },
        { id: 'rc-intent', type: 'task', label: 'Intent Classification', description: 'Determine user needs and route to appropriate sub-graph.', x: 600, y: 650 },
        { id: 'rc-persona', type: 'task', label: 'Persona Building', description: 'Dynamic conversational sub-graph to seed cold-start users.', x: 300, y: 400 },
        { id: 'rc-retrieval', type: 'task', label: 'Semantic Retrieval', description: 'Vector store querying based on intent and persona.', x: 1400, y: 650 },
        { id: 'rc-rerank', type: 'task', label: 'Re-ranking Engine', description: 'Optimize candidates for NDCG@10 metric.', x: 1400, y: 350 },
        { id: 'rc-llm', type: 'task', label: 'LLM Generation', description: 'Synthesize data into localized Nigerian English response.', x: 1000, y: 200 }
      ],
      edges: [
        { source: 'rc-start', target: 'rc-intent' },
        { source: 'rc-intent', target: 'rc-persona', label: 'Cold Start' },
        { source: 'rc-intent', target: 'rc-retrieval', label: 'Warm Start' },
        { source: 'rc-persona', target: 'rc-retrieval' },
        { source: 'rc-retrieval', target: 'rc-rerank' },
        { source: 'rc-rerank', target: 'rc-llm' }
      ]
    }
  },
  {
    id: '15',
    slug: 'davidowu-portfolio',
    title: 'My Portfolio',
    tagline: 'Cinematic scroll-reel engineering showcase',
    description: 'A high-fidelity personal portfolio built with Next.js and Framer Motion. Features a scroll-hijacked cinematic project reel, glassmorphism UI, Cloudinary media CDN optimization, and a custom Interactive Workflow Constellation to map project architectures.',
    client: 'Personal Project',
    date: '2026',
    tech: 'Next.js, Tailwind CSS, Framer Motion',
    imageUrl: '/projects/placeholder.jpg',
    liveLink: 'https://davidowu.com',
    codeLink: 'https://github.com/manofval0r/davidowu',
    category: 'web',
    techStack: ['Next.js', 'Framer Motion', 'Tailwind CSS', 'Cloudinary'],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'do-start', type: 'hub', label: 'Portfolio Architecture', description: 'Next.js App Router with heavy Framer Motion integration.', x: 1000, y: 900 },
        { id: 'do-cdn', type: 'task', label: 'Cloudinary Media CDN', description: 'Migrated from local Git LFS blobs to external video hosting for faster FCP.', x: 600, y: 650 },
        { id: 'do-reel', type: 'task', label: 'Cinematic Scroll Reel', description: 'Scroll-hijacked horizontal reel using useScroll and useTransform.', x: 1400, y: 650 },
        { id: 'do-blueprint', type: 'task', label: 'Interactive Blueprint', description: 'Custom canvas constellation for mapping complex project architectures.', x: 1400, y: 350 },
        { id: 'do-responsive', type: 'task', label: 'Responsive Glassmorphism', description: 'Strict mobile breakpoints unmounting heavy desktop components.', x: 600, y: 350 },
        { id: 'p-koji', type: 'project', label: 'Koji', description: 'Integrated into blueprint case study showcase.', x: 1000, y: 150, link: 'koji-ai-chief-of-staff' },
        { id: 'p-budgetfit', type: 'project', label: 'BudgetFit', description: 'Integrated into blueprint case study showcase.', x: 1400, y: 150, link: 'budgetfit' }
      ],
      edges: [
        { source: 'do-start', target: 'do-cdn' },
        { source: 'do-start', target: 'do-reel' },
        { source: 'do-reel', target: 'do-blueprint' },
        { source: 'do-start', target: 'do-responsive' },
        { source: 'do-blueprint', target: 'p-koji', animated: true },
        { source: 'do-blueprint', target: 'p-budgetfit', animated: true }
      ]
    }
  },
  {
    id: '16',
    slug: 'smthn-gd',
    title: 'SMTHN.GD (Jarvis)',
    tagline: 'Local AI Assistant Ecosystem',
    description: 'An experimental Python-based AI assistant integrating local LLMs (DeepSeek) and audio generation. Features cross-platform device handling (CUDA/MPS/CPU fallbacks), Conda environment isolation, and headless audio pipelines.',
    client: 'Personal Project',
    date: '2026',
    tech: 'Python, Conda, PyTorch, DeepSeek',
    imageUrl: '/projects/placeholder.jpg',
    liveLink: null,
    codeLink: null,
    category: 'full-stack',
    techStack: ['Python', 'Conda', 'PyTorch', 'DeepSeek'],
    featured: false,
    mindMap: {
      nodes: [
        { id: 'sg-start', type: 'hub', label: 'SMTHN.GD Architecture', description: 'Experimental AI assistant and lockdin_mvp prototype.', x: 1000, y: 900 },
        { id: 'sg-mvp', type: 'task', label: 'MVP Planning', description: 'Initial repository setup and architecture planning.', x: 600, y: 650 },
        { id: 'sg-jarvis', type: 'task', label: 'Core Logic (jarvis.py)', description: 'Orchestrator script managing the conversational loop.', x: 1400, y: 650 },
        { id: 'sg-env', type: 'task', label: 'Environment Hardening', description: 'Conda setup for deterministic cross-platform execution.', x: 1000, y: 450 },
        { id: 'sg-audio', type: 'task', label: 'Audio & Device Optimization', description: 'DeepSeek integration with CUDA/MPS fallbacks and no-audio flag.', x: 1000, y: 200 }
      ],
      edges: [
        { source: 'sg-start', target: 'sg-mvp' },
        { source: 'sg-start', target: 'sg-jarvis' },
        { source: 'sg-mvp', target: 'sg-env' },
        { source: 'sg-jarvis', target: 'sg-env' },
        { source: 'sg-env', target: 'sg-audio' }
      ]
    }
  }
];
