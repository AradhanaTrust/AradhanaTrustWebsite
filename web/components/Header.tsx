"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useSession, signOut } from "next-auth/react";
import LoginModal from "./LoginModal";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { data: session } = useSession();
    const { language, toggleLanguage } = useLanguage();
    const t = translations[language].nav;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: t.home, href: "/" },
        { name: t.about, href: "/about" },
        { name: t.gallery, href: "/gallery" },
        { name: t.donations, href: "/donate" },
        { name: t.events, href: "/events" },
        { name: t.contact, href: "/contact" },
    ];

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-500 border-b-4 border-double border-secondary/50 ${scrolled
                ? "bg-background-cream/95 backdrop-blur-md py-1 shadow-md h-16 lg:h-20"
                : "bg-background-cream/80 backdrop-blur-md py-3 h-20 lg:h-28"
                }`}
        >
            <div className="container-gold h-full flex items-center justify-between gap-4">
                {/* Logo Section */}
                <Link
                    href="/"
                    className="flex items-center gap-2 md:gap-3 group relative z-[100] cursor-pointer"
                >
                    <div className="relative flex-shrink-0">
                        <img
                            src="/assets/Logo_Main.png"
                            alt="Aradhana Dharmika Trust"
                            className={`w-auto object-contain transition-all duration-500 group-hover:scale-105 filter drop-shadow-md ${scrolled ? "h-9 lg:h-10 xl:h-12" : "h-10 lg:h-12 xl:h-16"
                                }`}
                        />
                    </div>
                    <div className="flex flex-col justify-center transition-all duration-500">
                        <span className={`font-cinzel-decorative font-black tracking-wide text-[#5D4037] leading-none drop-shadow-sm transition-all duration-500 whitespace-nowrap ${scrolled ? "text-lg lg:text-xl xl:text-2xl" : "text-xl lg:text-2xl xl:text-3xl"
                            }`}>
                            {t.trustNameLine1}
                        </span>
                        {/* Tagline: Always visible, scales down on Compact Desktop */}
                        <span className={`font-cinzel-decorative font-black tracking-[0.2em] text-[#795548] leading-tight transition-all duration-500 whitespace-nowrap ${scrolled ? "text-[10px] xl:text-xs" : "text-xs xl:text-base"
                            }`}>
                            {t.trustNameLine2}
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation - Compact (gap-4) -> Spacious (gap-10) */}
                <nav className="hidden lg:flex items-center gap-2 xl:gap-10 ml-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-[10px] lg:text-[13px] xl:text-sm font-serif font-bold uppercase tracking-[0.15em] text-primary-dark/80 hover:text-secondary-dark transition-colors group py-2 whitespace-nowrap"
                        >
                            {link.name}
                            <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-gradient-to-r from-secondary-light via-secondary to-secondary-dark transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Right Section: User Icon + Language Toggle */}
                <div className="hidden lg:flex items-center gap-3 xl:gap-6">
                    {/* User Authentication */}
                    <div className="relative">
                        <button
                            onClick={() => session ? setShowUserMenu(!showUserMenu) : setIsLoginModalOpen(true)}
                            className={`flex items-center gap-2 lg:gap-3 p-1.5 rounded-full transition-all duration-300 group border-2 ${session ? "pr-3 lg:pr-4" : ""
                                } ${scrolled ? "border-secondary/20 bg-secondary/5" : "border-secondary/40 bg-white/10"
                                } hover:border-secondary hover:bg-secondary/10`}
                            aria-label={session ? "User menu" : "Login"}
                        >
                            <div className="bg-secondary/20 rounded-full p-1 flex-shrink-0">
                                <UserCircle className="w-6 h-6 text-secondary-dark" />
                            </div>
                            {session && (
                                <span className="text-xs lg:text-sm font-bold font-serif tracking-wider text-primary-dark hidden lg:inline-block">
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                            )}
                        </button>

                        {/* User Menu Dropdown */}
                        <AnimatePresence>
                            {session && showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-4 w-56 bg-white border-2 border-secondary/30 rounded-xl shadow-2xl overflow-hidden z-[110]"
                                >
                                    <div className="p-4 bg-background-cream/50 border-b border-secondary/20">
                                        <p className="text-sm font-bold text-primary-dark truncate font-serif">
                                            {session.user?.name}
                                        </p>
                                        <p className="text-xs text-primary/60 truncate">{session.user?.email}</p>
                                        <div className="mt-2 text-[10px] font-bold px-2 py-0.5 bg-secondary/20 text-secondary-dark rounded-full inline-block uppercase tracking-tighter">
                                            {session.user?.role?.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <div className="p-1">
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setShowUserMenu(false)}
                                            className="block px-4 py-3 text-sm font-bold text-primary-dark hover:bg-secondary/10 rounded-lg transition-colors font-serif"
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-accent-saffron hover:bg-accent-saffron/10 rounded-lg transition-colors font-serif"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className={`text-[10px] xl:text-[11px] font-black tracking-widest border-2 border-secondary px-4 xl:px-6 py-2 xl:py-2.5 rounded-full transition-all uppercase shadow-sm hover:shadow-md active:scale-95 ${scrolled ? "bg-white text-secondary-dark" : "bg-secondary text-white"
                            }`}
                    >
                        {t.toggleBtn}
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="text-[10px] font-bold px-3 py-1.5 border border-secondary rounded-full text-secondary-dark"
                    >
                        {t.toggleBtn}
                    </button>
                    <button
                        className="p-2 rounded-lg bg-secondary/10 text-secondary-dark"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-x-0 top-[60px] md:top-[70px] lg:hidden bg-white/95 backdrop-blur-xl border-b-2 border-secondary/20 shadow-2xl overflow-hidden z-40 h-[calc(100vh-60px)] md:h-[calc(100vh-70px)] flex flex-col pt-12"
                    >
                        <nav className="flex flex-col p-8 space-y-8 items-center text-center">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-primary-dark hover:text-secondary-dark font-cinzel text-2xl tracking-[0.1em] font-bold transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent my-4" />

                            {/* Mobile User Actions */}
                            {session ? (
                                <div className="flex flex-col items-center gap-6">
                                    <Link
                                        href="/admin/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="text-secondary-dark hover:text-secondary font-serif text-xl tracking-wide font-bold"
                                    >
                                        Admin Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            signOut({ callbackUrl: '/' });
                                        }}
                                        className="flex items-center gap-2 text-accent-saffron hover:text-accent-saffron/80 font-serif text-xl tracking-wide font-bold"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsLoginModalOpen(true);
                                    }}
                                    className="px-8 py-3 bg-secondary/10 border-2 border-secondary text-secondary-dark rounded-full font-serif text-lg tracking-wide font-bold"
                                >
                                    Admin Login
                                </button>
                            )}
                        </nav>

                        <div className="mt-auto pb-12 px-8 flex flex-col items-center">
                            <p className="text-[#5D4037]/40 font-serif italic text-sm mb-4">
                                Aradhana Dharmika Trust
                            </p>
                            <div className="flex items-center gap-4 text-secondary/40">
                                <span className="h-[1px] w-12 bg-current" />
                                <span className="text-xl">ॐ</span>
                                <span className="h-[1px] w-12 bg-current" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </header>
    );
}
