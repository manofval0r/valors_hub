// Skills data types and content

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'security' | 'cloud' | 'ai';
  logo?: string;
  connections: string[]; // IDs of connected skills
  core: boolean; // Is this in the daily production core stack?
  tier?: 'core' | 'secondary';
}

export const skills: Skill[] = [
  // ─── Daily Production Core (Frontend & Mobile) ───
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    connections: ['javascript', 'react', 'nextjs', 'nodejs', 'react-native'],
    core: true,
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'frontend',
    connections: ['typescript', 'javascript', 'nextjs', 'tailwind', 'react-native'],
    core: true,
  },
  {
    id: 'nextjs',
    name: 'Next.js (App Router)',
    category: 'frontend',
    connections: ['react', 'typescript', 'supabase', 'tailwind', 'vercel'],
    core: true,
  },
  {
    id: 'react-native',
    name: 'React Native (Expo SDK 54)',
    category: 'frontend',
    connections: ['react', 'typescript', 'supabase'],
    core: true,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    connections: ['react', 'nextjs', 'css'],
    core: true,
  },
  {
    id: 'javascript',
    name: 'JavaScript (ES6+)',
    category: 'frontend',
    connections: ['typescript', 'react', 'nodejs', 'html'],
    core: true,
  },

  // ─── Daily Production Core (Backend & Data) ───
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    connections: ['django', 'celery', 'redis', 'postgresql'],
    core: true,
  },
  {
    id: 'django',
    name: 'Django & DRF',
    category: 'backend',
    connections: ['python', 'postgresql', 'celery', 'redis'],
    core: true,
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    category: 'backend',
    connections: ['javascript', 'typescript', 'postgresql', 'supabase'],
    core: true,
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'backend',
    connections: ['supabase', 'django', 'nodejs', 'sql'],
    core: true,
  },
  {
    id: 'supabase',
    name: 'Supabase (RLS & DB)',
    category: 'backend',
    connections: ['postgresql', 'nextjs', 'react-native', 'deno-edge'],
    core: true,
  },

  // ─── Security & Systems ───
  {
    id: 'supabase-rls',
    name: 'Row Level Security (RLS)',
    category: 'security',
    connections: ['supabase', 'postgresql'],
    core: true,
  },
  {
    id: 'jwt-auth',
    name: 'JWT & OAuth 2.0',
    category: 'security',
    connections: ['nodejs', 'django', 'nextjs'],
    core: true,
  },
  {
    id: 'rate-limiting',
    name: 'Tiered Rate Limiting',
    category: 'security',
    connections: ['nodejs', 'django', 'redis'],
    core: false,
  },
  {
    id: 'helmet-csp',
    name: 'Helmet.js & CSP',
    category: 'security',
    connections: ['nodejs', 'nextjs'],
    core: false,
  },
  {
    id: 'deno-edge',
    name: 'Deno Edge Functions',
    category: 'security',
    connections: ['supabase', 'typescript'],
    core: false,
  },

  // ─── Cloud & Data Infrastructure ───
  {
    id: 'redis',
    name: 'Redis',
    category: 'cloud',
    connections: ['celery', 'django', 'python'],
    core: true,
  },
  {
    id: 'celery',
    name: 'Celery Task Queues',
    category: 'cloud',
    connections: ['redis', 'django', 'python'],
    core: true,
  },
  {
    id: 'vercel',
    name: 'Vercel Edge Deploy',
    category: 'cloud',
    connections: ['nextjs', 'git'],
    core: false,
  },
  {
    id: 'render',
    name: 'Render Cloud',
    category: 'cloud',
    connections: ['nodejs', 'django'],
    core: false,
  },
  {
    id: 'docker',
    name: 'Docker (Familiar)',
    category: 'cloud',
    connections: ['postgresql', 'redis'],
    core: false,
  },

  // ─── AI Workflows & Tooling ───
  {
    id: 'gemini-api',
    name: 'Gemini API & LLMs',
    category: 'ai',
    connections: ['python', 'django', 'nextjs'],
    core: true,
  },
  {
    id: 'claude-code',
    name: 'Claude Code & Agentic Workflows',
    category: 'ai',
    connections: ['git', 'nextjs', 'python'],
    core: true,
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot Prompting',
    category: 'ai',
    connections: ['typescript', 'python'],
    core: false,
  },
  {
    id: 'posthog',
    name: 'PostHog Analytics',
    category: 'ai',
    connections: ['nextjs', 'django'],
    core: false,
  },
  {
    id: 'sentry',
    name: 'Sentry Telemetry',
    category: 'ai',
    connections: ['nodejs', 'react-native'],
    core: false,
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'ai',
    connections: ['vercel', 'render'],
    core: true,
  },

  // ─── Secondary Languages & Tools ───
  {
    id: 'c-lang',
    name: 'C Language',
    category: 'backend',
    connections: ['python'],
    core: false,
  },
  {
    id: 'sql',
    name: 'SQL (Triggers & Functions)',
    category: 'backend',
    connections: ['postgresql'],
    core: false,
  },
  {
    id: 'gsap',
    name: 'GSAP Animations',
    category: 'frontend',
    connections: ['javascript', 'html'],
    core: false,
  },
  {
    id: 'html',
    name: 'HTML5 & CSS3',
    category: 'frontend',
    connections: ['javascript', 'tailwind'],
    core: false,
  },
];

export const skillCategories = [
  { id: 'all', label: 'All Stack' },
  { id: 'core', label: '★ Daily Core' },
  { id: 'frontend', label: 'Frontend & Mobile' },
  { id: 'backend', label: 'Backend & Data' },
  { id: 'security', label: 'Security & Systems' },
  { id: 'cloud', label: 'Cloud & Queues' },
  { id: 'ai', label: 'AI & Tooling' },
];
