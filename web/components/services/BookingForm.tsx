"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, Calendar, User, Phone, Mail, MessageSquare, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function BookingForm() {
    const { language } = useLanguage();
    const t = translations[language].servicesPage;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        ritualType: "",
        preferredDate: "",
        additionalInfo: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/services/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to submit request");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl border border-[#CFA14E]/20 relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] opacity-5 animate-spin-slow pointer-events-none" />
                <div className="relative z-10 space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-full mx-auto flex items-center justify-center shadow-lg"
                    >
                        <CheckCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-cinzel-decorative font-bold text-[#5D4037]">
                            Dhanyavadagalu
                        </h3>
                        <p className="text-gray-600 font-serif leading-relaxed text-lg max-w-md mx-auto">
                            {translations[language].contact.form.success}
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#CFA14E]/20 relative">
            <div className="bg-[#FFF9E6] p-6 text-center border-b border-[#CFA14E]/10">
                <h3 className="text-2xl font-cinzel font-bold text-[#5D4037]">{t.booking.formTitle}</h3>
                <p className="text-sm font-serif text-[#8D6E63] mt-1">{t.booking.formSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-2">
                            <User className="w-3.5 h-3.5 opacity-60" /> {t.bookingForm.fullName}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#CFA14E] focus:ring-2 focus:ring-[#CFA14E]/10 transition-all outline-none"
                            placeholder={t.bookingForm.fullNamePlaceholder}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 opacity-60" /> {t.bookingForm.phone}
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#CFA14E] focus:ring-2 focus:ring-[#CFA14E]/10 transition-all outline-none"
                            placeholder="+91"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 opacity-60" /> {t.bookingForm.email}
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#CFA14E] focus:ring-2 focus:ring-[#CFA14E]/10 transition-all outline-none"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 opacity-60" /> {t.bookingForm.date}
                        </label>
                        <input
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#CFA14E] focus:ring-2 focus:ring-[#CFA14E]/10 transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 opacity-60" /> {t.bookingForm.type}
                    </label>
                    <select
                        value={formData.ritualType}
                        onChange={(e) => setFormData({ ...formData, ritualType: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#CFA14E] focus:ring-2 focus:ring-[#CFA14E]/10 transition-all outline-none"
                    >
                        <option value="">{t.bookingForm.typeSelect}</option>
                        <option value="ganapathi-homam">{t.bookingForm.options.ganapathi}</option>
                        <option value="satyanarayana-pooja">{t.bookingForm.options.satyanarayana}</option>
                        <option value="navagraha-homam">{t.bookingForm.options.navagraha}</option>
                        <option value="lakshmi-pooja">{t.bookingForm.options.lakshmi}</option>
                        <option value="house-warming">{t.bookingForm.options.houseWarming}</option>
                        <option value="marriage">{t.bookingForm.options.marriage}</option>
                        <option value="other">{t.bookingForm.options.other}</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#5D4037] uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5 opacity-60" /> {t.bookingForm.additionalInfo}
                    </label>
                    <textarea
                        rows={3}
                        value={formData.additionalInfo}
                        onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#CFA14E] focus:ring-2 focus:ring-[#CFA14E]/10 transition-all outline-none resize-none"
                        placeholder={t.bookingForm.additionalInfoPlaceholder}
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium rounded-xl border border-[#CFA14E] shadow-sm hover:translate-y-px transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {t.bookingForm.submitting}
                            </>
                        ) : (
                            <>
                                {t.booking.submit}
                                <Sparkles className="w-4 h-4 opacity-70" />
                            </>
                        )}
                    </button>
                    <p className="text-[10px] text-gray-500 font-serif mt-3 text-center">
                        {t.bookingForm.nonBinding}
                    </p>
                </div>
            </form>
        </div>
    );
}
