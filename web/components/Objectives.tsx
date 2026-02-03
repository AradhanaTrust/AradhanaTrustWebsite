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
        <section className="py-20 bg-background border-t border-b border-gray-100">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">{t.title}</h2>
                    <p className="text-secondary-dark font-medium">{t.subtitle}</p>
                    <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
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
                                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100 flex flex-col items-center text-center space-y-4 cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colors[idx]} group-hover:scale-110 transition-transform`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary text-sm md:text-base">{obj.title}</h3>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
