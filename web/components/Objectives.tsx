"use client";

import { motion } from "framer-motion";
import { BookOpen, HandHeart, Home, Music, Users, Utensils } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const icons = [Home, Utensils, BookOpen, Music, Users, HandHeart];
const colors = ["bg-orange-100 text-orange-600", "bg-yellow-100 text-yellow-600", "bg-purple-100 text-purple-600", "bg-blue-100 text-blue-600", "bg-green-100 text-green-600", "bg-pink-100 text-pink-600"];

export default function Objectives() {
    const { language } = useLanguage();
    const t = translations[language].objectives;

    return (
        <section className="py-20 bg-background border-t border-secondary/10">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-primary-dark">{t.title}</h2>
                    <p className="text-secondary-dark font-medium tracking-wide uppercase text-xs">{t.subtitle}</p>
                    <div className="w-16 h-0.5 bg-secondary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {t.cards.map((obj, idx) => {
                        const Icon = icons[idx];
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="group bg-white rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.15)] hover:-translate-y-2 transition-all border border-secondary/20 flex flex-col items-center text-center space-y-4 cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute inset-0 texture-parchment opacity-30 pointer-events-none" />
                                <div className="absolute top-0 left-0 w-full h-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-background-ivory border border-secondary/30 text-secondary-dark group-hover:bg-secondary group-hover:text-white transition-all duration-300 relative z-10`}>
                                    <Icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-serif font-bold text-primary-dark text-sm md:text-base group-hover:text-secondary-dark transition-colors">{obj.title}</h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
