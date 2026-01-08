'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import BreathingSmile from '../animations/BreathingSmile';
import { personalInfo } from '@/data/personal';

export default function Hero() {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <motion.section
            id="home"
            className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{ opacity }}
        >
            {/* Background Animation */}
            <div className="absolute top-1/4 right-[10%] -z-10 pointer-events-none">
                <BreathingSmile />
            </div>

            <div className="flex flex-col items-center z-10 px-6">
                {/* 1. Name */}
                <motion.h1
                    className="text-5xl md:text-[64px] font-normal text-[#e0e1dd] tracking-tighter"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {personalInfo.name}
                </motion.h1>

                {/* Vertical Space ~100px */}
                <div className="h-[100px] md:h-[150px]" />

                {/* 3. Tagline */}
                <motion.p
                    className="text-lg md:text-[20px] text-[#e0e1dd]/90 max-w-[800px] text-center leading-relaxed"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    I craft web experiences with intention, <br className="hidden md:block" />
                    precision, and a focus on what matters.
                </motion.p>
            </div>

            {/* Vertical Space ~150px */}
            <div className="h-[150px] md:h-[200px]" />

            {/* 5. Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 flex flex-col items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <span className="text-[#778da9] text-sm uppercase tracking-widest">Scroll</span>
                {/* Mouse Icon */}
                <div className="w-6 h-10 border-2 border-[#778da9] rounded-full flex justify-center p-1">
                    <motion.div
                        className="w-1 h-2 bg-[#778da9] rounded-full"
                        animate={{
                            y: [0, 8, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </motion.div>
        </motion.section>
    );
}
