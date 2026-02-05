"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const galleryImages = [
    "/assets/gallery-1.png", // Main
    "/assets/gallery-2.png",
    "/assets/gallery-3.png",
    "/assets/gallery-4.png",
    "/assets/gallery-5.png",
];

export default function Gallery() {
    const { language } = useLanguage();
    const t = translations[language].gallery;

    return (
        <section id="gallery" className="py-20 bg-background-ivory text-primary relative overflow-hidden border-t border-secondary/10">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] opacity-[0.03] animate-spin-slow pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-primary-dark">{t.title}</h2>
                    <p className="text-secondary-dark font-medium tracking-wide uppercase text-xs">{t.subtitle}</p>
                    <div className="w-16 h-0.5 bg-secondary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[600px]">
                    {/* Main Large Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="col-span-2 row-span-2 rounded-t-[150px] rounded-b-2xl overflow-hidden relative group shadow-xl border border-secondary/20"
                    >
                        <Image
                            src={galleryImages[0]}
                            alt="Temple Main"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-6 left-6 border-l-2 border-secondary pl-4">
                            <p className="text-white font-serif font-bold text-xl drop-shadow-md">Temple Architecture</p>
                        </div>
                    </motion.div>

                    {/* Smaller Images */}
                    {galleryImages.slice(1).map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-100 rounded-2xl overflow-hidden relative group shadow-md border border-secondary/10"
                        >
                            <Image
                                src={img}
                                alt={`Gallery image ${i + 1}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="px-10 py-3 border border-secondary text-secondary-dark font-bold rounded-full hover:bg-secondary hover:text-white transition-all uppercase tracking-widest text-sm shadow-sm">
                        {t.viewBtn}
                    </button>
                </div>
            </div>
        </section>
    );
}
