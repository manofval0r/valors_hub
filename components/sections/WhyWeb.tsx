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
                    <div className="text-[#778da9]">function buildTheFuture() &#123;</div>
                    <div className="pl-4 text-[#e0e1dd]">return passion + code;</div>
                    <div className="text-[#778da9]">&#125;</div>
                    <div className="h-8" />
                    <div className="text-[#778da9]">const impact = skills</div>
                    <div className="pl-4 text-[#e0e1dd]">.filter(s =&gt; s.useful)</div>
                    <div className="pl-4 text-[#e0e1dd]">.map(s =&gt; s.apply());</div>
                    <div className="h-12" />
                    {/* Duplicate for seamless loop */}
                    <div className="text-[#778da9]">function buildTheFuture() &#123;</div>
                    <div className="pl-4 text-[#e0e1dd]">return passion + code;</div>
                    <div className="text-[#778da9]">&#125;</div>
                    <div className="h-8" />
                    <div className="text-[#778da9]">const impact = skills</div>
                    <div className="pl-4 text-[#e0e1dd]">.filter(s =&gt; s.useful)</div>
                    <div className="pl-4 text-[#e0e1dd]">.map(s =&gt; s.apply());</div>
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
                    className="text-4xl md:text-5xl font-normal text-[#e0e1dd]"
                    variants={fadeInUp}
                >
                    {whyWebContent.heading}
                </motion.h2>

                <div className="flex flex-col gap-6 text-[#e0e1dd]/80 leading-relaxed text-lg">
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
