'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { resolveVideoSource } from '@/lib/cloudinary';

interface RevealCardProps {
    title: string;
    tagline: string;
    techStack: string[];
    image: string;
    video?: string;
    videoPublicId?: string;
    slug: string;
    liveLink?: string | null;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function RevealCard({
    title,
    tagline,
    techStack,
    image,
    video,
    videoPublicId,
    slug,
    liveLink,
}: RevealCardProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const resolvedVideo = resolveVideoSource({
        videoPublicId,
        videoUrl: video,
    });

    // Play/pause video when revealed
    useEffect(() => {
        if (!videoRef.current) return;
        if (isRevealed) {
            videoRef.current.play().catch(() => { });
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isRevealed]);

    const handleCardClick = useCallback(() => {
        if (!isRevealed) {
            setIsRevealed(true);
        }
    }, [isRevealed]);

    const handleToggle = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        setIsRevealed(prev => !prev);
    }, []);

    const handleNavigate = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsNavigating(true);
    }, []);

    return (
        <motion.div
            className="group reveal-card bg-[var(--ground)] border border-[var(--rule-strong)] rounded-[2px] p-6 transition-all duration-300 hover:border-[var(--rule-fn)] hover:-translate-y-1"
            onClick={handleCardClick}
            animate={isNavigating ? { scale: 0.98, opacity: 0.95 } : { scale: 1, opacity: 1 }}
            whileTap={!isRevealed ? { scale: 0.98 } : undefined}
            transition={{ duration: 0.15 }}
        >
            {/* ——— COLLAPSED STATE ——— */}
            <AnimatePresence mode="wait">
                {!isRevealed ? (
                    <motion.div
                        key="collapsed"
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: EASE_OUT }}
                    >
                        {/* Title */}
                        <h3 className="text-2xl md:text-[28px] text-[var(--ink-strong)] leading-[1.2] mb-3">
                            {title}
                        </h3>

                        {/* Tagline */}
                        <p className="text-base text-[var(--ink-body)] leading-[1.5] max-w-[90%] mb-8">
                            {tagline}
                        </p>

                        {/* Preview Hint */}
                        <button
                            type="button"
                            onClick={handleCardClick}
                            aria-label={`Preview project: ${title}`}
                            className="w-full h-[120px] bg-[var(--ground-2)] border border-dashed border-[var(--rule-strong)] rounded-[2px] flex flex-col items-center justify-center gap-2 mb-6 cursor-pointer"
                        >
                            <span className="text-sm text-[var(--ink-faint)]">Tap to preview</span>
                            <motion.svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                className="text-[var(--ink-faint)]"
                                animate={{ y: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                        </button>

                        {/* Tech Stack Tags */}
                        {techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-xs text-[var(--ink-faint)] border border-[var(--rule-strong)] px-3 py-1.5 rounded-[2px] whitespace-nowrap font-mono"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* ——— REVEALED STATE ——— */
                    <motion.div
                        key="revealed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15, ease: EASE_OUT }}
                    >
                        {/* Title row with collapse arrow */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl text-[var(--ink-strong)] leading-[1.2]">
                                {title}
                            </h3>
                            <button
                                type="button"
                                onClick={handleToggle}
                                aria-label="Collapse preview"
                                className="p-2 text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-colors rounded-[2px]"
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Image / Video */}
                        <motion.div
                            className="w-full h-[280px] md:h-[320px] rounded-[2px] overflow-hidden mb-4 relative"
                            initial={{ y: '30%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
                        >
                            {resolvedVideo ? (
                                <video
                                    ref={videoRef}
                                    src={resolvedVideo}
                                    poster={image}
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    className="w-full h-full object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                                />
                            ) : (
                                <Image
                                    src={image}
                                    alt={title}
                                    fill
                                    className="object-cover object-top hover:scale-[1.02] transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={85}
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+P9/PQAJeQN7CgLJhwAAAABJRU5ErkJggg=="
                                />
                            )}
                        </motion.div>

                        {/* Tagline below image */}
                        <motion.p
                            className="text-base text-[var(--ink-body)] leading-[1.5] mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.25 }}
                        >
                            {tagline}
                        </motion.p>

                        {/* Tech Stack Tags */}
                        {techStack.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-xs text-[var(--ink-faint)] border border-[var(--rule-strong)] px-3 py-1.5 rounded-[2px] whitespace-nowrap font-mono"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.2 }}
                            className="flex items-center justify-between mt-2 pt-4 border-t border-[var(--rule)] gap-4"
                        >
                            <Link
                                href={`/work/${slug}`}
                                onClick={handleNavigate}
                                className="flex items-center gap-2 text-sm text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-colors"
                            >
                                <span>View case study</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            {liveLink && (
                                <a
                                    href={liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 text-sm text-[var(--ink-faint)] hover:text-[var(--ink-strong)] transition-colors"
                                >
                                    <span>Live site</span>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
