"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
                    className="text-center max-w-4xl mx-auto space-y-8"
                >
                    <div className="flex items-center justify-center gap-4 text-secondary">
                        <span className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />
                        <span className="font-serif uppercase tracking-[0.2em] text-xs font-bold text-secondary-dark">{t.sectionTitle}</span>
                        <span className="h-px w-16 bg-gradient-to-r from-secondary to-transparent" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-primary-dark leading-tight">
                        {t.heading}
                    </h2>

                    <h3 className="text-lg md:text-xl font-medium text-secondary-dark/80 italic font-serif">
                        {t.subheading}
                    </h3>

                    <div className="w-24 h-1 bg-gradient-to-r from-secondary-light to-secondary mx-auto rounded-full" />

                    <p className="text-primary/70 leading-relaxed text-base md:text-lg font-light max-w-2xl mx-auto">
                        {t.description}
                    </p>

                    <div className="pt-8">
                        <button className="px-10 py-3.5 bg-background-ivory border border-secondary text-secondary-dark font-bold rounded-full hover:bg-secondary hover:text-white transition-all inline-flex items-center gap-2 shadow-[0_4px_10px_rgba(212,175,55,0.15)] uppercase tracking-wider text-sm">
                            {t.learnMore} <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
