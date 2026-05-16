import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { Metadata } from 'next';
import BlueprintCaseStudy from '@/components/ui/BlueprintCaseStudy';

export const dynamicParams = true;

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = projects.find(p => p.slug === slug);
    if (!project) return { title: 'Project Not Found' };
    return {
        title: `${project.title} — David Idowu`,
        description: project.description,
        openGraph: {
            title: `${project.title} — David Idowu`,
            description: project.tagline,
        },
    };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = projects.find(p => p.slug === slug);

    if (!project) notFound();

    const currentIndex = projects.findIndex(p => p.id === project.id);
    const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
    const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined;

    return (
        <BlueprintCaseStudy
            project={project}
            prevProject={prevProject}
            nextProject={nextProject}
        />
    );
}
