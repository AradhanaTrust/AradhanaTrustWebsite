"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import GoldCurveSeparator from "./GoldCurveSeparator";

const galleryImages = [
    "/assets/gallery-1.png",
    "/assets/gallery-2.png",
    "/assets/gallery-3.png",
    "/assets/gallery-4.png",
    "/assets/gallery-5.png",
];

export default function Gallery() {
    const { language } = useLanguage();
    const t = translations[language].gallery;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);

    // Responsive Carousel Logic
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleCards(1);
            else if (window.innerWidth < 1024) setVisibleCards(2);
            else setVisibleCards(4); // 4 Cards on Desktop
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, galleryImages.length - visibleCards);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    return (
        <section id="gallery" className="pt-20 pb-10 lg:pt-24 lg:pb-12 bg-background-ivory relative overflow-hidden text-primary">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-mandala-premium opacity-[0.03] animate-spin-slow pointer-events-none" />

            <div className="container mx-auto px-4 lg:px-8 relative z-10">

                {/* Header Section - Standardized Lined Style */}
                <div className="text-center mb-12 space-y-4">
                    <div className="flex items-center justify-center gap-4 text-secondary mb-2">
                        <span className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-transparent to-secondary" />
                        <span className="font-serif uppercase tracking-[0.2em] text-xs md:text-sm font-bold text-secondary-dark">{t.subtitle}</span>
                        <span className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-secondary to-transparent" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-medium text-primary-dark leading-tight">
                        {t.title}
                    </h2>
                </div>

                {/* Carousel Section */}
                <div className="relative group/carousel max-w-[1400px] mx-auto mb-16">

                    {/* Left Button */}
                    <button
                        onClick={prevSlide}
                        className="absolute -left-2 md:-left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-[#FFFEF9] border border-[#CFA14E] text-[#4A3225] shadow-lg hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Button */}
                    <button
                        onClick={nextSlide}
                        className="absolute -right-2 md:-right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-[#FFFEF9] border border-[#CFA14E] text-[#4A3225] shadow-lg hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Track */}
                    <div className="overflow-hidden px-1 py-4 -my-4">
                        <motion.div
                            className="flex gap-6"
                            animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            {galleryImages.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    style={{ minWidth: `calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})` }}
                                    className="relative flex-shrink-0"
                                >
                                    {/* Temple-Inspired Frame (Dravidian Style) */}
                                    <div className="group relative pt-4 pb-6 px-3 bg-gradient-to-b from-[#F9F1D8] to-[#D4B483] rounded-sm shadow-2xl border-x-2 border-[#CFA14E]">

                                        {/* Top Molding (Mimics Base) */}
                                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#CFA14E] to-[#8B5E3C] border-b border-[#FFFDF8]/30 flex justify-center gap-1 items-center z-10">
                                            {/* Decorative top dots */}
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        </div>

                                        {/* Pillar Elements (Sides) */}
                                        <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-[#8B5E3C] to-[#CFA14E] border-r border-[#4A3225]/20" />
                                        <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-[#8B5E3C] to-[#CFA14E] border-l border-[#4A3225]/20" />

                                        {/* Inner Sanctum (Image Container) */}
                                        <div className="relative bg-[#4A3225] p-1.5 shadow-inner">
                                            <div className="relative h-64 w-full overflow-hidden border border-[#CFA14E]/50 rounded-[2px]">
                                                <Image
                                                    src={img}
                                                    alt={`Gallery Image ${idx + 1}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                {/* Vignette */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                                            </div>
                                        </div>

                                        {/* Base (Adhisthana) */}
                                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-[#CFA14E] to-[#8B5E3C] border-t border-[#FFFDF8]/30 flex justify-center gap-1 items-center">
                                            {/* Decorative base dots */}
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* View Gallery Button (Premium) */}
                <div className="flex justify-center">
                    <button className="px-10 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2 group">
                        {t.viewBtn}
                        <ImageIcon size={18} className="text-[#4A3225] group-hover:scale-105 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
}
