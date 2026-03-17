"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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

interface GalleryProps {
    dbImages?: string[];
}

export default function Gallery({ dbImages = [] }: GalleryProps) {
    const { language } = useLanguage();
    const t = translations[language].gallery;
    const allImages = [...dbImages, ...galleryImages];
    const [currentIndex, setCurrentIndex] = useState(allImages.length);
    const [visibleCards, setVisibleCards] = useState(4);
    const [isTeleporting, setIsTeleporting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const touchStartX = useRef(0);
    const touchDelta = useRef(0);

    // Clone images for infinite loop
    const loopImages = [...allImages, ...allImages, ...allImages];

    // Responsive + container measurement
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            const mobile = w < 640;
            const tablet = w < 1024;
            setIsMobile(mobile || tablet);
            if (mobile) setVisibleCards(1.15);
            else if (tablet) setVisibleCards(2.2);
            else setVisibleCards(4);

            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    // Measure container after first render
    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, []);

    // Pixel-based offset calculation
    const gap = 24; // gap-6 = 24px
    const itemWidth = containerWidth > 0
        ? (containerWidth - gap * (visibleCards - 1)) / visibleCards
        : 0;
    const centerOffset = containerWidth > 0 && isMobile
        ? (containerWidth - itemWidth) / 2
        : 0;
    const xOffset = `-${currentIndex * (itemWidth + gap) - centerOffset}px`;

    // Teleportation logic to handle seamless looping
    const handleAnimationComplete = () => {
        if (currentIndex >= allImages.length * 2) {
            setIsTeleporting(true);
            setCurrentIndex(currentIndex - allImages.length);
        } else if (currentIndex < allImages.length) {
            setIsTeleporting(true);
            setCurrentIndex(currentIndex + allImages.length);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prevSlide();
            if (e.key === "ArrowRight") nextSlide();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isTeleporting, allImages.length]);

    // Reset teleporting state after index update
    useEffect(() => {
        if (isTeleporting) {
            const timer = setTimeout(() => setIsTeleporting(false), 50);
            return () => clearTimeout(timer);
        }
    }, [isTeleporting]);

    const nextSlide = () => {
        if (isTeleporting) return;
        setCurrentIndex((prev) => prev + 1);
    };

    const prevSlide = () => {
        if (isTeleporting) return;
        setCurrentIndex((prev) => prev - 1);
    };


    return (
        <section id="gallery" className="pt-20 pb-10 lg:pt-24 lg:pb-12 bg-background-ivory relative overflow-hidden text-primary">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-mandala-premium opacity-[0.03] animate-spin-slow pointer-events-none" />

            <div className="container-gold relative z-10">

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

                    {/* Left Button - Premium Hover Style */}
                    <button
                        onClick={prevSlide}
                        className="absolute -left-2 md:-left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-[#FFFEF9] border border-[#CFA14E] text-[#4A3225] shadow-lg hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Button - Premium Hover Style */}
                    <button
                        onClick={nextSlide}
                        className="absolute -right-2 md:-right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-[#FFFEF9] border border-[#CFA14E] text-[#4A3225] shadow-lg hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/* Track wrapper with swipe detection */}
                    <div
                        ref={containerRef}
                        className="overflow-hidden px-1 py-4 -my-4"
                        onTouchStart={(e) => {
                            touchStartX.current = e.touches[0].clientX;
                            touchDelta.current = 0;
                        }}
                        onTouchMove={(e) => {
                            touchDelta.current = e.touches[0].clientX - touchStartX.current;
                        }}
                        onTouchEnd={() => {
                            const delta = touchDelta.current;
                            if (delta < -40) nextSlide();
                            else if (delta > 40) prevSlide();
                            touchDelta.current = 0;
                        }}
                        onMouseDown={(e) => {
                            touchStartX.current = e.clientX;
                            touchDelta.current = 0;
                        }}
                        onMouseMove={(e) => {
                            if (e.buttons === 1) touchDelta.current = e.clientX - touchStartX.current;
                        }}
                        onMouseUp={() => {
                            const delta = touchDelta.current;
                            if (delta < -40) nextSlide();
                            else if (delta > 40) prevSlide();
                            touchDelta.current = 0;
                        }}
                    >
                        <motion.div
                            className="flex gap-6 select-none"
                            animate={{ x: xOffset }}
                            transition={isTeleporting ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
                            onAnimationComplete={handleAnimationComplete}
                        >
                            {loopImages.map((img, idx) => (
                                <motion.div
                                    key={idx}
                                    style={{ 
                                        flex: `0 0 calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`,
                                        width: `calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`,
                                        minWidth: `calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`,
                                        maxWidth: `calc((100% - ${(visibleCards - 1) * 24}px) / ${visibleCards})`
                                    }}
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
                                            <div className="relative h-48 sm:h-56 w-full overflow-hidden border border-[#CFA14E]/50 rounded-[2px]">
                                                <img
                                                    src={img}
                                                    alt={`Gallery Image ${idx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
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
                    <Link href="/gallery">
                        <button className="px-10 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2 group">
                            {t.viewBtn}
                            <ImageIcon size={18} className="text-[#4A3225] group-hover:scale-105 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
