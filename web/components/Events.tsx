"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { events } from "@/lib/events-data";
import { getEventTranslation } from "@/lib/event-utils";

import GoldCurveSeparator from "./GoldCurveSeparator";
import EventDetailModal from "./EventDetailModal";
import type { Event } from "@/lib/events-data";

export default function Events() {
    const { language } = useLanguage();
    const t = translations[language].events;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [allEvents, setAllEvents] = useState<Event[]>(events);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                if (res.ok) {
                    const dbEvents = await res.json();
                    const normalizedEvents: Event[] = dbEvents.map((e: any) => {
                        const eventDate = new Date(e.date);
                        const now = new Date();
                        const isUpcoming = eventDate >= now;
                        return {
                            ...e,
                            date: eventDate,
                            image: e.imageUrl,
                            isUpcoming: isUpcoming,
                        };
                    });
                    setAllEvents([...events, ...normalizedEvents]);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);

    // Get only upcoming events and sort by date (nearest first)
    const upcomingEvents = allEvents
        .filter(e => e.isUpcoming)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Simple responsive handler
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setVisibleCards(1);
            else if (window.innerWidth < 1024) setVisibleCards(2);
            else setVisibleCards(4); // Force 4 on desktops (1024px+)
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, upcomingEvents.length - visibleCards);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    return (
        <section id="events" className="py-20 lg:py-24 bg-background-cream relative overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8 relative z-10">

                {/* Header Section - Compact Spacing */}
                <div className="text-center mb-6 space-y-2">
                    {/* 1. Lined "Events" Heading */}
                    <div className="flex items-center justify-center gap-4 text-secondary mb-2">
                        <span className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-transparent to-secondary" />
                        <span className="font-serif uppercase tracking-[0.2em] text-xs md:text-sm font-bold text-secondary-dark">{t.sectionTitle}</span>
                        <span className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-secondary to-transparent" />
                    </div>

                    {/* 2. Main Title */}
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-primary-dark leading-tight">
                        {t.title}
                    </h2>

                    {/* 3. Subtitle */}
                    <p className="font-serif italic text-lg md:text-xl text-secondary-dark/80">
                        {t.subtitle}
                    </p>
                </div>

                {/* Pill - Just above tiles with minimal gap */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <div className="px-5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm text-secondary-dark font-bold text-[10px] uppercase tracking-[0.15em] relative overflow-hidden">
                            <span className="relative z-10">{t.pill}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Carousel Section */}
                <div className="relative group/carousel max-w-[1400px] mx-auto mb-10"> {/* Reduced mb-20 -> mb-10 */}

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
                            className="flex gap-6 touch-pan-y"
                            animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            drag="x"
                            dragConstraints={{ left: -1000, right: 1000 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x;
                                if (swipe < -50 || velocity.x < -500) {
                                    nextSlide();
                                } else if (swipe > 50 || velocity.x > 500) {
                                    prevSlide();
                                }
                            }}
                        >
                            {upcomingEvents.map((event, idx) => {
                                const translatedEvent = getEventTranslation(event, language);
                                return (
                                    <motion.div
                                        key={event.id}
                                        style={{ minWidth: `calc((100% - ${(visibleCards - 1) * 16}px) / ${visibleCards})` }} /* Gap 16px (gap-4) */
                                        className="relative group flex-shrink-0"
                                    >
                                        <div className="h-full bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_8px_16px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
                                            <div className="absolute inset-0 texture-parchment opacity-40 pointer-events-none z-10 mix-blend-multiply" />

                                            {/* Image: Shortened h-36 */}
                                            <div className="h-36 w-full relative overflow-hidden border-b border-[#CFA14E]/50 flex-shrink-0">
                                                <Image
                                                    src={event.image}
                                                    alt={translatedEvent.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 25vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute top-2 right-2 bg-secondary text-primary-dark px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md z-20">
                                                    Upcoming
                                                </div>
                                            </div>

                                            {/* Content: Compact p-5 */}
                                            <div className="p-5 space-y-3 relative z-20 flex-1 flex flex-col items-center text-center">
                                                {/* Date Badge */}
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFFEF9] border border-[#CFA14E] px-3 py-1 rounded-lg shadow-md flex flex-col items-center min-w-[70px]">
                                                    <span className="text-[10px] font-bold text-secondary-dark uppercase">{event.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                    <span className="text-xl font-serif font-bold text-primary-dark">{event.date.getDate()}</span>
                                                </div>

                                                <div className="pt-4 space-y-2 flex-1 w-full flex flex-col justify-center">
                                                    <h3 className="text-lg font-serif font-bold text-primary-dark group-hover:text-[#8B5E3C] transition-colors line-clamp-2 leading-tight min-h-[3rem] flex items-center justify-center">
                                                        {translatedEvent.title}
                                                    </h3>
                                                    <div className="flex items-center justify-center gap-1.5 text-xs text-[#5D4037]/80">
                                                        <MapPin size={12} className="text-[#CFA14E]" />
                                                        <span className="line-clamp-1">{translatedEvent.location}</span>
                                                    </div>
                                                </div>

                                                {/* Button: Enlarged width & text */}
                                                <button
                                                    onClick={() => setSelectedEvent(event)}
                                                    className="mt-2 w-auto px-8 py-2.5 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-bold text-xs rounded-lg border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 transform uppercase tracking-widest"
                                                >
                                                    {t.register}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>

                <div className="flex justify-center mt-6"> {/* Reduced mt-12 -> mt-6 */}
                    <Link href="/events">
                        <button className="px-10 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2 group">
                            {t.viewAll}
                            <Calendar size={18} className="text-[#4A3225] group-hover:scale-105 transition-transform" />
                        </button>
                    </Link>
                </div>

                {/* Event Details Modal */}
                <AnimatePresence>
                    {selectedEvent && (
                        <EventDetailModal
                            event={selectedEvent}
                            onClose={() => setSelectedEvent(null)}
                        />
                    )}
                </AnimatePresence>

            </div>

            {/* Separator - Transitions to Gallery (Ivory) */}
            <GoldCurveSeparator fillColor="fill-[#FDFBF7]" />
        </section>
    );
}
