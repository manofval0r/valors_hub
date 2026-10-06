'use client';

import { projects } from '@/data/projects';
import ProjectCard from './ProjectCard';
import Section from '../ui/Section';

export default function FeaturedProjects() {
    // Only show featured projects on the landing page
    const featuredProjects = projects.filter(p => p.featured);

    return (
        <div id="projects">
            {featuredProjects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                />
            ))}
            <div className="flex justify-center py-16">
                <a
                    href="/work"
                    className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-[2px] border text-[11px] font-mono uppercase transition-colors"
                    style={{ letterSpacing: '0.22em', borderColor: 'var(--ink-strong)', background: 'var(--ink-strong)', color: 'var(--accent-ink)', fontWeight: 700 }}
                >
                    View All Projects
                    <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
            </div>
        </div>
    );
}
