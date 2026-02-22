"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Heart, Share2, Check } from "lucide-react";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import type { Event } from "@/lib/events-data";
import { useLanguage } from "@/context/LanguageContext";
import { getEventTranslation, getCategoryName } from "@/lib/event-utils";
import { motion } from "framer-motion";

interface FeaturedEventClientProps {
    event: Event;
}

export default function FeaturedEventClient({ event }: FeaturedEventClientProps) {
    const { language } = useLanguage();
    const translatedEvent = getEventTranslation(event, language);

    // Format date string safely from potentially serialized Date
    const eventDate = new Date(event.date);
    const dateFormatted = eventDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const isUpcoming = eventDate >= new Date();

    const [isCopied, setIsCopied] = useState(false);

    // Helper to reliably parse YouTube URLs to embed format
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&rel=0`;
        }
        return url;
    };

    const handleShare = async () => {
        const shareData = {
            title: translatedEvent.title,
            text: translatedEvent.description.substring(0, 100) + '...',
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy!", err);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                {/* Hero Section - Matching About Us/Events Layout exactly */}
                <section className="relative pt-24 pb-32 md:pt-32 md:pb-36 lg:pt-40 lg:pb-40 overflow-hidden bg-[#FDFBF7] min-h-[85vh] flex flex-col">
                    {/* Background - Mandala Overlay Only */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                    </div>

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 via-[#FDFBF7]/30 to-[#FDFBF7]/90 pointer-events-none" />

                    <div className="container-gold relative z-10 w-full my-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center">

                            {/* LEFT CONTENT */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="text-center space-y-6 order-1 lg:order-1 flex flex-col items-center justify-center h-full pt-8 lg:pt-0"
                            >
                                {/* Decorative Line */}
                                <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium">
                                    <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                                    <span className="font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63]">
                                        {language === "kn" ? "ವಿಶೇಷ" : "FEATURED"} {getCategoryName(event.category, language).toUpperCase()}
                                    </span>
                                    <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
                                </div>

                                {/* Main Heading */}
                                <h1 className="font-cinzel-decorative font-bold leading-tight drop-shadow-sm filter">
                                    <span className="block text-4xl md:text-5xl lg:text-6xl text-[#D4AF37]">
                                        {translatedEvent.title.split(' ')[0] || translatedEvent.title}
                                    </span>
                                    {translatedEvent.title.split(' ').length > 1 && (
                                        <span className="block text-2xl md:text-3xl lg:text-4xl text-[#D4AF37] mt-2 tracking-widest">
                                            {translatedEvent.title.split(' ').slice(1).join(' ')}
                                        </span>
                                    )}
                                </h1>

                                <div className="flex flex-wrap justify-center gap-6 text-[#5D4037] font-serif text-lg md:text-xl mb-6 font-medium">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-6 h-6 text-[#D4AF37]" />
                                        <span>{dateFormatted}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-[#D4AF37]" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-[#D4AF37]" />
                                        <span>{translatedEvent.location}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4 pt-4 pb-10 lg:pb-0">
                                    {isUpcoming && event.registrationOpen && (
                                        <a href="#register" className="min-h-[44px] px-6 py-3 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-base rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2">
                                            {language === "kn" ? "ನೋಂದಣಿ ಮಾಡಿ" : "Register Now"}
                                        </a>
                                    )}
                                    <button
                                        className={`min-h-[44px] px-6 py-3 bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] text-[#4A3225] font-medium text-base rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_4px_8px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 ${isCopied ? 'bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] border-[#4CAF50] text-[#2E7D32]' : ''}`}
                                        onClick={handleShare}
                                    >
                                        {isCopied ? (
                                            <>
                                                <Check className="w-5 h-5 text-[#4CAF50]" />
                                                {language === "kn" ? "ಕಾಪಿಯಾಗಿದೆ!" : "Copied!"}
                                            </>
                                        ) : (
                                            <>
                                                <Share2 className="w-5 h-5 text-[#D4AF37]" />
                                                {language === "kn" ? "ಹಂಚಿಕೊಳ್ಳಿ" : "Share Event"}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* RIGHT IMAGE / VIDEO - Hero Style */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-video order-2 flex justify-center lg:justify-end items-center mt-8 lg:mt-0"
                            >
                                {/* Media Container with Elegant Rectangular Border */}
                                <div className="relative w-full h-full mx-auto lg:ml-auto lg:mr-0 group">
                                    {/* Outer Glow/Shadow */}
                                    <div className="absolute inset-4 rounded-3xl bg-[#D4AF37]/20 blur-xl transform translate-y-4" />

                                    {/* Main Media Container with Border */}
                                    <div className="relative h-full w-full rounded-3xl overflow-hidden border-[4px] md:border-[6px] border-double border-[#D4AF37]/40 shadow-2xl bg-[#FFFDF9]">
                                        {/* Inner Gold Border */}
                                        <div className="absolute inset-2 rounded-[1rem] md:rounded-[1.25rem] border-2 border-[#D4AF37] pointer-events-none z-20 opacity-60" />

                                        {event.videoUrl ? (
                                            <iframe
                                                src={getYouTubeEmbedUrl(event.videoUrl)}
                                                className="absolute inset-0 w-full h-full z-10"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <>
                                                <Image
                                                    src={event.imageUrl || event.image}
                                                    alt={translatedEvent.title}
                                                    fill
                                                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000 z-10"
                                                    priority
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                {/* Vignette for Depth on Image */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/40 via-transparent to-transparent pointer-events-none z-10" />
                                            </>
                                        )}
                                    </div>

                                    {/* Decorative Corners */}
                                    <div className="absolute -top-2 -left-2 w-10 h-10 md:w-12 md:h-12 bg-[#FDFBF7] rounded-full z-30 flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md md:drop-shadow-lg">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#D4AF37]" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-[#FDFBF7] rounded-full z-30 flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md md:drop-shadow-lg">
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-[#D4AF37]" />
                                    </div>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                    <GoldCurveSeparator fillColor="fill-[#FDFBF7]" />
                </section>

                {/* Event Details Content */}
                <section className="bg-[#FDFBF7] relative min-h-[50vh] pt-12 md:pt-16 lg:pt-24 pb-16">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-[0.03] animate-spin-slow pointer-events-none mix-blend-multiply" />
                    </div>

                    {/* Increased side margins to match EventsPage grid */}
                    <div className="container mx-auto px-4 lg:px-12 relative z-10 w-full overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">

                            <div className="lg:col-span-7 xl:col-span-8 space-y-16">
                                {/* Description & Conditional Image */}
                                <div className="clear-both">
                                    <div className="flex items-center justify-center gap-4 mb-12">
                                        <div className="h-[2px] w-16 md:w-24 bg-gradient-to-l from-[#D4AF37] to-transparent" />
                                        <h2 className="text-3xl md:text-4xl font-cinzel-decorative font-bold text-[#5D4037] text-center leading-tight py-2">
                                            {language === "kn" ? "ಕಾರ್ಯಕ್ರಮದ ಬಗ್ಗೆ" : "About the Event"}
                                        </h2>
                                        <div className="h-[2px] w-16 md:w-24 bg-gradient-to-r from-[#D4AF37] to-transparent" />
                                    </div>

                                    {event.videoUrl ? (
                                        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                                            <div className="prose prose-lg prose-brown max-w-none text-gray-700 leading-relaxed font-serif whitespace-pre-wrap text-left">
                                                {translatedEvent.description}
                                            </div>
                                            {/* Rectangular Image Frame */}
                                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg md:shadow-xl border-[3px] md:border-4 border-[#D4AF37]/30 group lg:sticky lg:top-32 mb-6 lg:mb-0">
                                                <Image
                                                    src={event.imageUrl || event.image}
                                                    alt={translatedEvent.title}
                                                    fill
                                                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/20 via-transparent to-transparent pointer-events-none z-10" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="prose prose-lg prose-brown max-w-none text-gray-700 leading-relaxed font-serif whitespace-pre-wrap text-left">
                                            {translatedEvent.description}
                                        </div>
                                    )}
                                </div>

                                {/* Registration Form Moved Here */}
                                {isUpcoming && event.registrationOpen && (
                                    <div id="register" className="pt-8 border-t border-[#D4AF37]/20">
                                        <div className="flex items-center justify-center gap-4 mb-8">
                                            <div className="h-[2px] w-16 md:w-24 bg-gradient-to-l from-[#D4AF37] to-transparent" />
                                            <h2 className="text-3xl md:text-4xl font-cinzel-decorative font-bold text-[#5D4037] text-center">
                                                {language === "kn" ? "ನೋಂದಣಿ" : "Registration"}
                                            </h2>
                                            <div className="h-[2px] w-16 md:w-24 bg-gradient-to-r from-[#D4AF37] to-transparent" />
                                        </div>
                                        <EventRegistrationForm event={event} />
                                    </div>
                                )}


                            </div>

                            {/* Right Column: Registration / Details Card */}
                            <div className="lg:col-span-5 xl:col-span-4 lg:pl-4 xl:pl-8">
                                <div className="sticky top-32 bg-white rounded-3xl shadow-2xl border border-[#D4AF37]/20 p-8 overflow-hidden max-w-lg mx-auto w-full">
                                    {/* Card Header Background Detail */}
                                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#F2C96D]/10 to-[#9E731C]/10 rounded-t-3xl border-b border-[#D4AF37]/10" />

                                    <div className="relative z-10">
                                        <h3 className="text-2xl font-cinzel-decorative font-bold text-[#5D4037] mb-6 text-center">
                                            {language === "kn" ? "ವಿವರಗಳು" : "Event Details"}
                                        </h3>

                                        <div className="space-y-6 mb-8">
                                            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#5D4037]/10">
                                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                                    <MapPin className="text-[#D4AF37] w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-sm text-[#8D6E63] font-bold uppercase tracking-widest mb-1">{language === "kn" ? "ಸ್ಥಳ" : "Venue"}</span>
                                                    <span className="text-[#4A3225] font-serif font-medium leading-tight">{translatedEvent.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#5D4037]/10">
                                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                                    <Clock className="text-[#D4AF37] w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-sm text-[#8D6E63] font-bold uppercase tracking-widest mb-1">{language === "kn" ? "ಸಮಯ" : "Time"}</span>
                                                    <span className="text-[#4A3225] font-serif font-medium">{event.time}</span>
                                                </div>
                                            </div>
                                            {event.capacity && (
                                                <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#5D4037]/10">
                                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                                        <Users className="text-[#D4AF37] w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <span className="block text-sm text-[#8D6E63] font-bold uppercase tracking-widest mb-1">{language === "kn" ? "ಸಾಮರ್ಥ್ಯ" : "Capacity"}</span>
                                                        <span className="text-[#4A3225] font-serif font-medium">{event.capacity} {language === "kn" ? "ಆಸನಗಳು" : "Seating"}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
