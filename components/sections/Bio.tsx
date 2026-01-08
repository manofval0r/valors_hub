'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import { bioContent } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Bio() {
    return (
        <Section id="bio" background="default">
            <motion.div
                className="grid md:grid-cols-[30%_70%] gap-12 md:gap-24 items-center"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* Left Column: Geometric Shape */}
                <motion.div
                    className="flex justify-center md:justify-start"
                    variants={fadeInUp}
                >
                    <div className="w-48 h-48 border-2 border-[var(--lavender)]/30 relative group">
                        <div className="absolute inset-0 bg-[var(--lavender)]/5 group-hover:bg-[var(--lavender)]/10 transition-colors duration-500" />
                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--alabaster)] opacity-50" />
                        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[var(--lavender)] opacity-30" />
                    </div>
                </motion.div>

                {/* Right Column: Bio Text */}
                <motion.div
                    className="flex flex-col gap-8"
                    variants={staggerContainer}
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-normal text-[var(--alabaster)]"
                        variants={fadeInUp}
                    >
                        {bioContent.heading}
                    </motion.h2>

                    <div className="flex flex-col gap-4 text-[#e0e1dd]/80 leading-relaxed text-lg">
                        {bioContent.paragraphs.map((para, index) => (
                            <motion.p key={index} variants={fadeInUp}>
                                {para}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </Section>
    );
}
