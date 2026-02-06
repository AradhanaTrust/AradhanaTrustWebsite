"use client";

import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ArrowRight, Calendar, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Hero() {
    const { language } = useLanguage();
    const t = translations[language].hero;

    // Scroll Animation Logic
    const { scrollY } = useScroll();

    // Transform scroll to curve control point Y
    // Range: 0px scroll -> Deep curve (320), 300px scroll -> Flat (190)
    const curveControlY = useTransform(scrollY, [0, 300], [320, 190]);

    // Derived control points for the lines using offsets
    const curveControlY_Line1 = useTransform(curveControlY, (y) => y + 1.5);
    const curveControlY_Line2 = useTransform(curveControlY, (y) => y + 12);

    // Dynamic Paths - Start Y moved down to 190
    const pathMain = useMotionTemplate`M0,190 Q600,${curveControlY} 1200,190 L1200,280 L0,280 Z`;
    const pathLine1 = useMotionTemplate`M0,191.5 Q600,${curveControlY_Line1} 1200,191.5`;
    const pathLine2 = useMotionTemplate`M0,202 Q600,${curveControlY_Line2} 1200,202`;

    const handleScroll = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/hero-bg-v2.png"
                    alt="Aradhana Dharmika Trust Background"
                    fill
                    className="object-cover object-[center_center]"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF8] via-[#FFFDF8]/15 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-0" />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-4 lg:px-12 relative z-10 flex flex-col items-center text-center space-y-8 max-w-6xl">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-0"
                >

                    <div className="flex flex-col items-center gap-2 md:gap-4">
                        <span className="text-lg md:text-2xl lg:text-3xl font-serif font-medium text-[#5D4037] tracking-[0.2em] uppercase drop-shadow-sm">
                            {t.title_line1}
                        </span>
                        <h1
                            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-cinzel-decorative font-black leading-tight filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)_0_0_15px_rgba(242,201,109,0.5)] px-4 pb-1"
                            style={{
                                backgroundImage: "linear-gradient(to bottom, #F2C96D, #9E731C)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                color: "transparent"
                            }}
                        >
                            {t.title_line2}
                        </h1>
                    </div>

                    <p className="text-lg md:text-2xl text-[#4A3225] font-sans font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                        {t.quote}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-5 pt-4"
                >
                    {/* Donate Button: Lighter Border (Matched to Events), Gold Gap, Light Inner Line */}
                    <button className="px-10 py-3 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
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
                <svg className="relative block w-[calc(100%+1.3px)] h-[160px] md:h-[280px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" preserveAspectRatio="none">
                    {/* Main Fill (Cream/Background color of next section) */}
                    <motion.path d={pathMain} className="fill-background-ivory" stroke="none"></motion.path>

                    {/* Double Gold Lines */}
                    {/* Upper Line (Darker Gold) */}
                    <motion.path d={pathLine1} fill="none" stroke="url(#goldGradient)" strokeWidth="3" className="drop-shadow-sm"></motion.path>

                    {/* Lower Line (Lighter/Thinner) */}
                    <motion.path d={pathLine2} fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.6"></motion.path>

                    <defs>
                        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="50%" stopColor="#F4C430" />
                            <stop offset="100%" stopColor="#B8860B" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Scroll Down Indicator - Center of Curve */}
                <div
                    onClick={handleScroll}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-300"
                >
                    <ChevronDown className="text-[#F4C430] w-10 h-10 animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                </div>
            </div>
        </section>
    );
}
