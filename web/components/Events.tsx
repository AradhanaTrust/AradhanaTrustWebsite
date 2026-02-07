"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

import GoldCurveSeparator from "./GoldCurveSeparator";

const eventImages = ["/assets/event-ganesh.png", "/assets/event-annadanam.png", "/assets/event-homa.png"];

export default function Events() {
    const { language } = useLanguage();
    const t = translations[language].events;

    return (
        <section id="events" className="py-20 bg-background-cream relative">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="space-y-4 text-center md:text-left w-full md:w-auto">
                        <h2 className="text-3xl md:text-5xl font-serif font-medium text-primary-dark">{t.title}</h2>
                        <div className="h-0.5 w-20 bg-secondary md:mr-auto rounded-full mx-auto" />
                        <p className="text-secondary-dark font-medium uppercase tracking-wider text-xs">{t.subtitle}</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-primary-dark font-bold hover:text-secondary-dark transition-colors underline-offset-4 hover:underline uppercase tracking-widest text-sm">
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
                            className="group bg-white rounded-t-full rounded-b-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(212,175,55,0.2)] transition-all border border-secondary/10 relative"
                        >
                            <div className="absolute inset-0 texture-parchment opacity-20 pointer-events-none z-10 mix-blend-multiply" />

                            {/* Image Placeholder */}
                            <div className="h-64 w-full relative overflow-hidden">
                                <Image
                                    src={eventImages[idx]}
                                    alt={event.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute top-4 right-4 bg-secondary text-primary-dark px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md z-20">
                                    Upcoming
                                </div>
                            </div>

                            <div className="p-8 space-y-6 relative">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-white border border-secondary/20 px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
                                    <span className="text-xs font-bold text-secondary-dark uppercase">{event.date.split(" ")[0]}</span>
                                    <span className="text-lg font-serif font-bold text-primary-dark">{event.date.split(" ")[1]}</span>
                                </div>

                                <div className="pt-2 text-center space-y-2">
                                    <h3 className="text-xl font-serif font-bold text-primary-dark group-hover:text-secondary-dark transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-sm text-primary/60">
                                        <MapPin size={14} className="text-secondary" />
                                        <span>{event.loc}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 rounded-full border border-secondary text-secondary-dark font-bold hover:bg-secondary hover:text-white transition-all text-xs uppercase tracking-widest">
                                    {t.register}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="inline-flex items-center gap-2 text-primary-dark font-bold hover:text-secondary-dark transition-colors uppercase tracking-widest text-sm">
                        {t.viewAll} <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Separator - Transitions to Gallery (Ivory) */}
            <GoldCurveSeparator fillColor="fill-[#FDFBF7]" />
        </section >
    );
}
