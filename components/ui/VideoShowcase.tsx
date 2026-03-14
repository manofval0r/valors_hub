'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { resolveVideoSource } from '@/lib/cloudinary';

interface VideoShowcaseProps {
    videoUrl?: string;
    videoPublicId?: string;
    imageUrl: string;
    title: string;
}

export default function VideoShowcase({ videoUrl, videoPublicId, imageUrl, title }: VideoShowcaseProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isVisible = useInView(containerRef, { amount: 0.3 });
    const resolvedVideo = resolveVideoSource({
        videoPublicId,
        videoUrl,
    });

    useEffect(() => {
        if (!videoRef.current) return;
        if (isVisible) {
            videoRef.current.play().catch(() => { });
        } else {
            videoRef.current.pause();
        }
    }, [isVisible]);

    return (
        <div
            ref={containerRef}
            className="aspect-video bg-[#112131]/20 border border-[#778da9]/10 relative overflow-hidden rounded-sm group shadow-2xl"
        >
            <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
            >
                {resolvedVideo ? (
                    <video
                        ref={videoRef}
                        src={resolvedVideo}
                        poster={imageUrl}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                ) : (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover object-top opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b2a]/40 to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
