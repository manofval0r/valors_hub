'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import { whyWebContent } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const codeSnippet = `function buildTheFuture() {
  return passion + code;
}

const impact = skills
  .filter(s => s.useful)
  .map(s => s.apply());`;

export default function WhyWeb() {
    return (
        <Section id="why-web" background="alternate" className="relative overflow-hidden">
            {/* Animated Code Background */}
            <div className="absolute top-0 right-0 w-[500px] h-full pointer-events-none opacity-[0.08] select-none z-0 overflow-hidden font-mono text-sm leading-relaxed p-12">
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: "-50%" }}
                    transition={{
                        duration: 40,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <div className="text-[var(--ink-faint)]">function buildTheFuture() &#123;</div>
                    <div className="pl-4 text-[var(--ink-strong)]">return passion + code;</div>
                    <div className="text-[var(--ink-faint)]">&#125;</div>
                    <div className="h-8" />
                    <div className="text-[var(--ink-faint)]">const impact = skills</div>
                    <div className="pl-4 text-[var(--ink-strong)]">.filter(s =&gt; s.useful)</div>
                    <div className="pl-4 text-[var(--ink-strong)]">.map(s =&gt; s.apply());</div>
                    <div className="h-12" />
                    {/* Duplicate for seamless loop */}
                    <div className="text-[var(--ink-faint)]">function buildTheFuture() &#123;</div>
                    <div className="pl-4 text-[var(--ink-strong)]">return passion + code;</div>
                    <div className="text-[var(--ink-faint)]">&#125;</div>
                    <div className="h-8" />
                    <div className="text-[var(--ink-faint)]">const impact = skills</div>
                    <div className="pl-4 text-[var(--ink-strong)]">.filter(s =&gt; s.useful)</div>
                    <div className="pl-4 text-[var(--ink-strong)]">.map(s =&gt; s.apply());</div>
                </motion.div>
            </div>

            <motion.div
                className="relative z-10 max-w-[800px] flex flex-col gap-12 text-left"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.h2
                    className="text-4xl md:text-5xl font-normal text-[var(--ink-strong)]"
                    variants={fadeInUp}
                >
                    {whyWebContent.heading}
                </motion.h2>

                <div className="flex flex-col gap-6 text-[var(--ink-strong)]/80 leading-relaxed text-lg">
                    {whyWebContent.paragraphs.map((para, index) => (
                        <motion.p key={index} variants={fadeInUp}>
                            {para}
                        </motion.p>
                    ))}
                </div>
            </motion.div>
        </Section>
    );
}
