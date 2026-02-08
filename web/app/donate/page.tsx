"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Heart, Users, BookOpen, Sparkles, Leaf, HandHeart, Check, ChevronDown, ChevronUp } from "lucide-react";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";

export default function DonatePage() {
    const { language } = useLanguage();
    const t = translations[language].donatePage;
    const [selectedAmount, setSelectedAmount] = useState(1000);
    const [customAmount, setCustomAmount] = useState("1000");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const amounts = [500, 1000, 2500, 5000, 10000];

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

            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/assets/temple_hero_bg.png')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#F3E5C5]/70 via-[#F3E5C5]/40 to-[#F3E5C5]/70" />
                </div>

                <div className="container mx-auto px-4 lg:px-12 relative z-10 text-center flex items-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 max-w-4xl mx-auto w-full"
                    >
                        <div className="inline-block px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-secondary-dark text-[10px] font-bold tracking-[0.2em] uppercase">
                            {t.hero.badge}
                        </div>
                        <h1 className="font-cinzel-decorative font-bold text-4xl md:text-5xl lg:text-6xl text-[#4A3225] leading-tight">
                            {t.hero.title}
                        </h1>
                        <p className="text-lg md:text-xl text-primary/70 max-w-3xl mx-auto leading-relaxed">
                            {t.hero.subtitle}
                        </p>
                        <a href="#donate-form">
                            <button className="px-10 py-4 bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#F4C430,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_0_0_2px_#F4C430,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform">
                                {t.hero.donateBtn}
                            </button>
                        </a>
                    </motion.div>
                </div>
            </section>

            <GoldCurveSeparator />

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
                                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                                    {amounts.map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => {
                                                setSelectedAmount(amount);
                                                setCustomAmount(amount.toString());
                                            }}
                                            className={`py-4 rounded-xl font-bold text-lg border transition-all duration-300 backdrop-blur-sm ${selectedAmount === amount
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
                                        <input type="text" placeholder={t.donationForm.namePlaceholder} className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]" />
                                        <input type="email" placeholder={t.donationForm.emailPlaceholder} className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]" />
                                        <input type="tel" placeholder={t.donationForm.phonePlaceholder} className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]" />
                                    </div>
                                    <div className="space-y-4">
                                        <input type="text" placeholder={t.donationForm.organisationPlaceholder} className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]" />
                                        <input type="text" placeholder={t.donationForm.referredByPlaceholder} className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037]" />
                                        <textarea placeholder={t.donationForm.addressPlaceholder} rows={1} className="w-full p-4 bg-white/60 border border-white/40 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all placeholder:text-primary/40 text-[#5D4037] resize-none h-[58px]" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center mt-8">
                                <button className="relative z-10 w-full md:w-auto px-12 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold text-lg rounded-full shadow-lg hover:shadow-[#D4AF37]/50 hover:-translate-y-1 transition-all duration-300 border border-white/20 flex items-center justify-center gap-2 mx-auto group">
                                    {t.donationForm.submitBtn}
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
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
                                    <div className="text-2xl md:text-5xl font-bold text-[#D4AF37] mb-2 truncate">{stat.value}</div>
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
