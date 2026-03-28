"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, UserCircle, LogOut, Sparkles, UserCheck } from "lucide-react";
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
    const [showServicesMenu, setShowServicesMenu] = useState(false);

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
        { name: t.events, href: "/events" },
        { name: t.services, href: "/services" },
        { name: t.gallery, href: "/gallery" },
        { name: t.donations, href: "/donate" },
        { name: t.contact, href: "/contact" },
    ];

    return (
        <>
            <header
                onClick={() => isOpen && setIsOpen(false)}
                className={`fixed top-0 w-full z-[1000] transition-all duration-500 border-b-4 border-double border-secondary/50 ${scrolled
                    ? "bg-background-cream/95 backdrop-blur-md py-1 shadow-md h-16 lg:h-20"
                    : "bg-background-cream/80 backdrop-blur-md py-3 h-20 lg:h-28"
                    } ${isOpen ? "cursor-pointer" : ""}`}
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

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-2 xl:gap-10 ml-auto">
                    {navLinks.map((link) => {
                        // Special case: Services gets a hover submenu
                        if (link.href === "/services") {
                            return (
                                <div
                                    key={link.name}
                                    className="relative"
                                    onMouseEnter={() => setShowServicesMenu(true)}
                                    onMouseLeave={() => setShowServicesMenu(false)}
                                >
                                    <Link
                                        href={link.href}
                                        className="relative text-[10px] lg:text-[13px] xl:text-sm font-serif font-bold uppercase tracking-[0.15em] text-primary-dark/80 hover:text-secondary-dark transition-colors group py-2 whitespace-nowrap flex items-center gap-1"
                                    >
                                        {link.name}
                                        <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-gradient-to-r from-secondary-light via-secondary to-secondary-dark transition-all duration-300 group-hover:w-full" />
                                    </Link>

                                    {/* Services Hover Submenu Popup */}
                                    <AnimatePresence>
                                        {showServicesMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.92, y: -8 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.92, y: -8 }}
                                                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-background-ivory border-4 border-double border-[#D4AF37] rounded-xl shadow-2xl z-[1200] overflow-hidden"
                                            >
                                                {/* Corner ornaments */}
                                                <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/40" />
                                                <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/40" />

                                                <div className="p-3 flex flex-col gap-1">
                                                    <Link
                                                        href="/services?section=booking"
                                                        onClick={() => setShowServicesMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors group/item"
                                                    >
                                                        <div className="p-1.5 rounded-full bg-secondary/10 group-hover/item:bg-secondary/20 transition-colors">
                                                            <Sparkles className="w-4 h-4 text-secondary-dark" />
                                                        </div>
                                                        <span className="text-sm font-serif font-bold text-primary-dark group-hover/item:text-secondary-dark transition-colors tracking-wide whitespace-nowrap">
                                                            Book A Divine Service
                                                        </span>
                                                    </Link>

                                                    <div className="h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent mx-3" />

                                                    <Link
                                                        href="/services?section=registration"
                                                        onClick={() => setShowServicesMenu(false)}
                                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors group/item"
                                                    >
                                                        <div className="p-1.5 rounded-full bg-secondary/10 group-hover/item:bg-secondary/20 transition-colors">
                                                            <UserCheck className="w-4 h-4 text-secondary-dark" />
                                                        </div>
                                                        <span className="text-sm font-serif font-bold text-primary-dark group-hover/item:text-secondary-dark transition-colors tracking-wide whitespace-nowrap">
                                                            Pandit Registration
                                                        </span>
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative text-[10px] lg:text-[13px] xl:text-sm font-serif font-bold uppercase tracking-[0.15em] text-primary-dark/80 hover:text-secondary-dark transition-colors group py-2 whitespace-nowrap"
                            >
                                {link.name}
                                <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-gradient-to-r from-secondary-light via-secondary to-secondary-dark transition-all duration-300 group-hover:w-full" />
                            </Link>
                        );
                    })}
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
                        className="p-2 rounded-lg bg-secondary/10 text-secondary-dark relative z-[1101]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(!isOpen);
                        }}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>

        {/* Mobile Menu Overlay System - Outside header to avoid containing block issues */}
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[900] lg:hidden cursor-pointer pointer-events-auto"
                    />

                    {/* Mobile Menu Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: 20, y: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 20, y: -20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="fixed top-20 right-4 w-[75vw] h-[75vh] max-h-[600px] lg:hidden bg-background-ivory/95 backdrop-blur-xl border-4 border-double border-[#D4AF37] rounded-2xl shadow-2xl z-[1100] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Scrollable Container - Hidden Scrollbar */}
                        <div className="flex flex-col h-full relative p-6 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {/* Decorative Corner Ornaments */}
                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]/30" />
                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]/30" />
                            
                            <nav className="flex flex-col space-y-4 items-center text-center mt-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-primary-dark hover:text-secondary-dark font-cinzel text-lg tracking-[0.1em] font-bold transition-all hover:scale-105 active:scale-95"
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent my-2" />

                                {/* Mobile User Actions */}
                                {session ? (
                                    <div className="flex flex-col items-center gap-3 w-full max-w-[200px] mx-auto">
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary-dark hover:bg-secondary/20 font-serif text-base tracking-wide font-bold transition-all text-center"
                                        >
                                            Admin Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsOpen(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-accent-saffron/10 border border-accent-saffron/20 rounded-xl text-accent-saffron hover:bg-accent-saffron/20 font-serif text-base tracking-wide font-bold transition-all"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsLoginModalOpen(true);
                                        }}
                                        className="px-8 py-2.5 bg-secondary/10 border-2 border-secondary text-secondary-dark rounded-full font-serif text-sm tracking-wide font-bold hover:bg-secondary/20 transition-all shadow-sm"
                                    >
                                        Admin Login
                                    </button>
                                )}
                            </nav>

                            <div className="mt-auto pt-8 flex flex-col items-center">
                                <p className="text-[#5D4037]/40 font-serif italic text-xs mb-2 text-center">
                                    Aradhana Dharmika Trust
                                </p>
                                <div className="flex items-center gap-4 text-secondary/40 scale-75">
                                    <span className="h-[1px] w-12 bg-current" />
                                    <span className="text-xl">ॐ</span>
                                    <span className="h-[1px] w-12 bg-current" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

            {/* Login Modal */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </>
    );
}
