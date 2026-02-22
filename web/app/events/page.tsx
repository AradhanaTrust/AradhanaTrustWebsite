"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Clock, X, Loader2 } from "lucide-react";
import { events as staticEvents } from "@/lib/events-data";
import type { Event } from "@/lib/events-data";
import { getEventTranslation, getCategoryName, getCategoryColor } from "@/lib/event-utils";
import Link from "next/link";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";
import EventDetailModal from "@/components/EventDetailModal";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";


export default function EventsPage() {
    const { language } = useLanguage();
    const router = useRouter();
    const t = translations[language].eventsPage;
    const [showUpcoming, setShowUpcoming] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [allEvents, setAllEvents] = useState<Event[]>(staticEvents);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events");
                if (res.ok) {
                    const dbEvents = await res.json();

                    // Normalize DB events to match Event interface
                    const normalizedEvents: Event[] = dbEvents.map((e: any) => {
                        const eventDate = new Date(e.date);
                        const now = new Date();
                        now.setHours(0, 0, 0, 0); // Normalize 'now' to start of today

                        // Compare normalized dates (ignoring time) or check if event is today or future
                        const isUpcoming = new Date(eventDate).setHours(0, 0, 0, 0) >= now.getTime();

                        return {
                            ...e,
                            date: eventDate,
                            image: e.imageUrl, // Map imageUrl to image
                            isUpcoming: isUpcoming,
                            // Ensure other required fields are present if missing from DB (shouldn't be based on schema)
                        };
                    });

                    setAllEvents(normalizedEvents);
                }
            } catch (error) {
                console.error("Failed to fetch events", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Sort upcoming events by date (nearest first), past events by date (most recent first)
    const upcomingEvents = allEvents
        .filter(e => e.isUpcoming)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const pastEvents = allEvents
        .filter(e => !e.isUpcoming)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <Header />

            {/* Hero Section - Matching About Us Layout */}
            <div className="relative pt-32 pb-48 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FDFBF7] min-h-[85vh] flex items-center">
                {/* Background - Mandala Overlay Only */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 via-[#FDFBF7]/30 to-[#FDFBF7]/90 pointer-events-none" />

                <div className="container-gold relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-0 items-center">

                        {/* LEFT CONTENT */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6 order-1 lg:order-1 flex flex-col items-center justify-center h-full"
                        >
                            {/* Decorative Line */}
                            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium">
                                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                                <span className="font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63]">{t.hero.tagline}</span>
                                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
                            </div>

                            {/* Main Heading */}
                            <h1 className="font-cinzel-decorative font-bold leading-tight drop-shadow-sm filter">
                                <span className="block text-4xl md:text-5xl lg:text-6xl text-[#D4AF37]">
                                    {t.hero.title1}
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-4xl text-[#D4AF37] mt-2 tracking-widest">
                                    {t.hero.title2}
                                </span>
                            </h1>

                            <p className="font-serif text-lg md:text-xl text-[#5D4037] w-full leading-relaxed font-medium px-4 lg:px-0">
                                {t.hero.description}
                            </p>

                            {/* Toggle Buttons - Matching Hero Button Style */}
                            <div className="flex gap-4 justify-center pt-4 pb-10 lg:pb-0">
                                <button
                                    onClick={() => setShowUpcoming(true)}
                                    className={`min-h-[44px] px-6 py-3 font-medium text-base rounded-xl border transition-all duration-300 transform flex items-center justify-center gap-2 ${showUpcoming
                                        ? 'bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                                        : 'bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1'
                                        }`}
                                >
                                    {t.buttons.upcomingEvents}
                                </button>
                                <button
                                    onClick={() => setShowUpcoming(false)}
                                    className={`min-h-[44px] px-6 py-3 font-medium text-base rounded-xl border transition-all duration-300 transform flex items-center justify-center gap-2 ${!showUpcoming
                                        ? 'bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
                                        : 'bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1'
                                        }`}
                                >
                                    {t.buttons.pastEvents}
                                </button>
                            </div>
                        </motion.div>

                        {/* RIGHT IMAGE - Ganesh */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full order-2 lg:order-2 flex justify-center lg:justify-end items-center"
                        >
                            {/* Image Container with Temple Border */}
                            <div className="relative w-full max-w-sm h-full">
                                {/* Outer Glow/Shadow */}
                                <div className="absolute inset-4 rounded-t-full bg-[#D4AF37]/20 blur-xl transform translate-y-4" />

                                {/* Main Image Container with Temple Border */}
                                <div className="relative h-full w-full rounded-t-full overflow-hidden border-[6px] border-double border-[#D4AF37]/40 shadow-2xl bg-[#FFFDF9]">
                                    {/* Inner Gold Border */}
                                    <div className="absolute inset-2 rounded-t-full border-2 border-[#D4AF37] pointer-events-none z-20 opacity-60" />

                                    <img
                                        src="/assets/event-ganesh.png"
                                        alt="Lord Ganesh"
                                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
                                    />

                                    {/* Vignette for Depth */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/40 via-transparent to-transparent pointer-events-none z-10" />
                                </div>

                                {/* Decorative Keystone Element */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-lg z-30">
                                    <Calendar className="text-[#D4AF37] w-7 h-7" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* Gold Curve Separator */}
                <GoldCurveSeparator fillColor="fill-[#FFFDF9]" />
            </div>

            {/* Events Grid */}
            <section className="py-24 bg-background-ivory">
                <div className="container mx-auto px-4 lg:px-12">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37]" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(showUpcoming ? upcomingEvents : pastEvents).map((event, idx) => {
                                const translatedEvent = getEventTranslation(event, language);
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer ${event.isFeatured ? 'ring-2 ring-[#D4AF37] ring-offset-2' : ''}`}
                                        onClick={() => {
                                            if (event.isFeatured) {
                                                router.push('/events/featured');
                                            } else {
                                                setSelectedEvent(event);
                                            }
                                        }}
                                    >
                                        {/* Event Image */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={event.image} alt={translatedEvent.title} className="w-full h-full object-cover" />
                                            {event.isFeatured && (
                                                <div className="absolute inset-0 border-4 border-[#D4AF37]/50 pointer-events-none" />
                                            )}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <div
                                                    className="px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wider uppercase backdrop-blur-sm shadow-md"
                                                    style={{ backgroundColor: getCategoryColor(event.category) }}
                                                >
                                                    {getCategoryName(event.category, language)}
                                                </div>
                                                {event.isFeatured && (
                                                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase shadow-lg border border-[#FFFDF8]/30 flex items-center gap-1 w-fit">
                                                        <span>⭐</span> {language === 'kn' ? 'ವಿಶೇಷ' : 'Featured Event'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
                                                <div className="text-2xl font-bold text-[#D4AF37]">{(event.date as Date).getDate()}</div>
                                                <div className="text-xs font-semibold text-[#5D4037]">
                                                    {(event.date as Date).toLocaleDateString('en-US', { month: 'short' })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Event Content */}
                                        <div className="p-6">
                                            <h3 className="font-serif font-bold text-xl text-[#5D4037] mb-3">
                                                {translatedEvent.title}
                                            </h3>

                                            <div className="space-y-2 text-sm text-[#5D4037]/70 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-[#D4AF37]" />
                                                    <span>{event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} className="text-[#D4AF37]" />
                                                    <span>{translatedEvent.location}</span>
                                                </div>

                                            </div>

                                            <p className="text-[#5D4037]/60 text-sm mb-4 line-clamp-2">
                                                {translatedEvent.description}
                                            </p>

                                            <div className="flex justify-center">
                                                {event.isUpcoming && event.registrationOpen ? (
                                                    <button className="px-6 py-2.5 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-sm rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                                                        {t.buttons.registerNow} <ArrowRight size={16} />
                                                    </button>
                                                ) : (
                                                    <button className="px-6 py-2.5 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-sm rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                                                        {t.buttons.viewDetails} <ArrowRight size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* No events message */}
                    {!isLoading && (showUpcoming ? upcomingEvents : pastEvents).length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-[#5D4037]/60 text-lg">No {showUpcoming ? 'upcoming' : 'past'} events found.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <EventDetailModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                    />
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}
