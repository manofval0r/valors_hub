// Skills data types and content

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'ai';
  logo?: string;
  connections: string[]; // IDs of connected skills
  core: boolean; // Is this a core skill?
}

export const skills: Skill[] = [
  // Frontend - Core
  {
    id: 'html',
    name: 'HTML & HTML5',
    category: 'frontend',
    connections: ['css', 'javascript'],
    core: true,
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'frontend',
    connections: ['html', 'javascript', 'tailwind'],
    core: true,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    connections: ['html', 'css', 'react', 'nodejs', 'typescript'],
    core: true,
  },
  {
    id: 'react',
    name: 'ReactJS',
    category: 'frontend',
    connections: ['javascript', 'nextjs', 'typescript', 'tailwind'],
    core: true,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    connections: ['react', 'typescript', 'vercel', 'tailwind'],
    core: true,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    connections: ['javascript', 'react', 'nextjs', 'nodejs'],
    core: false,
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    connections: ['css', 'react', 'nextjs', 'postcss'],
    core: false,
  },
  
  // Backend
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    connections: ['javascript', 'typescript', 'postgresql'],
    core: false,
  },
  {
    id: 'django',
    name: 'Django',
    category: 'backend',
    connections: ['postgresql'],
    core: false,
  },
  
  // Tools & Workflow
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    connections: ['vercel', 'github'],
    core: false,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'tools',
    connections: ['nextjs', 'git'],
    core: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'tools',
    connections: ['git'],
    core: false,
  },
  
  // AI Tools
  {
    id: 'claude',
    name: 'Claude',
    category: 'ai',
    connections: ['nextjs', 'nodejs'],
    core: false,
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    category: 'ai',
    connections: ['Django', 'node.js', 'react', 'microsoft', 'typescript', 'html', 'tailwind', 'javascript', 'nextjs', 'microsoft-copilot'],
    core: false,
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    category: 'ai',
    connections: ['google-ai-studio', 'nextjs', 'javascript', 'typescript', 'django', 'html'],
    core: false,
  },
  {
    id: 'stitch',
    name: 'Stitch',
    category: 'ai',
    connections: ['google', 'design', 'ai'],
    core: false,
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    category: 'ai',
    connections: ['gemini', 'nextjs', 'javascript', 'tailwind', 'html'],
    core: false,
  },
  {
    id: 'canva-ai',
    name: 'Canva AI',
    category: 'ai',
    connections: ['canva', 'ai', 'design'],
    core: false,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    category: 'ai',
    connections: ['google-ai-studio', 'react', 'nextjs', 'javascript', 'typescript', 'django', 'html'],
    core: false,
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    category: 'ai',
    connections: ['microsoft', 'django', 'node.js', 'react', 'typescript', 'nextjs', 'javascript', 'tailwind', 'html', 'github-copilot'],
    core: false,
  },
];

export const skillCategories = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'tools', label: 'Tools & Workflow' },
  { id: 'ai', label: 'AI Ecosystem' },
];
