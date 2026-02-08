"use client";

import { motion } from "framer-motion";
import { X, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Event } from "@/lib/events-data";
import { getEventTranslation, getCategoryColor, getCategoryName } from "@/lib/event-utils";
import { useLanguage } from "@/context/LanguageContext";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface EventDetailModalProps {
    event: Event;
    onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
    const { language } = useLanguage();
    const translatedEvent = getEventTranslation(event, language);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Prevent background scrolling while modal is open
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header with Image */}
                <div className="relative h-64 overflow-hidden rounded-t-2xl flex-shrink-0">
                    <img src={event.image} alt={translatedEvent.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors z-20"
                    >
                        <X size={20} className="text-[#5D4037]" />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-20">
                        <div
                            className="px-4 py-1.5 rounded-full text-white text-xs font-bold tracking-wider uppercase backdrop-blur-sm"
                            style={{ backgroundColor: getCategoryColor(event.category) }}
                        >
                            {getCategoryName(event.category, language)}
                        </div>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                    <h2 className="font-cinzel-decorative font-bold text-3xl text-[#5D4037] mb-4">
                        {translatedEvent.title}
                    </h2>

                    {/* Event Info */}
                    <div className="flex flex-wrap gap-4 mb-6 text-[#5D4037]/80">
                        <div className="flex items-center gap-2">
                            <Calendar size={20} className="text-[#D4AF37]" />
                            <span className="font-medium">{event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={20} className="text-[#D4AF37]" />
                            <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={20} className="text-[#D4AF37]" />
                            <span>{translatedEvent.location}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="font-serif font-bold text-xl text-[#5D4037] mb-3">About This Event</h3>
                        <p className="text-[#5D4037]/80 leading-relaxed">
                            {translatedEvent.longDescription || translatedEvent.description}
                        </p>
                    </div>

                    {/* Speaker */}
                    {translatedEvent.speaker && (
                        <div className="mb-6">
                            <h3 className="font-serif font-bold text-xl text-[#5D4037] mb-2">Speaker</h3>
                            <p className="text-[#5D4037]/80">{translatedEvent.speaker}</p>
                        </div>
                    )}

                    {/* Agenda */}
                    {translatedEvent.agenda && translatedEvent.agenda.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-serif font-bold text-xl text-[#5D4037] mb-3">Event Schedule</h3>
                            <div className="space-y-3">
                                {translatedEvent.agenda.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-4 items-start">
                                        <div className="bg-[#D4AF37] text-white px-3 py-1 rounded-lg text-sm font-semibold min-w-[80px] text-center">
                                            {item.time}
                                        </div>
                                        <div className="text-[#5D4037]/80">{item.activity}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    {event.gallery && event.gallery.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-serif font-bold text-xl text-[#5D4037] mb-3">Photo Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {event.gallery.map((img, idx) => (
                                    <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="rounded-xl w-full h-40 object-cover" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    {event.isUpcoming && event.registrationOpen && (
                        <div className="flex justify-center pt-4">
                            <button className="px-10 py-3 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                                Register for Event <ArrowRight size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
