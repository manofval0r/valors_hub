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
  collaborator?: {
    name: string;
    github: string;
  };
}

export const projects: Project[] = [
  
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
    videoUrl: '/projects/restaurant.mp4',
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
    videoUrl: '/projects/whats-next.mp4',
    liveLink: 'https://whats-next-ate2.onrender.com',
    codeLink: 'https://github.com/manofval0r/WHATS-NEXT',
    category: 'web',
    techStack: ['React', 'Vite', 'Django', 'Node.js'],
    featured: true,
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
    imageUrl: '/projects/solar.png',
    liveLink: 'https://pes-analyser.vercel.app',
    codeLink: 'https://github.com/Anikin-kings/PES-analyzer',
    category: 'full-stack',
    techStack: ['Node.js', 'Express.js', 'HTML', 'CSS'],
    featured: false,
    collaborator: {
      name: 'Anikin Kings',
      github: 'https://github.com/Anikin-kings'
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
    tech: 'Details confidential.',
    imageUrl: '/projects/kloshouse.png',
    videoUrl: '/projects/kloshouse.mp4',
    liveLink: 'https://kloshouse.vercel.app',
    codeLink: 'https://github.com/manofval0r/kloshouse',
    category: 'web',
    techStack: [],
    featured: true,
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
  }
];
