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
    connections: ['html', 'javascript'],
    core: true,
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'frontend',
    connections: ['html', 'css', 'react', 'nodejs'],
    core: true,
  },
  {
    id: 'react',
    name: 'ReactJS',
    category: 'frontend',
    connections: ['javascript', 'nextjs', 'typescript'],
    core: true,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    connections: ['react', 'typescript', 'vercel'],
    core: true,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    connections: ['javascript', 'react', 'nextjs'],
    core: false,
  },
  
  // Backend
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    connections: ['javascript'],
    core: false,
  },
  {
    id: 'django',
    name: 'Django',
    category: 'backend',
    connections: [],
    core: false,
  },
  
  // Tools & Workflow
  {
    id: 'git',
    name: 'Git',
    category: 'tools',
    connections: ['vercel'],
    core: false,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'tools',
    connections: ['nextjs', 'git'],
    core: false,
  },
  
  // AI Tools
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'ai',
    connections: [],
    core: false,
  },
];

export const skillCategories = [
  { id: 'all', label: 'All' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'tools', label: 'Tools & Workflow' },
  { id: 'ai', label: 'AI-Assisted Development' },
];
