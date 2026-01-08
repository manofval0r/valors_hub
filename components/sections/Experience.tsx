'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import { experience, certifications } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Experience() {
    return (
        <Section id="experience" background="alternate">
            <div className="grid lg:grid-cols-2 gap-24">

                {/* Experience Column */}
                <motion.div
                    className="flex flex-col gap-12"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-4xl font-normal text-[var(--alabaster)]"
                        variants={fadeInUp}
                    >
                        Experience
                    </motion.h2>

                    <div className="flex flex-col gap-12 relative border-l border-[#778da9]/20 pl-8 ml-2">
                        {experience.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                className="relative"
                                variants={fadeInUp}
                            >
                                {/* Timeline node: 4x4px, rotated 45deg */}
                                <div className="absolute -left-[35px] top-2.5 w-[6px] h-[6px] bg-[#0d1b2a] border border-[#778da9] rotate-45" />

                                <div className="flex flex-col gap-2">
                                    <span className="text-[#778da9] text-xs font-mono tracking-widest">
                                        {exp.startDate} — {exp.endDate || 'Present'}
                                    </span>
                                    <h3 className="text-2xl text-[#e0e1dd] font-normal">{exp.role}</h3>
                                    <span className="text-[#778da9] text-sm tracking-wide">{exp.company} • {exp.location}</span>

                                    <ul className="mt-4 flex flex-col gap-3">
                                        {exp.details.map((detail, i) => (
                                            <li key={i} className="text-[#e0e1dd]/70 text-sm leading-relaxed flex gap-3">
                                                <span className="text-[#778da9] mt-2 w-1 h-1 bg-[#778da9]/40 flex-shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Certificates Column */}
                <motion.div
                    className="flex flex-col gap-12"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="text-4xl font-normal text-[var(--alabaster)]"
                        variants={fadeInUp}
                    >
                        Credentials
                    </motion.h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
                        {certifications.map((cert) => (
                            <motion.a
                                key={cert.id}
                                href={cert.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={fadeInUp}
                                className="group"
                            >
                                <Card hoverable className="h-full flex flex-col justify-between group-hover:border-[#e0e1dd]/50 transition-colors bg-[#112131]/20">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[#778da9] text-[10px] font-mono tracking-tighter">{cert.date}</span>
                                            <span className="text-[#778da9] group-hover:text-[#e0e1dd] transition-colors">↗</span>
                                        </div>
                                        <h4 className="text-[#e0e1dd] text-base group-hover:text-[#778da9] transition-colors leading-tight">
                                            {cert.name}
                                        </h4>
                                    </div>
                                    <span className="text-[#778da9]/60 text-[10px] mt-4 uppercase font-mono tracking-widest">
                                        {cert.issuer}
                                    </span>
                                </Card>
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Section>
    );
}
