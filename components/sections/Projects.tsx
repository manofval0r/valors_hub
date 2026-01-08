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
        </div>
    );
}
