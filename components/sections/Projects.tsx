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
                    className="text-[#778da9] hover:text-[#e0e1dd] uppercase text-[9px] tracking-[0.4em] font-mono transition-colors link-underline"
                >
                    View All Projects
                </a>
            </div>
        </div>
    );
}
