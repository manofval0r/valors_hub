'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { projects } from '@/data/projects';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function CaseStudy() {
    const { slug } = useParams();
    const router = useRouter();

    const project = projects.find(p => p.slug === slug);

    if (!project) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[var(--ink-black)]">
                <div className="text-center">
                    <h1 className="text-4xl text-[var(--alabaster)] mb-8">Project not found</h1>
                    <Button onClick={() => router.push('/work')}>Back to Archive</Button>
                </div>
            </main>
        );
    }

    // Find next and previous projects
    const currentIndex = projects.findIndex(p => p.id === project.id);
    const prevProject = projects[currentIndex - 1];
    const nextProject = projects[currentIndex + 1];

    return (
        <main className="min-h-screen bg-[var(--ink-black)]">
            {/* Dynamic Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-[#778da9]/10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#778da9]/5 to-transparent -z-10" />
                <motion.div
                    className="text-center px-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        className="text-5xl md:text-7xl font-normal text-[#e0e1dd] mb-6"
                        variants={fadeInUp}
                    >
                        {project.title}
                    </motion.h1>
                    <motion.p
                        className="text-[#778da9] uppercase tracking-[0.4em] text-xs font-mono"
                        variants={fadeInUp}
                    >
                        {project.tagline}
                    </motion.p>
                </motion.div>
            </section>

            <Section id="overview">
                <div className="grid md:grid-cols-[1fr_2fr] gap-24 items-start">
                    <div className="flex flex-col gap-10 sticky top-32">
                        <div className="flex flex-col gap-2">
                            <span className="text-[#778da9] text-[10px] uppercase font-mono tracking-[0.2em]">Client</span>
                            <span className="text-[#e0e1dd] text-sm">{project.client}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[#778da9] text-[10px] uppercase font-mono tracking-[0.2em]">Timeline</span>
                            <span className="text-[#e0e1dd] text-sm">{project.date}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[#778da9] text-[10px] uppercase font-mono tracking-[0.2em]">Stack</span>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map(t => (
                                    <span key={t} className="text-[10px] border border-[#778da9]/20 px-3 py-1 rounded-full text-[#778da9] uppercase font-mono tracking-widest">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 mt-8">
                            {project.liveLink && (
                                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                    <Button fullWidth>Live Site</Button>
                                </a>
                            )}
                            {project.codeLink && (
                                <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" fullWidth>View Code</Button>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-20">
                        <div className="flex flex-col gap-8">
                            <h2 className="text-2xl text-[#e0e1dd] font-normal">Overview</h2>
                            <p className="text-[#e0e1dd]/70 leading-relaxed text-lg font-light">
                                {project.description}
                            </p>
                        </div>

                        {/* Visual Showcase Placeholder */}
                        <div className="aspect-video bg-[#112131]/20 border border-[#778da9]/10 flex items-center justify-center text-[#778da9]/20 uppercase tracking-[0.4em] text-[10px] font-mono rounded-sm">
                            [ Visual Showcase ]
                        </div>

                        {/* "What I Learned" Box */}
                        <div className="border-l-[3px] border-[#778da9] pl-10 py-6 bg-[#112131]/10">
                            <h3 className="text-[#778da9] text-[10px] uppercase tracking-[0.3em] mb-4 font-mono">Retrospective</h3>
                            <p className="text-[#e0e1dd]/80 italic leading-relaxed text-sm">
                                This project challenged me to think about the intersection of performance and aesthetics.
                                Solving for {project.client} allowed me to explore {project.techStack.join(', ')} in a high-stakes, real-world scenario where architectural decisions had immediate user impact.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Navigation */}
            <div className="border-t border-[var(--lavender)]/10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2">
                    {prevProject ? (
                        <Link
                            href={`/work/${prevProject.slug}`}
                            className="group p-12 border-b md:border-b-0 md:border-r border-[#778da9]/10 hover:bg-[#778da9]/5 transition-all text-left"
                        >
                            <span className="text-[#778da9]/50 text-[10px] mb-4 block uppercase font-mono tracking-widest">Previous Project</span>
                            <h4 className="text-2xl text-[#e0e1dd] group-hover:text-[#778da9] transition-colors font-normal">{prevProject.title}</h4>
                        </Link>
                    ) : <div className="p-12 border-r border-[#778da9]/10" />}

                    {nextProject ? (
                        <Link
                            href={`/work/${nextProject.slug}`}
                            className="group p-12 hover:bg-[#778da9]/5 transition-all text-right"
                        >
                            <span className="text-[#778da9]/50 text-[10px] mb-4 block uppercase font-mono tracking-widest">Next Project</span>
                            <h4 className="text-2xl text-[#e0e1dd] group-hover:text-[#778da9] transition-colors font-normal">{nextProject.title}</h4>
                        </Link>
                    ) : <div className="p-12" />}
                </div>
            </div>
        </main>
    );
}
