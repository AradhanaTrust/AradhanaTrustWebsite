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
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/hero-bg-main.png"
                    alt="Temple Riverside Background"
                    fill
                    className="object-cover object-[center_center]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 lg:px-12 relative z-10 flex flex-col items-center text-center space-y-8 max-w-4xl">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="h-1 w-24 bg-secondary rounded-full mx-auto" />

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-white drop-shadow-lg">
                        {t.title_line1} <br />
                        <span className="text-secondary-light">{t.title_line2}</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                        {t.quote}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-5 pt-4"
                >
                    {/* Donate Button: Dark Brown Border, Gold Gap, Light Inner Line */}
                    <button className="px-10 py-3 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#4A3225] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                        {t.donateBtn}
                    </button>

                    {/* Events Button: Cream with Double Internal Frame */}
                    {/* Shadow trick: inset 3px bg-color (gap), inset 4px border-color (inner line) */}
                    <button className="px-10 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group">
                        {t.eventsBtn}
                        <Calendar size={18} className="text-[#4A3225] group-hover:scale-105 transition-transform" />
                    </button>
                </motion.div>
            </div>

            {/* Bottom Curved Separator with Double Gold Lines */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20">
                <svg className="relative block w-[calc(100%+1.3px)] h-[60px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    {/* Main Fill (Cream/Background color of next section) */}
                    <path d="M0,0 Q600,100 1200,0 L1200,120 L0,120 Z" className="fill-background-ivory" stroke="none"></path>

                    {/* Double Gold Lines */}
                    {/* Upper Line (Darker Gold) */}
                    <path d="M0,1.5 Q600,101.5 1200,1.5" fill="none" stroke="url(#goldGradient)" strokeWidth="3" className="drop-shadow-sm"></path>

                    {/* Lower Line (Lighter/Thinner) */}
                    <path d="M0,12 Q600,112 1200,12" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"></path>

                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="50%" stopColor="#F4C430" />
                            <stop offset="100%" stopColor="#B8860B" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </section>
    );
}
