"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Welcome() {
    const { language } = useLanguage();
    const t = translations[language].welcome;

    return (
        <section id="about" className="relative py-20 lg:py-32 bg-surface overflow-hidden">
            {/* Decorative Top Curve - simulates the "Curved top edge" from prompt */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-primary to-surface opacity-10 rounded-b-[100%]" />

            <div className="container mx-auto px-4 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <div className="flex items-center justify-center gap-4 text-secondary/60">
                        <span className="h-px w-12 bg-current" />
                        <span className="font-serif uppercase tracking-widest text-xs font-bold">{t.sectionTitle}</span>
                        <span className="h-px w-12 bg-current" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">
                        {t.heading}
                    </h2>

                    <h3 className="text-lg md:text-xl font-medium text-secondary-dark italic">
                        {t.subheading}
                    </h3>

                    <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />

                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        {t.description}
                    </p>

                    <div className="pt-8">
                        <button className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                            {t.learnMore} <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
