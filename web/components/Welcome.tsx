"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Welcome() {
    const { language } = useLanguage();
    const t = translations[language].welcome;

    return (
        <section id="about" className="relative py-20 lg:py-32 bg-background-ivory overflow-hidden">
            {/* Decorative Top Curve */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-secondary/10 to-transparent rounded-b-[100%]" />

            {/* Side Patterns - Faint Temple/Mandala feel */}
            <div className="absolute top-1/2 -left-20 -translate-y-1/2 w-64 h-64 bg-[url('/assets/mandala-bg.svg')] bg-contain bg-no-repeat opacity-5 animate-spin-slow pointer-events-none" />
            <div className="absolute top-1/2 -right-20 -translate-y-1/2 w-64 h-64 bg-[url('/assets/mandala-bg.svg')] bg-contain bg-no-repeat opacity-5 animate-spin-slow pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-6xl mx-auto space-y-8"
                >
                    <div className="flex items-center justify-center gap-4 text-secondary">
                        <span className="h-[1.5px] w-24 bg-gradient-to-r from-transparent to-secondary" />
                        <span className="font-serif uppercase tracking-[0.2em] text-sm md:text-base font-bold text-secondary-dark">{t.sectionTitle}</span>
                        <span className="h-[1.5px] w-24 bg-gradient-to-r from-secondary to-transparent" />
                    </div>

                    <h2 className="text-2xl md:text-4xl font-serif font-medium text-primary-dark leading-tight">
                        {t.heading}
                    </h2>

                    <div className="space-y-2">
                        <h3 className="text-lg md:text-xl font-medium text-secondary-dark/80 italic font-serif">
                            {translations["en"].welcome.subheading}
                        </h3>
                        <h3 className="text-lg md:text-xl font-medium text-secondary-dark/80 italic font-serif">
                            {translations["kn"].welcome.subheading}
                        </h3>
                    </div>

                    <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto opacity-80 py-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary"></div>
                        <div className="w-2.5 h-2.5 bg-secondary rotate-45 shadow-sm"></div>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary"></div>
                    </div>

                    <p className="text-primary/70 leading-relaxed text-base md:text-lg font-light max-w-4xl mx-auto">
                        {t.description}
                    </p>

                    <div className="pt-8">
                        <Link href="/about">
                            <button className="px-10 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform inline-flex items-center justify-center gap-2 group">
                                {t.learnMore} <ArrowRight size={18} className="text-[#4A3225] group-hover:scale-105 transition-transform" />
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
