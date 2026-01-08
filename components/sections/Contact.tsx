'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Section from '../ui/Section';
import Button from '../ui/Button';
import Envelope from '../animations/Envelope';
import { contactInfo } from '@/data/personal';
import { fadeInUp } from '@/lib/animations';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        setStatus('submitting');

        try {
            // Web3Forms integration
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '234047df-1adf-44d5-b729-977c1beb4914',
                    ...data,
                    subject: `New Portfolio Message from ${data.name}`,
                }),
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <Section id="contact" background="default">
            <div className="max-w-4xl mx-auto flex flex-col gap-16 items-center">
                <motion.div
                    className="text-center flex flex-col gap-4 mb-[120px]"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-normal text-[#e0e1dd]">Get In Touch</h2>
                    <p className="text-[#778da9] uppercase tracking-[0.4em] text-xs font-mono">
                        Let&apos;s build something intentional together.
                    </p>
                </motion.div>

                {/* Envelope & Form Container */}
                <div className="relative w-full max-w-2xl px-6 py-12">

                    <AnimatePresence mode="wait">
                        {status !== 'success' ? (
                            <motion.div
                                key="form-container"
                                exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.4 } }}
                                className="relative z-10"
                            >
                                <div className="mb-12">
                                    <Envelope status={status} />
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#778da9] text-[10px] uppercase font-mono tracking-[0.3em]">Name</label>
                                        <input
                                            {...register('name', { required: true })}
                                            placeholder="Your Name"
                                            className="bg-transparent border-b border-[#778da9]/20 py-3 text-[#e0e1dd]/80 focus:border-[#e0e1dd]/50 focus:text-[#e0e1dd] outline-none transition-all placeholder:text-[#778da9]/20 font-normal"
                                        />
                                        {errors.name && <span className="text-red-400 text-[10px] font-mono mt-1 uppercase tracking-tighter">Required</span>}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#778da9] text-[10px] uppercase font-mono tracking-[0.3em]">Email</label>
                                        <input
                                            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                                            placeholder="hello@example.com"
                                            className="bg-transparent border-b border-[#778da9]/20 py-3 text-[#e0e1dd]/80 focus:border-[#e0e1dd]/50 focus:text-[#e0e1dd] outline-none transition-all placeholder:text-[#778da9]/20 font-normal"
                                        />
                                        {errors.email && <span className="text-red-400 text-[10px] font-mono mt-1 uppercase tracking-tighter">Invalid email format</span>}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#778da9] text-[10px] uppercase font-mono tracking-[0.3em]">Message</label>
                                        <textarea
                                            {...register('message', { required: true })}
                                            placeholder="What's on your mind?"
                                            rows={4}
                                            className="bg-transparent border-b border-[#778da9]/20 py-3 text-[#e0e1dd]/80 focus:border-[#e0e1dd]/50 focus:text-[#e0e1dd] outline-none transition-all resize-none placeholder:text-[#778da9]/20 font-normal"
                                        />
                                        {errors.message && <span className="text-red-400 text-[10px] font-mono mt-1 uppercase tracking-tighter">Required</span>}
                                    </div>

                                    <div className="mt-4">
                                        <Button
                                            type="submit"
                                            disabled={status === 'submitting'}
                                            fullWidth
                                            size="lg"
                                        >
                                            {status === 'submitting' ? 'Folding Envelope...' : 'Send Message'}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success-container"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 flex flex-col gap-8 items-center"
                            >
                                <motion.div
                                    initial={{ y: 0, x: 0, rotate: 0, scale: 1 }}
                                    animate={{
                                        y: -400,
                                        x: 200,
                                        rotate: -20,
                                        scale: 0.5,
                                        opacity: 0
                                    }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                >
                                    <Envelope status="success" />
                                </motion.div>

                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl text-[#e0e1dd] font-normal">Message Sent!</h3>
                                    <p className="text-[#778da9] max-w-sm font-light">
                                        Your message has been safely folded and sent. I&apos;ll get back to you shortly.
                                    </p>
                                </div>

                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-[#e0e1dd] uppercase text-[10px] tracking-[0.4em] font-mono link-underline mt-8"
                                >
                                    Send another?
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Social Links */}
                <div className="flex gap-8 mt-12">
                    {Object.entries(contactInfo.socials).map(([key, url]) => (
                        <motion.a
                            key={key}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#778da9] hover:text-[#e0e1dd] uppercase text-[10px] tracking-[0.4em] font-mono transition-colors link-underline"
                            whileHover={{ y: -2 }}
                        >
                            {key}
                        </motion.a>
                    ))}
                </div>
            </div>
        </Section>
    );
}
