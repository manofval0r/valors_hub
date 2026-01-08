'use client';

import { motion } from 'framer-motion';

export default function BreathingSmile() {
    return (
        <div className="relative w-[256px] h-[256px] flex items-center justify-center">
            {/* Ambient Glow: Pulsing behind the eyes */}
            <motion.div
                className="absolute w-[180px] h-[100px] bg-[#e0e1dd]/10 blur-[60px] rounded-full -z-10"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="relative w-full h-full"
                animate={{
                    scale: [1, 1, 1, 1, 1.02, 1, 1],
                }}
                transition={{
                    duration: 9.5,
                    repeat: Infinity,
                    times: [0, 0.2, 0.4, 0.5, 0.7, 0.9, 1],
                    ease: "easeInOut"
                }}
            >
                {/* Eyes Container: Handles spacing micro-expressions */}
                <motion.div
                    className="absolute top-[35%] left-1/2 -translate-x-1/2 flex"
                    animate={{
                        gap: ["36px", "36px", "30px", "30px", "30px", "30px", "36px"],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        times: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                        ease: "easeInOut"
                    }}
                >
                    {/* Blink Animation for Left Eye */}
                    <motion.div
                        className="w-[15px] h-[15px] bg-[#e0e1dd]"
                        animate={{
                            scaleY: [1, 0, 1, 1, 0, 1, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 0.2,
                            times: [0, 0.05, 0.1, 0.5, 0.55, 0.6, 1],
                            ease: "easeInOut"
                        }}
                    />
                    {/* Blink Animation for Right Eye */}
                    <motion.div
                        className="w-[15px] h-[15px] bg-[#e0e1dd]"
                        animate={{
                            scaleY: [1, 0, 1, 1, 0, 1, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: 0.2,
                            times: [0, 0.05, 0.1, 0.5, 0.55, 0.6, 1],
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>

                {/* Mouth: Below eyes, 3px stroke */}
                <svg
                    viewBox="0 0 100 100"
                    className="absolute top-[45%] left-0 w-full h-[100px]"
                >
                    <motion.path
                        stroke="#e0e1dd"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ d: "M 25 50 Q 50 30 75 50" }}
                        animate={{
                            d: [
                                "M 25 50 Q 50 30 75 50", // Start at Smile
                                "M 25 50 Q 50 30 75 50", // Hold Smile
                                "M 25 50 Q 50 50 75 50", // Neutral
                                "M 25 50 Q 50 65 75 50", // Frown
                                "M 25 50 Q 50 65 75 50", // Hold Frown
                                "M 25 50 Q 50 50 75 50", // Neutral
                                "M 25 50 Q 50 30 75 50", // Back to Smile
                            ],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            times: [0, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            </motion.div>
        </div>
    );
}
