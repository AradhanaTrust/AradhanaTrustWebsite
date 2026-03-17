"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { events } from "@/lib/events-data";
import { getEventTranslation } from "@/lib/event-utils";
import GoldCurveSeparator from "./GoldCurveSeparator";
import EventDetailModal from "./EventDetailModal";
import type { Event } from "@/lib/events-data";
import { useRouter } from "next/navigation";

export default function Events() {
    const { language } = useLanguage();
    const router = useRouter();
    const t = translations[language].events;
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [allEvents, setAllEvents] = useState<Event[]>(events);

    const scrollRef = useRef<HTMLDivElement>(null);
    const isResetting = useRef(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                if (res.ok) {
                    const dbEvents = await res.json();
                    const normalizedEvents: Event[] = dbEvents.map((e: any) => {
                        const eventDate = new Date(e.date);
                        const now = new Date();
                        return {
                            ...e,
                            date: eventDate,
                            image: e.imageUrl,
                            isUpcoming: eventDate >= now,
                        };
                    });
                    setAllEvents(normalizedEvents);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
        };
        fetchEvents();
    }, []);

    // Get only upcoming events, sorted by nearest first
    const upcomingEvents = allEvents
        .filter(e => e.isUpcoming)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Triplicate for infinite looping
    const loopEvents = [...upcomingEvents, ...upcomingEvents, ...upcomingEvents];

    // Initialize scroll to center set once events load
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || upcomingEvents.length === 0) return;
        const setWidth = el.scrollWidth / 3;
        el.scrollLeft = setWidth;
    }, [upcomingEvents.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") scrollByOne(-1);
            if (e.key === "ArrowRight") scrollByOne(1);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Infinite loop: silently reset when scrolling into cloned zones
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

    const scrollByOne = (dir: 1 | -1) => {
        const el = scrollRef.current;
        if (!el || upcomingEvents.length === 0) return;
        const itemWidth = el.scrollWidth / loopEvents.length;
        el.scrollBy({ left: dir * itemWidth, behavior: "smooth" });
    };

    return (
        <section id="events" className="py-20 lg:py-24 bg-background-cream relative overflow-hidden">
            <div className="container-gold relative z-10">

                {/* Header */}
                <div className="text-center mb-6 space-y-2">
                    <div className="flex items-center justify-center gap-4 text-secondary mb-2">
                        <span className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-transparent to-secondary" />
                        <span className="font-serif uppercase tracking-[0.2em] text-xs md:text-sm font-bold text-secondary-dark">{t.sectionTitle}</span>
                        <span className="h-[1.5px] w-12 md:w-16 bg-gradient-to-r from-secondary to-transparent" />
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-primary-dark leading-tight">
                        {t.title}
                    </h2>
                    <p className="font-serif italic text-lg md:text-xl text-secondary-dark/80">
                        {t.subtitle}
                    </p>
                </div>

                {/* Pill */}
                <div className="text-center mb-8">
                    <div className="inline-block">
                        <div className="px-5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm text-secondary-dark font-bold text-[10px] uppercase tracking-[0.15em] relative overflow-hidden">
                            <span className="relative z-10">{t.pill}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Carousel */}
                <div className="relative group/carousel max-w-[1400px] mx-auto mb-10">

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
                        CSS Scroll Snap Track
                        - scroll-snap-type: x mandatory = snap to each item
                        - scroll-snap-align: center on items = browser centers each tile natively
                        - No JS math needed, works on all devices including iOS Safari
                    */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="relative flex gap-4 md:gap-6 overflow-x-auto py-4 -my-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
                    >
                        {loopEvents.map((event, idx) => {
                            const translatedEvent = getEventTranslation(event, language);
                            return (
                                <div
                                    key={`${event.id}-${idx}`}
                                    className="flex-shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] relative group"
                                    style={{ scrollSnapAlign: "center" }}
                                >
                                    <div className="h-full bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_8px_16px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
                                        <div className="absolute inset-0 texture-parchment opacity-40 pointer-events-none z-10 mix-blend-multiply" />

                                        {/* Image */}
                                        <div className="h-32 sm:h-36 w-full relative overflow-hidden border-b border-[#CFA14E]/50 flex-shrink-0">
                                            <img
                                                src={event.image}
                                                alt={translatedEvent.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-20">
                                                <div className="bg-secondary text-primary-dark px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md">
                                                    Upcoming
                                                </div>
                                                {event.isFeatured && (
                                                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-md flex items-center gap-1 border border-[#FFFDF8]/30">
                                                        <span>⭐</span> {language === 'kn' ? 'ವಿಶೇಷ' : 'Featured'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 space-y-3 relative z-20 flex-1 flex flex-col items-center text-center">
                                            {/* Date Badge */}
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#FFFEF9] border border-[#CFA14E] px-3 py-1 rounded-lg shadow-md flex flex-col items-center min-w-[70px]">
                                                <span className="text-[10px] font-bold text-secondary-dark uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-xl font-serif font-bold text-primary-dark">{new Date(event.date).getDate()}</span>
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

                                            <button
                                                onClick={() => {
                                                    if (event.isFeatured) {
                                                        router.push('/events/featured');
                                                    } else {
                                                        setSelectedEvent(event);
                                                    }
                                                }}
                                                className="mt-2 w-auto px-8 py-2.5 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-bold text-xs rounded-lg border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-95 transition-all duration-300 transform uppercase tracking-widest"
                                            >
                                                {t.register}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-center mt-6">
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

            {/* Separator */}
            <GoldCurveSeparator fillColor="fill-[#FDFBF7]" />
        </section>
    );
}
