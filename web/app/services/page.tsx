"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";
import { Sparkles, Calendar, BookOpen, UserCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import Image from "next/image";
import BookingForm from "@/components/services/BookingForm";
import PriestRegistrationForm from "@/components/events/PriestRegistrationForm";

function ServicesContent() {
    const { language } = useLanguage();
    const t = translations[language];
    const s = t.servicesPage;
    const searchParams = useSearchParams();

    const [activeSection, setActiveSection] = useState<'booking' | 'registration'>('booking');

    // Sync active section with URL query param (e.g. ?section=registration)
    useEffect(() => {
        const section = searchParams.get("section");
        if (section === "registration") {
            setActiveSection("registration");
        } else {
            setActiveSection("booking");
        }
    }, [searchParams]);

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const serviceCategories = [
        {
            icon: Sparkles,
            title: language === 'en' ? "Pooja Services" : "ಪೂಜೆ ಸೇವೆಗಳು",
            desc: language === 'en' ? "Sacred rituals like Ganapathi Homam, Satyanarayana Pooja, and more performed with Vedic precision." : "ವೈದಿಕ ನಿಖರತೆಯೊಂದಿಗೆ ನಡೆಸಲಾಗುವ ಗಣಪತಿ ಹೋಮ, ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ ಮತ್ತು ಹೆಚ್ಚಿನ ಪವಿತ್ರ ಆಚರಣೆಗಳು.",
            color: "from-amber-500/10 to-orange-500/10"
        },
        {
            icon: Calendar,
            title: language === 'en' ? "Custom Rituals" : "ಗ್ರಾಹಕೀಯಗೊಳಿಸಿದ ಆಚರಣೆಗಳು",
            desc: language === 'en' ? "Book priests for weddings, housewarmings, and private family ceremonies at your location." : "ನಿಮ್ಮ ಸ್ಥಳದಲ್ಲಿ ವಿವಾಹಗಳು, ಗೃಹಪ್ರವೇಶಗಳು ಮತ್ತು ಖಾಸಗಿ ಕುಟುಂಬ ಸಮಾರಂಭಗಳಿಗಾಗಿ ಪುರೋಹಿತರನ್ನು ಬುಕ್ ಮಾಡಿ.",
            color: "from-orange-500/10 to-red-500/10"
        },
        {
            icon: BookOpen,
            title: language === 'en' ? "Spiritual Guidance" : "ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ",
            desc: language === 'en' ? "Consult our experienced Pandits for spiritual advice and auspicious timing (Muhurtham)." : "ಆಧ್ಯಾತ್ಮಿಕ ಸಲಹೆ ಮತ್ತು ಶುಭ ಸಮಯಕ್ಕಾಗಿ (ಮುಹೂರ್ತ) ನಮ್ಮ ಅನುಭವಿ ಪಂಡಿತರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            color: "from-red-500/10 to-amber-500/10"
        }
    ];

    return (
        <main className="min-h-screen bg-background-cream flex flex-col font-poppins text-primary/80">
            <Header />

            {/* HERO SECTION - Matching About Us Layout */}
            <div className="relative pt-32 pb-48 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FDFBF7] min-h-[85vh] flex items-center">
                {/* Background - Mandala Overlay Only */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 via-[#FDFBF7]/30 to-[#FDFBF7]/90 pointer-events-none" />

                <div className="container-gold relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-0 items-center">

                        {/* LEFT CONTENT - Centered Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6 order-1 lg:order-1 flex flex-col items-center justify-center h-full"
                        >
                            {/* Decorative Badge */}
                            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium">
                                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                                <span className="font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63]">{s.hero.tagline}</span>
                                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
                            </div>

                            {/* Main Heading */}
                            <h1 className="font-cinzel-decorative font-bold leading-tight drop-shadow-sm filter">
                                <span className="block text-4xl md:text-5xl lg:text-6xl text-[#D4AF37]">
                                    {s.hero.title1}
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-4xl text-[#D4AF37] mt-2 tracking-widest">
                                    {s.hero.title2}
                                </span>
                            </h1>

                            <p className="font-serif text-lg md:text-xl text-[#5D4037] w-full leading-relaxed font-medium px-4 lg:px-0 max-w-2xl mx-auto">
                                {s.hero.description}
                            </p>

                            {/* Registration Number Badge */}
                            <div className="inline-block">
                                <div className="bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-full px-4 py-1.5 shadow-sm">
                                    <p className="text-xs md:text-sm font-mono text-[#8D6E63] font-medium tracking-wide">
                                        {t.footer.registration.number}
                                    </p>
                                </div>
                            </div>

                            {/* Action Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                                <div className="flex items-center gap-2 text-[#8D6E63] font-serif italic">
                                    <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                                    <span>{s.features.vedic}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#8D6E63] font-serif italic">
                                    <UserCheck className="w-5 h-5 text-[#D4AF37]" />
                                    <span>{s.features.expert}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT CONTENT - Temple Arch Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full order-2 lg:order-2 flex justify-center lg:justify-end items-center"
                        >
                            {/* Temple Arch Container */}
                            <div className="relative w-full max-w-sm h-full">
                                {/* Outer Glow/Shadow */}
                                <div className="absolute inset-4 rounded-t-full bg-[#D4AF37]/20 blur-xl transform translate-y-4" />

                                {/* Main Image Container with Temple Border */}
                                <div className="relative h-full w-full rounded-t-full overflow-hidden border-[6px] border-double border-[#D4AF37]/40 shadow-2xl bg-[#FFFDF9]">
                                    <div className="absolute inset-2 rounded-t-full border-2 border-[#D4AF37] pointer-events-none z-20 opacity-60" />
                                    <Image
                                        src="/assets/services_hero.png"
                                        alt="Divine Services"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Subtle Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/20 to-transparent z-10" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20">
                    <GoldCurveSeparator />
                </div>
            </div>

            {/* QUICK FEATURES SECTION */}
            <section className="py-24 bg-surface-white relative">
                <div className="container-gold">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {serviceCategories.map((cat, idx) => (
                            <motion.div
                                key={idx}
                                {...fadeInUp}
                                transition={{ delay: 0.1 * idx }}
                                className={`p-8 rounded-3xl bg-gradient-to-br ${cat.color} border border-[#CFA14E]/20 hover:shadow-xl transition-all duration-300 group`}
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                                    <cat.icon className="w-7 h-7 text-[#CFA14E]" />
                                </div>
                                <h3 className="text-xl font-cinzel font-bold text-[#5D4037] mb-3">{cat.title}</h3>
                                <p className="text-gray-600 font-serif leading-relaxed mb-4">{cat.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTIONS TABS / NAVIGATION */}
            <div id="forms-section" className="sticky top-[63px] lg:top-[79px] z-30 bg-white/80 backdrop-blur-md border-b border-[#CFA14E]/10 py-4 shadow-sm scroll-mt-16 lg:scroll-mt-20 flex justify-center w-full">
                <div className="container-gold flex justify-center gap-8 md:gap-16 text-xs md:text-base">
                    <button
                        onClick={() => setActiveSection('booking')}
                        className={`font-cinzel font-bold transition-all flex items-center gap-2 pb-2 border-b-2 ${activeSection === 'booking' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#5D4037] border-transparent hover:text-[#CFA14E]'}`}
                    >
                        <Sparkles className="w-5 h-5 md:w-4 md:h-4" /> {s.booking.title}
                    </button>
                    <button
                        onClick={() => setActiveSection('registration')}
                        className={`font-cinzel font-bold transition-all flex items-center gap-2 pb-2 border-b-2 ${activeSection === 'registration' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#5D4037] border-transparent hover:text-[#CFA14E]'}`}
                    >
                        <UserCheck className="w-5 h-5 md:w-4 md:h-4" /> {s.priest.registerLabel}
                    </button>
                </div>
            </div>

            {/* INTERACTIVE FORMS CONTAINER */}
            <div className="relative overflow-hidden min-h-[800px] bg-surface-white">
                <AnimatePresence mode="wait">
                    {activeSection === 'booking' ? (
                        <motion.section
                            key="booking"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="py-24 bg-[#F9F6F0] relative w-full h-full"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#CFA14E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8860B]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="container-gold relative z-10">
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
                                    <motion.div {...fadeInUp} className="space-y-8 sticky top-40">
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-cinzel-decorative font-bold text-[#D4AF37] mb-6 drop-shadow-sm">
                                                {s.booking.title.replace('Book', 'BOOk')}
                                            </h2>
                                            <div className="h-1.5 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full mb-8" />
                                            <p className="text-xl font-serif text-[#5D4037] leading-relaxed italic">
                                                {s.booking.subtitle}
                                            </p>
                                        </div>

                                        <ul className="space-y-5">
                                            {[
                                                { text: s.booking.bullets[0], icon: ArrowRight },
                                                { text: s.booking.bullets[1], icon: ArrowRight },
                                                { text: s.booking.bullets[2], icon: ArrowRight },
                                                { text: s.booking.bullets[3], icon: ArrowRight }
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-[#5D4037] font-serif font-medium">
                                                    <div className="p-1.5 rounded-full bg-[#CFA14E]/20">
                                                        <item.icon className="w-4 h-4 text-[#CFA14E]" />
                                                    </div>
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>

                                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                                        <BookingForm />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="registration"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="py-24 bg-[#F9F6F0] relative w-full h-full"
                        >
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#CFA14E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B8860B]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="container-gold relative z-10">
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
                                    <motion.div {...fadeInUp} className="space-y-8 sticky top-40">
                                        <div>
                                            <h2 className="text-4xl md:text-5xl font-cinzel-decorative font-bold text-[#D4AF37] mb-6 drop-shadow-sm">
                                                {s.priest.title}
                                            </h2>
                                            <div className="h-1.5 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full mb-8" />
                                            <p className="text-xl font-serif text-[#5D4037] leading-relaxed italic">
                                                {s.priest.subtitle}
                                            </p>
                                        </div>

                                        <ul className="space-y-5">
                                            {[
                                                { text: language === 'en' ? "Join Our Divine Network" : "ನಮ್ಮ ದೈವಿಕ ಜಾಲವನ್ನು ಸೇರಿ" },
                                                { text: language === 'en' ? "Verified Temple Association" : "ಪರಿಶೀಲಿಸಿದ ದೇವಾಲಯದ ಸಂಘ" },
                                                { text: language === 'en' ? "Flexible Scheduling" : "ಹೊಂದಿಕೊಳ್ಳುವ ವೇಳಾಪಟ್ಟಿ" },
                                                { text: language === 'en' ? "Community Service" : "ಸಮಾಜ ಸೇವೆ" }
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-[#5D4037] font-serif font-medium">
                                                    <div className="p-1.5 rounded-full bg-[#CFA14E]/20">
                                                        <UserCheck className="w-4 h-4 text-[#CFA14E]" />
                                                    </div>
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>

                                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                                        <PriestRegistrationForm />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </main>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background-cream flex items-center justify-center">
                <div className="text-secondary animate-pulse font-cinzel text-xl tracking-widest">ॐ</div>
            </div>
        }>
            <ServicesContent />
        </Suspense>
    );
}
