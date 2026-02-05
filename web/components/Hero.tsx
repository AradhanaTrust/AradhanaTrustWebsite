"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Hero() {
    const { language } = useLanguage();
    const t = translations[language].hero;

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20 pb-28">
            {/* Background Pattern - Premium Mandala */}
            <div className="absolute inset-0 bg-mandala-premium animate-spin-slow pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Text Content - Left Side */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 text-center lg:text-left"
                >


                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] text-primary-dark">
                            {t.title_line1} <br />
                            <span className="text-secondary-dark">{t.title_line2}</span>
                        </h1>
                        <div className="h-1 w-32 bg-secondary rounded-full mx-auto lg:mx-0" />
                    </div>

                    <p className="text-lg md:text-xl text-primary/80 leading-relaxed font-sans max-w-lg mx-auto lg:mx-0 font-light">
                        {t.quote}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
                        <button className="px-10 py-4 bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-light hover:to-secondary text-white font-bold rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_25px_rgba(212,175,55,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest border border-secondary/20">
                            {t.donateBtn}
                            <ArrowRight size={18} />
                        </button>
                        <button className="px-10 py-4 border border-secondary text-secondary-dark font-bold rounded-full hover:bg-secondary/5 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest hover:border-secondary">
                            <Calendar size={18} />
                            {t.eventsBtn}
                        </button>
                    </div>
                </motion.div>

                {/* Illustration / Image Placeholder - Right Side with Arch Mask */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative h-[400px] md:h-[500px] lg:h-[650px] w-full flex items-center justify-center lg:justify-end"
                >
                    {/* Arch Shape Container */}
                    <div className="relative w-full max-w-md lg:max-w-lg h-full rounded-t-[200px] border-[6px] border-double border-secondary/30 p-3 bg-white/50 backdrop-blur-sm shadow-xl">
                        <div className="w-full h-full rounded-t-[190px] overflow-hidden relative bg-gradient-to-b from-primary/5 to-primary/10 group grayscale-[10%] hover:grayscale-0 transition-all duration-700">
                            {/* Image Placeholder */}
                            <Image
                                src="/assets/hero-bg.png"
                                alt="Temple Gopuram"
                                fill
                                sizes="100vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                priority
                            />
                            {/* Inner Border Overlay */}
                            <div className="absolute inset-0 border-[1px] border-white/20 rounded-t-[190px] m-2 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Curved Separator */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(118%)] h-[60px] fill-background-cream">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
}
