"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Calendar, HandHeart, Home, Music, Users, Utensils } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import GoldCurveSeparator from "./GoldCurveSeparator";

export default function Objectives() {
    const { language } = useLanguage();
    const t = translations[language].objectives;

    return (
        <section className="py-20 bg-background border-t border-secondary/10 relative">
            <div className="container-gold pb-8">
                <div className="text-center mb-16 space-y-6">
                    <div className="flex items-center justify-center gap-4 text-secondary">
                        <span className="h-[1.5px] w-24 bg-gradient-to-r from-transparent to-secondary" />
                        <span className="font-serif uppercase tracking-[0.2em] text-sm md:text-base font-bold text-secondary-dark">{t.title}</span>
                        <span className="h-[1.5px] w-24 bg-gradient-to-r from-secondary to-transparent" />
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-primary-dark leading-tight">
                        {t.subtitle}
                    </h2>
                    <p className="text-base md:text-lg lg:text-xl text-secondary-dark italic font-serif mt-3 max-w-3xl mx-auto">
                        {t.description}
                    </p>


                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                    {t.cards.map((obj, idx) => {
                        // Map images to objectives (using generated ones + placeholders for now)
                        const images = [
                            "/assets/obj_temple.png",     // Temple Activities
                            "/assets/obj_annadanam.png",  // Annadanam
                            "/assets/obj_pooja.png",      // Vedic Pooja
                            "/assets/obj_education.png",  // Spiritual Education
                            "/assets/obj_welfare.png",    // Social Welfare
                            "/assets/obj_culture.png"     // Cultural Programs
                        ];

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] rounded-2xl px-4 py-5 md:px-5 md:py-6 xl:p-6 border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_8px_16px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center cursor-pointer h-full relative overflow-hidden"
                            >
                                <div className="absolute inset-0 texture-parchment opacity-40 pointer-events-none" />

                                {/* Image Container: Compact on Zoom (md/lg), Original on Normal (xl) */}
                                <div className="relative z-10 w-full h-20 md:h-24 xl:h-32 flex items-center justify-center mb-3 xl:mb-4">
                                    <img
                                        src={images[idx]}
                                        alt={obj.title}
                                        className="max-h-full w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-2xl"
                                    />
                                </div>

                                {/* Title: Smaller on Zoom, Original on Normal */}
                                <h3 className="font-cinzel-decorative font-bold text-[#5D4037] text-sm md:text-base xl:text-lg relative z-10 group-hover:text-[#8B5E3C] transition-colors leading-relaxed tracking-wider uppercase" style={{ fontFeatureSettings: '"liga" 0, "clig" 0', fontVariantLigatures: 'none' }}>
                                    {obj.title === "Vedic Pooja" ? <>Vedic<br />Pooja</> : obj.title}
                                </h3>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center mt-12">
                    <Link href="/events">
                        <button className="px-10 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2 group">
                            {t.viewAllEvents}
                            <Calendar size={18} className="text-[#4A3225] group-hover:scale-105 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Separator - Transitions to Donation (Cream) */}
            <GoldCurveSeparator fillColor="fill-[#F5F0E6]" />
        </section>
    );
}
