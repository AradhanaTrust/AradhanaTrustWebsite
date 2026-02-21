"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Heart, Users, BookOpen, Sparkles, Leaf, HandHeart, Check, ChevronDown, ChevronUp, ArrowRight, Copy } from "lucide-react";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";
import { donationConfig } from "@/lib/donation-config";
import Image from "next/image";
import RazorpayButton from "@/components/RazorpayButton";

export default function DonatePage() {
    const { language } = useLanguage();
    const t = translations[language].donatePage;
    const [selectedAmount, setSelectedAmount] = useState(1000);
    const [customAmount, setCustomAmount] = useState("1000");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    // Donor Details State
    const [donorDetails, setDonorDetails] = useState({
        name: "",
        email: "",
        phone: "",
        organisation: "",
        referredBy: "",
        address: ""
    });

    const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDonorDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(donationConfig.upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const amounts = [100, 500, 1000, 5000];

    const categoryIcons: Record<string, any> = {
        annadanam: Heart,
        temple: Sparkles,
        education: BookOpen,
        cultural: Users,
        gauseva: Leaf,
        general: HandHeart
    };

    const categories = [
        { key: "annadanam", ...t.categories.annadanam },
        { key: "temple", ...t.categories.temple },
        { key: "education", ...t.categories.education },
        { key: "cultural", ...t.categories.cultural },
        { key: "general", ...t.categories.general }
    ];

    return (
        <>
            <Header />

            {/* Hero Section - Matching About Us/Events Layout */}
            <div className="relative pt-32 pb-48 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FDFBF7] min-h-[85vh] flex items-center">
                {/* Background - Mandala Overlay Only */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 via-[#FDFBF7]/30 to-[#FDFBF7]/90 pointer-events-none" />

                <div className="container-gold relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 lg:gap-0 items-center">

                        {/* LEFT CONTENT - Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6 order-1 lg:order-1 flex flex-col items-center justify-center h-full"
                        >
                            {/* Decorative Quote */}
                            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium">
                                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                                <span className="font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63]">{t.hero.badge}</span>
                                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
                            </div>

                            {/* Main Heading */}
                            <h1 className="font-cinzel-decorative font-bold leading-tight drop-shadow-sm filter">
                                <span className="block text-4xl md:text-5xl lg:text-6xl text-[#D4AF37]">
                                    {t.hero.title}
                                </span>
                            </h1>

                            <p className="font-serif text-lg md:text-xl text-[#5D4037] w-full leading-relaxed font-medium px-4 lg:px-0">
                                {t.hero.subtitle}
                            </p>

                            {/* UPI ID Display with Copy */}
                            <div
                                onClick={handleCopy}
                                className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-[#D4AF37]/30 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all shadow-sm active:scale-95 max-w-sm mx-auto w-full"
                            >
                                <div className="text-left">
                                    <p className="text-xs text-[#8D6E63] uppercase tracking-widest font-bold">UPI ID</p>
                                    <p className="text-lg font-mono font-bold text-[#4A3225]">{donationConfig.upiId}</p>
                                </div>
                                <div className={`p-2 rounded-lg transition-colors ${copied ? "bg-green-100 text-green-600" : "bg-[#D4AF37]/10 text-[#B8860B] group-hover:bg-[#D4AF37] group-hover:text-white"}`}>
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <a href="#donate-form">
                                <button className="min-h-[44px] px-10 py-4 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-300 transform flex items-center gap-2">
                                    {t.hero.donateBtn}
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full order-2 lg:order-2 flex justify-center lg:justify-end items-center"
                        >
                            {/* QR Code Container - Square Frame matching Home Page */}
                            <div className="relative w-full max-w-sm">
                                {/* Outer Glow */}
                                <div className="absolute inset-4 rounded-xl bg-[#D4AF37]/20 blur-xl" />

                                {/* Main QR Code Container */}
                                <div className="relative aspect-square w-full bg-background-ivory rounded-xl border-4 border-double border-[#D4AF37]/30 flex items-center justify-center overflow-hidden shadow-2xl">
                                    <Image
                                        src={donationConfig.qrCodeImage}
                                        alt="Donation QR Code"
                                        fill
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-contain p-4"
                                    />
                                </div>

                                {/* Decorative Corner Element */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-lg z-30">
                                    <Heart className="text-[#D4AF37] w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
                <GoldCurveSeparator />
            </div>

            {/* Donation Categories Section */}
            <section className="py-24 bg-background-ivory relative z-10">
                <div className="container mx-auto px-4 lg:px-12">


                    <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                        {categories.map((category, idx) => {
                            const Icon = categoryIcons[category.key];
                            return (
                                <motion.div
                                    key={category.key}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-lg border border-secondary/10 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                                    onClick={() => {
                                        setSelectedCategory(category.key);
                                        document.getElementById('donate-form')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#F3E5C5] to-[#D4AF37]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="text-[#D4AF37]" size={28} />
                                    </div>
                                    <h3 className="font-cinzel-decorative font-bold text-2xl text-[#5D4037] mb-4">{category.name}</h3>
                                    <p className="text-primary/70 mb-6 leading-relaxed">{category.desc}</p>
                                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                                        <Heart size={16} />
                                        <span className="text-sm">{category.impact}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Donation Form Section */}
            <section id="donate-form" className="py-24 bg-background-cream relative z-10">
                <GoldCurveSeparator />
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-4">{t.donationForm.title}</h2>
                            <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-[#FFF5D1]/40 via-[#F2C96D]/20 to-[#FFF5D1]/40 backdrop-blur-md border border-[#D4AF37]/50 shadow-sm">
                                <span className="text-xs md:text-sm font-bold tracking-[0.15em] text-[#5D4037] uppercase">{t.donationForm.subtitle}</span>
                            </div>
                        </div>

                        <div className="backdrop-blur-md bg-white/40 rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                            {/* Amount Selection */}
                            <div className="mb-10 relative z-10">
                                <label className="block text-lg font-semibold text-[#5D4037] mb-4 tracking-wide">{t.donationForm.amountLabel}</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                    {amounts.map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => {
                                                setSelectedAmount(amount);
                                                setCustomAmount(amount.toString());
                                            }}
                                            className={`py-3 rounded-xl font-bold text-base border transition-all duration-300 backdrop-blur-sm ${selectedAmount === amount
                                                ? 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white border-[#D4AF37] shadow-lg scale-105'
                                                : 'bg-white/60 text-[#5D4037] border-white/40 hover:border-[#D4AF37] hover:bg-white/80'
                                                }`}
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    placeholder={t.donationForm.customAmount}
                                    value={customAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setCustomAmount(val);
                                        const numVal = parseInt(val);
                                        if (amounts.includes(numVal)) {
                                            setSelectedAmount(numVal);
                                        } else {
                                            setSelectedAmount(0);
                                        }
                                    }}
                                    className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-lg transition-all placeholder:text-primary/40 text-[#5D4037]"
                                />
                            </div>

                            {/* Category Selection */}
                            <div className="mb-10 relative z-10">
                                <label className="block text-lg font-semibold text-[#5D4037] mb-4 tracking-wide">{t.donationForm.categoryLabel}</label>
                                <div className="relative">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-lg appearance-none text-[#5D4037] cursor-pointer"
                                    >
                                        <option value="">{t.donationForm.selectCategory}</option>
                                        {categories.map(cat => (
                                            <option key={cat.key} value={cat.key}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]">
                                        <ChevronDown size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Donation Type */}
                            <div className="mb-10 relative z-10">
                                <label className="block text-lg font-semibold text-[#5D4037] mb-4 tracking-wide">{t.donationForm.frequency}</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setDonationType("one-time")}
                                        className={`py-4 rounded-xl font-bold text-lg border transition-all ${donationType === "one-time"
                                            ? 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white border-[#D4AF37] shadow-md'
                                            : 'bg-white/60 text-[#5D4037] border-white/40 hover:border-[#D4AF37] hover:bg-white/80'
                                            }`}
                                    >
                                        {t.donationForm.oneTime}
                                    </button>
                                    <button
                                        onClick={() => setDonationType("monthly")}
                                        className={`py-4 rounded-xl font-bold text-lg border transition-all ${donationType === "monthly"
                                            ? 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white border-[#D4AF37] shadow-md'
                                            : 'bg-white/60 text-[#5D4037] border-white/40 hover:border-[#D4AF37] hover:bg-white/80'
                                            }`}
                                    >
                                        {t.donationForm.monthly}
                                    </button>
                                </div>
                            </div>

                            {/* Donor Information */}
                            <div className="mb-10 relative z-10">
                                <h3 className="text-lg font-semibold text-[#5D4037] mb-6 tracking-wide flex items-center gap-2">
                                    {t.donationForm.donorInfo}
                                    <div className="h-[1px] flex-grow bg-gradient-to-r from-[#D4AF37]/50 to-transparent ml-4" />
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input
                                            name="name"
                                            value={donorDetails.name}
                                            onChange={handleDonorChange}
                                            type="text"
                                            placeholder={t.donationForm.namePlaceholder}
                                            className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]"
                                        />
                                        <input
                                            name="email"
                                            value={donorDetails.email}
                                            onChange={handleDonorChange}
                                            type="email"
                                            placeholder={t.donationForm.emailPlaceholder}
                                            className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]"
                                        />
                                        <input
                                            name="phone"
                                            value={donorDetails.phone}
                                            onChange={handleDonorChange}
                                            type="tel"
                                            placeholder={t.donationForm.phonePlaceholder}
                                            className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <input
                                            name="organisation"
                                            value={donorDetails.organisation}
                                            onChange={handleDonorChange}
                                            type="text"
                                            placeholder={t.donationForm.organisationPlaceholder}
                                            className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]"
                                        />
                                        <input
                                            name="referredBy"
                                            value={donorDetails.referredBy}
                                            onChange={handleDonorChange}
                                            type="text"
                                            placeholder={t.donationForm.referredByPlaceholder}
                                            className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]"
                                        />
                                        <textarea
                                            name="address"
                                            value={donorDetails.address}
                                            onChange={handleDonorChange}
                                            placeholder={t.donationForm.addressPlaceholder}
                                            rows={1}
                                            className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037] resize-none h-[58px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center mt-8">
                                <RazorpayButton
                                    amount={selectedAmount}
                                    donorDetails={donorDetails}
                                    disabled={selectedAmount <= 0}
                                />
                                <p className="text-[#5D4037]/60 text-xs mt-4 flex items-center justify-center gap-1">
                                    <Sparkles size={12} />
                                    Secure Payment Gateway
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Impact Statistics */}
            <section className="py-24 bg-background-ivory relative z-10">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-4">{t.impact.title}</h2>
                        <div className="inline-block px-5 py-2 rounded-full bg-gradient-to-r from-[#FFF5D1]/40 via-[#F2C96D]/20 to-[#FFF5D1]/40 backdrop-blur-md border border-[#D4AF37]/50 shadow-sm">
                            <span className="text-xs md:text-sm font-bold tracking-[0.15em] text-[#5D4037] uppercase">{t.impact.subtitle}</span>
                        </div>
                    </div>
                    <div className="flex flex-row justify-center gap-4 md:gap-8 max-w-6xl mx-auto px-2">
                        {t.impact.stats.filter((stat, idx) => idx !== 3).map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex-1 min-w-0 backdrop-blur-md bg-white/40 rounded-2xl p-4 md:p-8 shadow-lg text-center border border-white/50 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-[#D4AF37] mb-2">{stat.value}</div>
                                    <div className="text-[10px] md:text-sm text-[#5D4037] font-bold uppercase tracking-wider leading-tight">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <section className="py-24 bg-background-cream relative z-10">
                <GoldCurveSeparator />
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225]">{t.faqs.title}</h2>
                            <div className="w-24 h-1 bg-[#CFA14E] mx-auto mt-6 rounded-full" />
                        </div>
                        <div className="space-y-4">
                            {t.faqs.items.filter((faq, idx) => idx !== 1).map((faq, idx) => (
                                <div key={idx} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                    <button
                                        onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                                        className="w-full p-6 text-left flex items-center justify-between hover:bg-[#F3E5C5]/30 transition-colors"
                                    >
                                        <span className="font-semibold text-lg text-secondary-dark pr-4">{faq.q}</span>
                                        {expandedFAQ === idx ? <ChevronUp className="text-[#D4AF37] flex-shrink-0" /> : <ChevronDown className="text-[#D4AF37] flex-shrink-0" />}
                                    </button>
                                    {expandedFAQ === idx && (
                                        <div className="px-6 pb-6 text-primary/70 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
