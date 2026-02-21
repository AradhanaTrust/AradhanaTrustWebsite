"use client";

import { motion } from "framer-motion";
import { X, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { registerForFreeEvent } from "@/app/actions/event-registration";
import { Event } from "@/lib/events-data";
import { getEventTranslation, getCategoryColor, getCategoryName } from "@/lib/event-utils";
import { useLanguage } from "@/context/LanguageContext";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import RazorpayButton from "./RazorpayButton";

interface EventDetailModalProps {
    event: Event;
    onClose: () => void;
}

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
    const { language } = useLanguage();
    const translatedEvent = getEventTranslation(event, language);
    const [mounted, setMounted] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        organisation: "",
        referredBy: ""
    });
    const [donationAmount, setDonationAmount] = useState(0);
    const [customDonation, setCustomDonation] = useState("");

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
                            <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                                {translatedEvent.agenda.map((item: { time: string; activity: string }, idx: number) => (
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

                    {/* Registration Section */}
                    {event.isUpcoming && event.registrationOpen && (
                        <div className="border-t border-[#D4AF37]/20 pt-8 mt-8">
                            {!showRegistration ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="text-center mb-4">
                                        <div className="text-lg font-semibold text-[#5D4037]">Registration Fee</div>
                                        <div className="text-3xl font-bold text-[#D4AF37]">
                                            {event.price ? `₹${event.price}` : 'Free'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowRegistration(true)}
                                        className="px-10 py-3 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                                    >
                                        Register Now <ArrowRight size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#D4AF37]/30 shadow-inner">
                                    <h3 className="font-cinzel-decorative font-bold text-2xl text-[#5D4037] mb-8 text-center border-b border-[#D4AF37]/10 pb-4">
                                        Complete Registration
                                    </h3>

                                    <div className="space-y-6 mb-8">
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                                                id="name"
                                                placeholder="Full Name"
                                            />
                                            <label
                                                htmlFor="name"
                                                className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                                            >
                                                Full Name
                                            </label>
                                        </div>

                                        <div className="relative group">
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                                                id="email"
                                                placeholder="Email Address"
                                            />
                                            <label
                                                htmlFor="email"
                                                className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                                            >
                                                Email Address
                                            </label>
                                        </div>

                                        <div className="relative group">
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                                                id="phone"
                                                placeholder="Phone Number"
                                            />
                                            <label
                                                htmlFor="phone"
                                                className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                                            >
                                                Phone Number
                                            </label>
                                        </div>

                                        <div className="md:col-span-2 relative group">
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all resize-none h-[80px]"
                                                id="address"
                                                placeholder="Address (Optional)"
                                            />
                                            <label
                                                htmlFor="address"
                                                className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                                            >
                                                Address (Optional)
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={formData.organisation}
                                                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                                                    className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                                                    id="organisation"
                                                    placeholder="Organisation (Optional)"
                                                />
                                                <label
                                                    htmlFor="organisation"
                                                    className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                                                >
                                                    Organisation (Optional)
                                                </label>
                                            </div>

                                            <div className="relative group">
                                                <input
                                                    type="text"
                                                    value={formData.referredBy}
                                                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                                                    className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                                                    id="referredBy"
                                                    placeholder="Referred By (Optional)"
                                                />
                                                <label
                                                    htmlFor="referredBy"
                                                    className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                                                >
                                                    Referred By (Optional)
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Donation Section */}
                                    <div className="mb-8 p-6 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20">
                                        <label className="block text-sm font-bold text-[#5D4037] mb-3 uppercase tracking-wider">
                                            Add a Donation (Optional)
                                        </label>
                                        <div className="grid grid-cols-3 gap-3 mb-3">
                                            {[101, 501, 1001].map((amt) => (
                                                <button
                                                    key={amt}
                                                    onClick={() => {
                                                        setDonationAmount(amt);
                                                        setCustomDonation(amt.toString());
                                                    }}
                                                    className={`py-2 rounded-lg font-semibold text-sm transition-all ${donationAmount === amt
                                                        ? 'bg-[#D4AF37] text-white shadow-md'
                                                        : 'bg-white text-[#5D4037] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10'
                                                        }`}
                                                >
                                                    ₹{amt}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5D4037] font-bold">₹</span>
                                            <input
                                                type="number"
                                                value={customDonation}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setCustomDonation(val);
                                                    setDonationAmount(Number(val));
                                                }}
                                                placeholder="Custom Amount"
                                                className="w-full p-3 pl-8 bg-white border border-[#D4AF37]/30 rounded-lg focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#5D4037]"
                                            />
                                        </div>
                                    </div>

                                    {/* Total Calculation */}
                                    <div className="flex justify-between items-center mb-6 px-2 text-[#5D4037]">
                                        <span className="text-sm">Registration Fee:</span>
                                        <span className="font-semibold">{event.price ? `₹${event.price}` : 'Free'}</span>
                                    </div>
                                    {donationAmount > 0 && (
                                        <div className="flex justify-between items-center mb-6 px-2 text-[#D4AF37]">
                                            <span className="text-sm">Donation:</span>
                                            <span className="font-semibold">+ ₹{donationAmount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mb-8 px-4 py-3 bg-[#5D4037] text-white rounded-xl shadow-lg">
                                        <span className="font-bold tracking-wide">Total Payable</span>
                                        <span className="font-bold text-xl">₹{(event.price || 0) + donationAmount}</span>
                                    </div>

                                    {(event.price || 0) + donationAmount > 0 ? (
                                        <div className="pt-2">
                                            <RazorpayButton
                                                amount={(event.price || 0) + donationAmount}
                                                donorDetails={formData}
                                                metadata={{
                                                    type: 'event',
                                                    eventId: event.id,
                                                    eventTitle: translatedEvent.title,
                                                    registrationFee: event.price || 0,
                                                    donationAmount: donationAmount
                                                }}
                                                disabled={!formData.name || !formData.email || !formData.phone}
                                            />
                                            <p className="text-xs text-center text-[#8D6E63] mt-3 flex items-center justify-center gap-1">
                                                <Clock size={12} /> Secure Payment via Razorpay
                                            </p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={async () => {
                                                if (!formData.name || !formData.email || !formData.phone) {
                                                    alert("Please fill in all details");
                                                    return;
                                                }
                                                const res = await registerForFreeEvent(event.id, translatedEvent.title, formData);
                                                if (res.success) {
                                                    alert("Registration Successful!");
                                                    onClose();
                                                } else {
                                                    alert(res.message);
                                                }
                                            }}
                                            className="w-full py-4 bg-gradient-to-r from-[#5D4037] to-[#4A3225] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-[#5D4037]/40 hover:-translate-y-1 transition-all"
                                        >
                                            Confirm Free Registration
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>,
        document.body
    );
}
