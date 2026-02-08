"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";
import { BookOpen, Milestone, ChevronDown, Flower } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function AboutPage() {

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const { language } = useLanguage();
    const t = translations[language];


    const handleScroll = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <main className="min-h-screen bg-background-cream flex flex-col font-poppins text-primary/80">
            <Header />

            {/* HERO SECTION - Refined V5 Layout */}
            <div className="relative pt-32 pb-48 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FDFBF7] min-h-[85vh] flex items-center">
                {/* Background - Mandala Overlay Only */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 via-[#FDFBF7]/30 to-[#FDFBF7]/90 pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-12 relative z-10 w-full">
                    {/* Adjusted Grid: Reduced gap further (gap-0 to gap-4) and added symmetric padding (pl-12 pr-12) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-0 items-center lg:pr-12 lg:pl-12">

                        {/* LEFT CONTENT - Centered Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6 order-1 lg:order-1 flex flex-col items-center justify-center h-full"
                        >
                            {/* Decorative Quote */}
                            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium">
                                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                                <span className="font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63]">{translations[language].aboutPage.motto}</span>
                                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
                            </div>

                            {/* Main Heading - Updated Size & Color */}
                            <h1 className="font-cinzel-decorative font-bold leading-tight drop-shadow-sm filter">
                                <span className="block text-4xl md:text-5xl lg:text-6xl text-[#D4AF37]">
                                    {translations[language].aboutPage.heroTitle1}
                                </span>
                                <span className="block text-2xl md:text-3xl lg:text-4xl text-[#D4AF37] mt-2 tracking-widest">
                                    {translations[language].aboutPage.heroTitle2}
                                </span>
                            </h1>

                            <p className="font-serif text-lg md:text-xl text-[#5D4037] w-full leading-relaxed font-medium px-4 lg:px-0" dangerouslySetInnerHTML={{ __html: `"${translations[language].aboutPage.heroDescription}"` }} />

                            {/* Registration Number Badge */}
                            <div className="inline-block">
                                <div className="bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-full px-4 py-1.5 shadow-sm">
                                    <p className="text-xs md:text-sm font-mono text-[#8D6E63] font-medium tracking-wide">
                                        {t.footer.registration.number}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT CONTENT - Temple Arch Image - Reduced Size */}
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
                                    {/* Inner Gold Border */}
                                    <div className="absolute inset-2 rounded-t-full border-2 border-[#D4AF37] pointer-events-none z-20 opacity-60" />

                                    <img
                                        src="/assets/hero-bg.png"
                                        alt="Temple Architecture"
                                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
                                    />

                                    {/* Vignette for Depth */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/40 via-transparent to-transparent pointer-events-none z-10" />
                                </div>

                                {/* Decorative Keystone Element - Flower Pattern for Nature Feel */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-lg z-30">
                                    <Flower className="text-[#D4AF37] w-7 h-7" />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* Scroll Down Indicator */}
                <div
                    onClick={handleScroll}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity duration-300"
                >
                    <ChevronDown className="text-[#B8860B] w-8 h-8 animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                </div>

                <GoldCurveSeparator fillColor="fill-[#FFFDF9]" />
            </div>

            <div className="flex-grow bg-[#FFFDF9]">

                {/* OUR STORY - Parchment Style */}
                <section className="py-20 relative pt-10">
                    <div className="container mx-auto px-4 lg:px-12 max-w-5xl">
                        <div className="bg-[url('/assets/texture-parchment.png')] bg-cover bg-[#FFFBE6] border border-[#CFA14E]/30 p-8 md:p-12 rounded-sm shadow-xl relative z-20 mx-4 md:mx-0">
                            {/* Corner Ornaments */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#CFA14E] rounded-tl-3xl opacity-50" />
                            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#CFA14E] rounded-tr-3xl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#CFA14E] rounded-bl-3xl opacity-50" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#CFA14E] rounded-br-3xl opacity-50" />

                            <div className="text-center mb-8">
                                <h2 className="font-cinzel-decorative font-bold text-3xl md:text-4xl text-[#4A3225] mb-2">{translations[language].aboutPage.originsTitle}</h2>
                                <p className="text-[#CFA14E] font-serif italic text-lg">{translations[language].aboutPage.originsSubtitle}</p>
                            </div>

                            <div className="space-y-6 text-lg text-[#5D4037] leading-relaxed font-medium text-justify md:text-center">
                                <p dangerouslySetInnerHTML={{ __html: translations[language].aboutPage.originsPara1 }} />
                                <p>
                                    {translations[language].aboutPage.originsPara2}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Separator between Story and Mission (White -> Cream) */}
                <div className="relative w-full overflow-hidden leading-none z-20 pointer-events-none translate-y-[2px]">
                    <GoldCurveSeparator fillColor="fill-background-cream" />
                </div>

                {/* MISSION & VISION - Temple Arch Style */}
                <section className="py-16 lg:py-24 bg-background-cream relative overflow-hidden">
                    {/* Top Separator Removed */}

                    <div className="container mx-auto px-4 lg:px-12 relative z-10 pt-12">
                        <div className="text-center mb-16">
                            <h2 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-4">{translations[language].aboutPage.guidingLightTitle}</h2>
                            <div className="max-w-xs mx-auto h-1 bg-gradient-to-r from-transparent via-[#CFA14E] to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {/* Mission Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="bg-white rounded-t-[100px] pt-16 pb-12 px-8 shadow-lg border-2 border-[#CFA14E]/20 text-center relative group hover:-translate-y-2 transition-transform duration-500"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#F3E5C5] to-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                                    <Milestone size={32} className="text-[#5D4037]" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-2xl text-[#8D6E63] mb-6">{translations[language].aboutPage.missionTitle}</h3>
                                <p className="text-primary/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: translations[language].aboutPage.missionContent }} />
                            </motion.div>

                            {/* Vision Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="bg-white rounded-t-[100px] pt-16 pb-12 px-8 shadow-lg border-2 border-[#CFA14E]/20 text-center relative group hover:-translate-y-2 transition-transform duration-500"
                            >
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-[#F3E5C5] to-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                                    <BookOpen size={32} className="text-[#5D4037]" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-2xl text-[#8D6E63] mb-6">{translations[language].aboutPage.visionTitle}</h3>
                                <p className="text-primary/70 leading-relaxed">
                                    {translations[language].aboutPage.visionContent}
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Separator Removed (Since next section is also Cream/Hidden) */}
                </section>

                {/* TRUSTEES - Simple Elegant Grid */}
                {/* 
                <section className="py-20 bg-[#FFFDF9]">
                    <div className="container mx-auto px-4 lg:px-12 text-center">
                        <h2 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-12">Board of Trustees</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[1, 2, 3].map((_, idx) => (
                                <div key={idx} className="group">
                                    <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-[#CFA14E]/30 group-hover:border-[#CFA14E] transition-colors relative">
                                        <div className="absolute inset-0 flex items-center justify-center bg-[#F3E5C5] text-[#5D4037]/50">
                                            <Users size={64} />
                                        </div>
                                    </div>
                                    <h3 className="font-serif font-bold text-xl text-[#4A3225]">Trustee Name</h3>
                                    <p className="text-[#8D6E63] text-sm uppercase tracking-widest mt-1">Designation</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-12 text-primary/60 italic max-w-2xl mx-auto">
                            "Guided by wisdom, driven by devotion, and committed to transparency."
                        </p>
                    </div>
                </section> 
                */}

                {/* IMPACT / ACTIVITIES - Consistent with Objectives Style */}
                <section className="py-20 bg-background-cream relative">
                    {/* Top Separator Removed */}

                    <div className="container mx-auto px-4 lg:px-12 pt-12 relative z-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-center mb-16"
                        >
                            <h2 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-4">{translations[language].aboutPage.impactTitle}</h2>
                            <div className="w-24 h-1 bg-[#CFA14E] mx-auto rounded-full" />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { key: "annadanam", image: "/assets/obj_annadanam.png" },
                                { key: "education", image: "/assets/obj_education.png" },
                                { key: "culture", image: "/assets/obj_culture.png" },
                                { key: "welfare", image: "/assets/obj_welfare.png" },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="group bg-gradient-to-b from-[#FFFEF9] to-[#F3E5C5] rounded-2xl p-6 border border-[#CFA14E] shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_2px_4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_0_0_2px_#FFFDF8,inset_0_0_0_3px_#CFA14E,0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col items-center text-center cursor-pointer h-full relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-[url('/assets/texture-parchment.png')] opacity-40 pointer-events-none mix-blend-multiply" />

                                    {/* Image Container */}
                                    <div className="relative z-10 w-full h-24 flex items-center justify-center mb-4">
                                        <img
                                            src={item.image}
                                            alt={item.key}
                                            className="max-h-full w-auto object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 rounded-lg"
                                        />
                                    </div>

                                    <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037] mb-3 relative z-10 group-hover:text-[#8B5E3C] transition-colors">{t.aboutPage.impacts[item.key as 'annadanam' | 'education' | 'culture' | 'welfare'].title}</h3>
                                    <p className="text-sm text-primary/70 relative z-10 font-medium leading-relaxed">{t.aboutPage.impacts[item.key as 'annadanam' | 'education' | 'culture' | 'welfare'].desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="py-24 bg-[#F3E5C5]/30 text-center relative overflow-hidden border-t border-[#D4AF37]/20">
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                    <div className="container mx-auto px-4 relative z-10">
                        <h2 className="font-cinzel-decorative font-bold text-3xl md:text-5xl text-[#5D4037] mb-6">{translations[language].aboutPage.ctaTitle}</h2>
                        <p className="text-[#8D6E63] text-lg max-w-2xl mx-auto mb-10 font-medium">
                            {translations[language].aboutPage.ctaDescription}
                        </p>
                        <Link href="/donate#donate-form">
                            <span className="px-10 py-3 bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#F4C430,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_0_0_2px_#F4C430,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2 drop-shadow-md cursor-pointer inline-flex">
                                {translations[language].aboutPage.ctaButton}
                            </span>
                        </Link>
                    </div>
                </section>

            </div>

            <Footer />
        </main>
    );
}
