"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [isOpen, setIsOpen] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language].nav;

    const navLinks = [
        { name: t.home, href: "/" },
        { name: t.about, href: "#about" },
        { name: t.gallery, href: "#gallery" },
        { name: t.donations, href: "#donations" },
        { name: t.events, href: "#events" },
        { name: t.contact, href: "#contact" },
    ];

    return (
        <header className={`fixed top-0 w-full z-50 backdrop-blur-md text-primary shadow-sm border-b-4 border-double border-secondary/50 transition-all duration-500 ${scrolled ? "bg-background-cream/95 py-2" : "bg-background/80 py-4"}`}>
            <div className="w-full px-4 lg:px-12 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 lg:gap-4 group relative z-50">
                    <img src="/assets/Logo_Main.png" alt="Aradhana Dharmika Trust" className="h-9 md:h-12 lg:h-16 xl:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm" />
                    <div className="flex flex-col justify-center">
                        <span className="font-cinzel-decorative font-black text-lg md:text-xl lg:text-2xl xl:text-3xl tracking-wide text-[#5D4037] leading-none drop-shadow-sm mb-1">{t.trustNameLine1}</span>
                        <span className="font-cinzel-decorative font-black text-[10px] md:text-xs lg:text-sm xl:text-lg tracking-[0.15em] text-[#795548] leading-tight">{t.trustNameLine2}</span>
                    </div>
                </Link>

                {/* Desktop Navigation - Centered & Premium */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-serif font-bold uppercase tracking-[0.1em] text-primary-dark/80 hover:text-secondary-dark transition-colors group py-2"
                        >
                            {link.name}
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Right Section: Language Toggle (Small) */}
                <div className="hidden lg:block">
                    <button
                        onClick={toggleLanguage}
                        className="text-[10px] font-bold tracking-widest border border-secondary text-secondary-dark hover:bg-secondary hover:text-white px-4 py-2 rounded-full transition-all uppercase"
                    >
                        {t.toggleBtn}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-secondary-dark"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-background border-b border-secondary/20 overflow-hidden"
                    >
                        <nav className="flex flex-col p-8 space-y-6 items-center text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-primary hover:text-secondary-dark font-serif text-xl tracking-wide font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-6 w-full max-w-xs">
                                <button
                                    onClick={() => { toggleLanguage(); setIsOpen(false); }}
                                    className="w-full py-3 border border-secondary text-secondary-dark rounded-full text-xs font-bold tracking-widest uppercase hover:bg-secondary hover:text-white transition-colors"
                                >
                                    {t.toggleBtn}
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
