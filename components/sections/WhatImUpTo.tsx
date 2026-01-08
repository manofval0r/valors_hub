'use client';

import { motion } from 'framer-motion';
import Section from '../ui/Section';
import Card from '../ui/Card';
import { currentActivities } from '@/data/personal';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function WhatImUpTo() {
    return (
        <Section id="what-im-up-to" background="default">
            {/* Top Tier: 2 Cards */}
            <motion.div
                className="grid md:grid-cols-2 gap-8 mb-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                <motion.div variants={fadeInUp} className="h-full">
                    <Card className="h-full bg-[#112131]/20 border-[#778da9]/20 p-8 flex flex-col gap-4 min-h-[220px]">
                        <div className="flex items-center gap-3 text-[#778da9]">
                            <span className="text-xl">📚</span>
                            <h2 className="text-xs uppercase tracking-[0.3em] font-mono">Currently Reading</h2>
                        </div>
                        <h3 className="text-2xl text-[#e0e1dd] font-normal">{currentActivities.reading.title}</h3>
                        <p className="text-[#e0e1dd]/70 text-sm leading-relaxed">
                            {currentActivities.reading.description}
                        </p>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp} className="h-full">
                    <Card className="h-full bg-[#112131]/20 border-[#778da9]/20 p-8 flex flex-col gap-4 min-h-[220px]">
                        <div className="flex items-center gap-3 text-[#778da9]">
                            <span className="text-xl">💻</span>
                            <h2 className="text-xs uppercase tracking-[0.3em] font-mono">Currently Making</h2>
                        </div>
                        <h3 className="text-2xl text-[#e0e1dd] font-normal">{currentActivities.building.title}</h3>
                        <p className="text-[#e0e1dd]/70 text-sm leading-relaxed">
                            {currentActivities.building.description}
                        </p>
                    </Card>
                </motion.div>
            </motion.div>

            {/* Bottom Tier: 1 Wide Card */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
            >
                <Card className="bg-[#112131]/20 border-[#778da9]/20 p-8 flex flex-col gap-4 min-h-[180px]">
                    <div className="flex items-center gap-3 text-[#778da9]">
                        <span className="text-xl">🚀</span>
                        <h2 className="text-xs uppercase tracking-[0.3em] font-mono">What's Next</h2>
                    </div>
                    <h3 className="text-2xl text-[#e0e1dd] font-normal">Future Goals & Aspirations</h3>
                    <p className="text-[#e0e1dd]/70 text-sm leading-relaxed max-w-4xl">
                        Focused on mastering advanced AI integration, contributing to open-source ecosystems, and building tools that bridge human creativity with machine intelligence.
                    </p>
                </Card>
            </motion.div>
        </Section>
    );
}
