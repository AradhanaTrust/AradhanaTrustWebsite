"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, GraduationCap, MapPin, Phone, BookOpen, Sparkles } from "lucide-react";

interface PriestRegistrationFormProps {
    onSuccess?: () => void;
}

export default function PriestRegistrationForm({ onSuccess }: PriestRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        whatsappNumber: "",
        gothram: "",
        vedicTradition: "",
        experienceYears: "",
        currentTemple: "",
        specialization: "",
        address: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/priests/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit application");
            }

            setIsSuccess(true);
            if (onSuccess) {
                // Delay slightly to show success animation
                setTimeout(onSuccess, 2000);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface-white rounded-3xl p-8 md:p-12 text-center shadow-xl border border-secondary/20 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] opacity-5 animate-spin-slow pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-full mx-auto flex items-center justify-center shadow-lg"
                    >
                        <CheckCircle className="w-12 h-12 text-surface-white" />
                    </motion.div>

                    <div className="space-y-4">
                        <h3 className="text-3xl font-cinzel-decorative font-bold text-primary-dark">
                            Namaskaram
                        </h3>
                        <p className="text-gray-600 font-serif leading-relaxed text-lg max-w-md mx-auto">
                            Thank you for submitting your details. Our temple trust committee will review your application and contact you soon.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#CFA14E]/20 relative">
            {/* Elegant Header */}
            <div className="bg-gradient-to-b from-[#FFF9E6] to-[#FFFDF9] p-8 md:p-10 text-center relative border-b border-[#CFA14E]/20">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/mandala-bg.svg')] bg-[length:200px]" />
                <h3 className="text-3xl font-cinzel-decorative font-bold text-[#D4AF37] relative z-10 mb-3 drop-shadow-sm">
                    Archakaru / Purohitaru Registration
                </h3>
                <p className="text-[#5D4037]/80 font-serif text-lg relative z-10">
                    Register to offer your divine services
                </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                        {error}
                    </div>
                )}

                {/* Section 1: Personal Details */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-cinzel font-semibold text-primary-dark">Personal Information</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name (Purohitaru Name) *</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="Sri..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="+91"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">WhatsApp Number</label>
                            <input
                                type="tel"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="Same as phone if left blank"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address (Optional)</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Vedic Background */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-cinzel font-semibold text-primary-dark">Vedic Lineage & Expertise</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Gothram</label>
                            <input
                                type="text"
                                value={formData.gothram}
                                onChange={(e) => setFormData({ ...formData, gothram: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="e.g. Kashyapa, Bharadwaja"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Vedic Tradition / Sampradaya</label>
                            <input
                                type="text"
                                value={formData.vedicTradition}
                                onChange={(e) => setFormData({ ...formData, vedicTradition: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="e.g. Rig Veda, Smartha"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Years of Experience</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.experienceYears}
                                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="Years performing pujas"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Specialization (Vishesha)</label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="e.g. Alankaram, Homa, Veda Parayanam"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Current Status */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                        <div className="p-2 rounded-lg bg-primary/5 text-primary">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-cinzel font-semibold text-primary-dark">Current Location</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Currently Associated Temple (If any)</label>
                            <input
                                type="text"
                                value={formData.currentTemple}
                                onChange={(e) => setFormData({ ...formData, currentTemple: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder="Temple Name, City"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Residential Address</label>
                            <textarea
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none resize-none"
                                placeholder="Full address"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto mx-auto px-10 py-4 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Submitting Details...
                            </>
                        ) : (
                            <>
                                Submit Registration
                                <Sparkles className="w-6 h-6 opacity-70" />
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-500 font-serif mt-5 mb-2">
                        Your details are submitted securely and will be reviewed by the temple authoritative committee.
                    </p>
                </div>
            </form>
        </div>
    );
}
