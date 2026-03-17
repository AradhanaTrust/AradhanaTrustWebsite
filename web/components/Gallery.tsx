"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
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

    // Triplicate for infinite looping
    const loopImages = [...allImages, ...allImages, ...allImages];

    const scrollRef = useRef<HTMLDivElement>(null);
    const isResetting = useRef(false);

    // Initialize scroll position to the center set (set 2 of 3)
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || allImages.length === 0) return;
        // Each set is 1/3 of total scroll width
        const setWidth = el.scrollWidth / 3;
        el.scrollLeft = setWidth;
    }, [allImages.length]);

    // Infinite loop: when scrolling into cloned zones, silently reset to center set
    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || isResetting.current) return;
        const setWidth = el.scrollWidth / 3;
        if (el.scrollLeft < setWidth * 0.4) {
            isResetting.current = true;
            el.scrollLeft += setWidth;
            setTimeout(() => { isResetting.current = false; }, 50);
        } else if (el.scrollLeft > setWidth * 2.6) {
            isResetting.current = true;
            el.scrollLeft -= setWidth;
            setTimeout(() => { isResetting.current = false; }, 50);
        }
    };

    // Scroll by exactly one item width
    const scrollByOne = (dir: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        const itemWidth = el.scrollWidth / loopImages.length;
        el.scrollBy({ left: dir * itemWidth, behavior: "smooth" });
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") scrollByOne(-1);
            if (e.key === "ArrowRight") scrollByOne(1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <section id="gallery" className="pt-20 pb-10 lg:pt-24 lg:pb-12 bg-background-ivory relative overflow-hidden text-primary">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-mandala-premium opacity-[0.03] animate-spin-slow pointer-events-none" />

            <div className="container-gold relative z-10">

                {/* Header */}
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

                {/* Carousel */}
                <div className="relative group/carousel max-w-[1400px] mx-auto mb-16">

                    {/* Left Arrow */}
                    <button
                        onClick={() => scrollByOne(-1)}
                        className="absolute -left-2 md:-left-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-[#FFFEF9] border border-[#CFA14E] text-[#4A3225] shadow-lg hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={() => scrollByOne(1)}
                        className="absolute -right-2 md:-right-8 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-[#FFFEF9] border border-[#CFA14E] text-[#4A3225] shadow-lg hover:scale-110 active:scale-95 transition-all md:opacity-0 md:group-hover/carousel:opacity-100"
                        aria-label="Next"
                    >
                        <ChevronRight size={20} />
                    </button>

                    {/*
                        CSS Scroll Snap Track (industry-standard approach: Netflix, Airbnb, etc.)
                        - overflow-x scroll + snap-x mandatory = browser handles centering natively
                        - No JS math, no measurement, works perfectly on iOS/Android
                        - [scrollbar-width:none] hides the scrollbar on Firefox
                        - webkit-scrollbar:hidden hides it on Chrome/Safari
                    */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="relative flex gap-4 md:gap-6 overflow-x-auto py-4 -my-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                    >
                        {loopImages.map((img, idx) => (
                            <div
                                key={idx}
                                className="flex-shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
                                style={{ scrollSnapAlign: "center" }}
                            >
                                {/* Temple-Inspired Frame (Dravidian Style) */}
                                <div className="group relative pt-4 pb-6 px-3 bg-gradient-to-b from-[#F9F1D8] to-[#D4B483] rounded-sm shadow-2xl border-x-2 border-[#CFA14E]">

                                    {/* Top Molding */}
                                    <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#CFA14E] to-[#8B5E3C] border-b border-[#FFFDF8]/30 flex justify-center gap-1 items-center z-10">
                                        <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                    </div>

                                    {/* Pillar Elements */}
                                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-[#8B5E3C] to-[#CFA14E] border-r border-[#4A3225]/20" />
                                    <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-[#8B5E3C] to-[#CFA14E] border-l border-[#4A3225]/20" />

                                    {/* Inner Sanctum (Image) */}
                                    <div className="relative bg-[#4A3225] p-1.5 shadow-inner">
                                        <div className="relative h-48 sm:h-56 w-full overflow-hidden border border-[#CFA14E]/50 rounded-[2px]">
                                            <img
                                                src={img}
                                                alt={`Gallery Image ${(idx % allImages.length) + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                                        </div>
                                    </div>

                                    {/* Base (Adhisthana) */}
                                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-[#CFA14E] to-[#8B5E3C] border-t border-[#FFFDF8]/30 flex justify-center gap-1 items-center">
                                        <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View Gallery Button */}
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
