"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Hero() {
    const { language } = useLanguage();
    const t = translations[language].hero;

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-primary overflow-x-hidden pt-20">
            {/* Background Gradient & Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4A0E68,transparent_50%)] opacity-80" />
            <div className="absolute inset-0 bg-mandala-pattern opacity-10 animate-spin-slow bg-cover bg-center" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Text Content - Left Side */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8 text-center lg:text-left pt-10 lg:pt-0"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 border border-secondary/30 rounded-full bg-white/5 backdrop-blur-sm self-center lg:self-start mx-auto lg:mx-0">
                        <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                        <span className="text-secondary text-[10px] tracking-widest uppercase font-bold">{t.est}</span>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-medium leading-[1.1] text-white">
                            {t.title_line1} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-secondary-dark">{t.title_line2}</span>
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-secondary to-transparent rounded-full mx-auto lg:mx-0" />
                    </div>

                    <p className="text-lg md:text-xl text-white/80 leading-relaxed font-sans max-w-lg mx-auto lg:mx-0">
                        {t.quote}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-2">
                        <button className="px-8 py-4 bg-gradient-to-r from-secondary to-secondary-dark hover:from-secondary-light hover:to-secondary text-primary-dark font-bold rounded-full shadow-[0_4px_14px_0_rgba(197,160,89,0.39)] hover:shadow-[0_6px_20px_rgba(197,160,89,0.23)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                            {t.donateBtn}
                            <ArrowRight size={16} />
                        </button>
                        <button className="px-8 py-4 border border-secondary/30 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full backdrop-blur-md transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                            <Calendar size={16} className="text-secondary" />
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
                    <div className="relative w-full max-w-md lg:max-w-lg h-full rounded-t-[200px] border-4 border-secondary/20 p-2">
                        <div className="w-full h-full rounded-t-[190px] overflow-hidden relative bg-gradient-to-b from-primary-light to-primary-dark group">
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-700" />

                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 text-center z-10">
                                <span className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🛕</span>
                                <p className="text-white/60 font-serif tracking-widest text-xs uppercase">Temple Image Placeholder</p>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-1/2 bg-secondary/20 blur-[100px]" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
