"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Header() {
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
        <header className="fixed top-0 w-full z-50 bg-gradient-to-r from-primary-gradient-start to-primary-gradient-end text-white shadow-md border-b border-secondary/20">
            <div className="container mx-auto px-4 lg:px-12 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/assets/Logo_Main.png" alt="Aradhana Dharmika Trust" className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </Link>

                {/* Desktop Navigation - Centered & Premium */}
                <nav className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-xs font-bold uppercase tracking-widest text-white/80 hover:text-secondary transition-colors group py-1"
                        >
                            {link.name}
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[1.5px] bg-secondary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Right Section: Language Toggle (Small) */}
                <div className="hidden md:block">
                    <button
                        onClick={toggleLanguage}
                        className="text-[10px] font-bold tracking-widest border border-secondary/40 px-3 py-1 rounded text-secondary hover:bg-secondary hover:text-primary transition-all uppercase"
                    >
                        {t.toggleBtn}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-secondary"
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
                        className="md:hidden bg-primary border-b border-secondary/20 overflow-hidden"
                    >
                        <nav className="flex flex-col p-6 space-y-4 items-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/90 hover:text-secondary font-serif text-lg tracking-wide"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4 w-full">
                                <button
                                    onClick={() => { toggleLanguage(); setIsOpen(false); }}
                                    className="w-full py-3 bg-secondary/10 border border-secondary text-secondary rounded-full text-xs font-bold tracking-widest uppercase"
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
