"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, GraduationCap, BookOpen, MapPin, Phone, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

interface PriestRegistrationFormProps {
    onSuccess?: () => void;
}

export default function PriestRegistrationForm({ onSuccess }: PriestRegistrationFormProps) {
    const { language } = useLanguage();
    const t = translations[language].servicesPage.priestRegistrationForm;
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
                        <p className="text-gray-600 font-serif leading-relaxed text-lg max-w-xl mx-auto">
                            Thank you for submitting your details. Our temple trust committee will review your application and contact you soon.
                            {formData.email && (
                                <span className="block mt-2 font-medium text-secondary">
                                    A confirmation email has been sent to {formData.email}.
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#CFA14E]/20 relative">
            <div className="bg-[#FFF9E6] p-6 text-center border-b border-[#CFA14E]/10 relative">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('/assets/mandala-bg.svg')] bg-[length:200px]" />
                <h3 className="text-2xl md:text-2xl font-cinzel font-bold text-[#5D4037] relative z-10">
                    {t.formTitle}
                </h3>
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
                        <h4 className="text-xl font-cinzel font-semibold text-primary-dark">{t.personalInfo}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.fullName}</label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.fullNamePlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.phone}</label>
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
                            <label className="text-sm font-semibold text-gray-700">{t.whatsapp}</label>
                            <input
                                type="tel"
                                value={formData.whatsappNumber}
                                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.whatsappPlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.email}</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.emailPlaceholder}
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
                        <h4 className="text-xl font-cinzel font-semibold text-primary-dark">{t.vedicInfo}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.gothram}</label>
                            <input
                                type="text"
                                value={formData.gothram}
                                onChange={(e) => setFormData({ ...formData, gothram: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.gothramPlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.tradition}</label>
                            <input
                                type="text"
                                value={formData.vedicTradition}
                                onChange={(e) => setFormData({ ...formData, vedicTradition: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.traditionPlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.experience}</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.experienceYears}
                                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.experiencePlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.specialization}</label>
                            <input
                                type="text"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.specializationPlaceholder}
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
                        <h4 className="text-xl font-cinzel font-semibold text-primary-dark">{t.locationInfo}</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.temple}</label>
                            <input
                                type="text"
                                value={formData.currentTemple}
                                onChange={(e) => setFormData({ ...formData, currentTemple: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none"
                                placeholder={t.templePlaceholder}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">{t.address}</label>
                            <textarea
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none resize-none"
                                placeholder={t.addressPlaceholder}
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
                                {t.submitting}
                            </>
                        ) : (
                            <>
                                {t.submit}
                                <Sparkles className="w-6 h-6 opacity-70" />
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-500 font-serif mt-5 mb-2">
                        {t.note}
                    </p>
                </div>
            </form>
        </div>
    );
}
