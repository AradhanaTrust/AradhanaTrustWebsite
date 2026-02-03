"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const bgImages = ["bg-gradient-to-br from-orange-400 to-red-500", "bg-gradient-to-br from-yellow-400 to-orange-500", "bg-gradient-to-br from-red-500 to-purple-600"];

export default function Events() {
    const { language } = useLanguage();
    const t = translations[language].events;

    return (
        <section id="events" className="py-20 bg-surface">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">{t.title}</h2>
                        <p className="text-secondary-dark font-medium">{t.subtitle}</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors underline-offset-4 hover:underline">
                        {t.viewAll} <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {t.cards.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
                        >
                            {/* Image Placeholder */}
                            <div className={`h-48 w-full ${bgImages[idx]} relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-primary shadow-sm">
                                    UPCOMING
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-secondary transition-colors">
                                        {event.title}
                                    </h3>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-secondary" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} className="text-secondary" />
                                        <span>{event.loc}</span>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 mt-2 rounded-xl border border-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm">
                                    {t.register}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <button className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors">
                        {t.viewAll} <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}
