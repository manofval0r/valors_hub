'use client';

import { motion } from 'framer-motion';

interface JourneyStep {
  date: string;
  phase: string;
  description: string;
}

export default function JourneyTimeline({ journey }: { journey?: JourneyStep[] }) {
  if (!journey || journey.length === 0) return null;

  return (
    <div className="flex flex-col gap-8 mt-8">
        <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="text-2xl text-[#e0e1dd] font-normal"
        >
            Development Journey
        </motion.h2>
        <div className="flex flex-col gap-8 relative border-l border-[#778da9]/20 ml-3 pl-8 py-2">
            {journey.map((step, index) => (
                <motion.div 
                    key={index} 
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                    {/* Timeline Dot */}
                    <div className="absolute -left-[37px] top-1.5 w-[9px] h-[9px] rounded-full bg-[#0d1b2a] border-2 border-[#778da9] shadow-[0_0_0_4px_#0d1b2a]" />
                    
                    <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-3">
                            <h4 className="text-[#e0e1dd] font-medium">{step.phase}</h4>
                            <span className="text-[#778da9] text-[10px] uppercase font-mono tracking-widest">{step.date}</span>
                        </div>
                        <p className="text-[#e0e1dd]/70 text-sm leading-relaxed">{step.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );
}
