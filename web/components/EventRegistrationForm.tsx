"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import RazorpayButton from "./RazorpayButton";
import RegistrationStatusModal from "./RegistrationStatusModal";
import { registerForFreeEvent } from "@/app/actions/event-registration";
import { Event } from "@/lib/events-data";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

interface EventRegistrationFormProps {
    event: Event;
    onSuccess?: () => void;
}

export default function EventRegistrationForm({ event, onSuccess }: EventRegistrationFormProps) {
    const { language } = useLanguage();
    const t = translations[language].eventRegistration;

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalData, setModalData] = useState<{
        isOpen: boolean;
        status: 'success' | 'error' | null;
        title?: string;
        message?: string;
        registrationNo?: string;
        receiptUrl?: string;
    }>({ isOpen: false, status: null });

    const handleFreeRegistration = async () => {
        setIsSubmitting(true);
        try {
            const result = await registerForFreeEvent(event.id, event.title, formData);

            if (result.success) {
                setModalData({
                    isOpen: true,
                    status: 'success',
                    title: t.successTitle,
                    message: t.successMessage,
                    registrationNo: result.registrationNo || undefined,
                    receiptUrl: result.registrationId ? `/api/receipts/download?id=${result.registrationId}` : undefined
                });
            } else {
                setModalData({
                    isOpen: true,
                    status: 'error',
                    title: t.failedTitle,
                    message: result.message || t.failedMessage
                });
            }
        } catch (error) {
            console.error("Registration error:", error);
            setModalData({
                isOpen: true,
                status: 'error',
                title: t.errorTitle,
                message: t.errorMessage
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name.trim() !== "" && formData.email.trim() !== "" && formData.phone.trim() !== "" && formData.address.trim() !== "";
    const totalAmount = (event.price || 0) + donationAmount;

    return (
        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#D4AF37]/30 shadow-inner">
            <RegistrationStatusModal
                isOpen={modalData.isOpen}
                onClose={() => {
                    setModalData({ ...modalData, isOpen: false });
                    // Only trigger the parent onClose if registration was successful
                    if (modalData.status === 'success' && onSuccess) {
                        onSuccess();
                    }
                }}
                status={modalData.status}
                title={modalData.title}
                message={modalData.message}
                registrationNo={modalData.registrationNo}
                receiptUrl={modalData.receiptUrl}
            />
            <div className="space-y-8 mb-8">
                <div className="relative group">
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                        id="name"
                        placeholder={t.namePlaceholder}
                        required
                    />
                    <label
                        htmlFor="name"
                        className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                    >
                        {t.nameLabel}
                    </label>
                </div>

                <div className="relative group">
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                        id="email"
                        placeholder={t.emailPlaceholder}
                        required
                    />
                    <label
                        htmlFor="email"
                        className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                    >
                        {t.emailLabel}
                    </label>
                </div>

                <div className="relative group">
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                        id="phone"
                        placeholder={t.phonePlaceholder}
                        required
                    />
                    <label
                        htmlFor="phone"
                        className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                    >
                        {t.phoneLabel}
                    </label>
                </div>

                <div className="relative group">
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={2}
                        className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all resize-none"
                        id="address"
                        placeholder={t.addressPlaceholder}
                        required
                    />
                    <label
                        htmlFor="address"
                        className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                    >
                        {t.addressLabel}
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
                            placeholder="Organisation"
                        />
                        <label
                            htmlFor="organisation"
                            className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                        >
                            {t.organisationLabel}
                        </label>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            value={formData.referredBy}
                            onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                            className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none text-[#5D4037] placeholder-transparent peer transition-all"
                            id="referredBy"
                            placeholder="Referred By"
                        />
                        <label
                            htmlFor="referredBy"
                            className="absolute left-4 top-4 text-[#8D6E63]/70 text-base transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-[#D4AF37] peer-focus:bg-[#FDFBF7] peer-focus:px-2 -translate-y-7 scale-75 bg-[#FDFBF7] px-2 pointer-events-none"
                        >
                            {t.referredByLabel}
                        </label>
                    </div>
                </div>

                {/* Optional Donation Section */}
                <div className="border border-[#D4AF37]/20 rounded-xl bg-white p-6 my-6 shadow-sm">
                    <h4 className="font-serif font-bold text-lg text-[#5D4037] mb-2 flex items-center justify-between">
                        {t.supportTitle}
                        <span className="text-xs font-normal bg-[#D4AF37]/10 text-[#B8860B] px-2 py-1 rounded">{t.optionalSupport}</span>
                    </h4>
                    <p className="text-sm text-[#8D6E63] mb-4">{t.supportDesc}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {[500, 1000, 2500, 5000].map(amt => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => {
                                    setDonationAmount(amt === donationAmount ? 0 : amt);
                                    setCustomDonation("");
                                }}
                                className={`py-2 rounded-lg border font-medium transition-all ${donationAmount === amt
                                    ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#B8860B] shadow-inner"
                                    : "border-gray-200 text-gray-500 hover:border-[#D4AF37]/50"
                                    }`}
                            >
                                ₹{amt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Total Summary */}
            <div className="flex justify-center items-baseline gap-4 mb-8 p-4 bg-white rounded-xl border border-[#D4AF37]/20">
                <span className="font-serif text-[#8D6E63] font-medium text-lg">{t.totalAmount}</span>
                <span className="text-2xl font-bold text-[#D4AF37]">
                    ₹{totalAmount}
                </span>
            </div>

            {/* Submit / Pay Button */}
            {!isFormValid ? (
                <button
                    disabled
                    className="w-full md:w-auto px-10 py-4 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed block mx-auto"
                >
                    {t.fillRequired}
                </button>
            ) : totalAmount > 0 ? (
                <div className="pt-2">
                    <RazorpayButton
                        amount={totalAmount}
                        donorDetails={formData}
                        metadata={{
                            type: 'event',
                            eventId: event.id,
                            eventTitle: event.title,
                            registrationFee: event.price || 0,
                            donationAmount: donationAmount
                        }}
                        disabled={!formData.name || !formData.email || !formData.phone}
                        label={t.registerPaid}
                    />
                    <p className="text-xs text-center text-[#8D6E63] mt-3 flex items-center justify-center gap-1">
                        {t.securePayment}
                    </p>
                </div>
            ) : (
                <button
                    onClick={handleFreeRegistration}
                    disabled={isSubmitting}
                    className="w-full md:w-auto mx-auto px-10 py-4 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={20} className="animate-spin" /> {t.submitting}
                        </>
                    ) : (
                        <>{t.registerFree} <ArrowRight size={20} /></>
                    )}
                </button>
            )}
        </div>
    );
}
