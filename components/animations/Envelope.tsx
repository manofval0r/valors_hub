'use client';

import { motion } from 'framer-motion';

interface EnvelopeProps {
    status: 'idle' | 'submitting' | 'success' | 'error';
}

export default function Envelope({ status }: EnvelopeProps) {
    const isFolding = status === 'submitting' || status === 'success';

    return (
        <div className="relative w-full aspect-[2/1] max-w-sm mx-auto flex items-center justify-center">
            <svg
                viewBox="0 0 400 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                {/* Back of Envelope */}
                <rect x="50" y="40" width="300" height="150" stroke="#778da9" strokeWidth="2" fill="#0d1b2a" />

                {/* Paper (Inside) */}
                <motion.rect
                    x="70"
                    y="50"
                    width="260"
                    height="130"
                    fill="#e0e1dd"
                    animate={isFolding ? { y: 20, opacity: 0.5 } : { y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />

                {/* Left & Right Flaps */}
                <path d="M 50 40 L 200 115 L 350 40" stroke="#778da9" strokeWidth="2" />
                <path d="M 50 190 L 200 115 L 350 190" stroke="#778da9" strokeWidth="2" />

                {/* Top Flap (Animated) */}
                <motion.path
                    d="M 50 40 L 200 115 L 350 40"
                    stroke="#778da9"
                    strokeWidth="2"
                    fill="#0d1b2a"
                    animate={isFolding ? { d: "M 50 40 L 200 190 L 350 40" } : { d: "M 50 40 L 200 -20 L 350 40" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* Success Checkmark (Appears after folding) */}
                {status === 'success' && (
                    <motion.path
                        d="M 180 140 L 195 155 L 225 125"
                        stroke="#e0e1dd"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.7, duration: 0.3 }}
                    />
                )}
            </svg>
        </div>
    );
}
