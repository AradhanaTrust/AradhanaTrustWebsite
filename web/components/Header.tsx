"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Donations", href: "#donations" },
    { name: "Events", href: "#events" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-primary text-white border-b-2 border-secondary shadow-lg">
            <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2">
                    {/* Placeholder for Logo */}
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">
                        A
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-serif font-bold tracking-wide text-secondary">
                            Aradhana
                        </h1>
                        <span className="text-[10px] md:text-xs uppercase tracking-widest opacity-90">
                            Dharmika Trust
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="relative text-sm font-medium hover:text-secondary transition-colors group"
                        >
                            {link.name}
                            <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-secondary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                    <button className="px-4 py-1.5 border border-secondary text-secondary rounded-full text-xs font-bold hover:bg-secondary hover:text-primary transition-all">
                        KANNADA
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-secondary"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-primary-dark border-b border-white/10 overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-secondary font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-2">
                                <button className="px-4 py-2 border border-secondary text-secondary rounded w-full text-sm font-bold">
                                    SWITCH TO KANNADA
                                </button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
