"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, QrCode, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { donationConfig } from "@/lib/donation-config";

export default function Donation() {
    const { language } = useLanguage();
    const t = translations[language].donation;
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(donationConfig.upiId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="donations" className="py-24 relative bg-background-cream overflow-hidden">


            <div className="container-gold relative z-10 text-primary-dark">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-7xl mx-auto">

                    <div className="space-y-8 text-center max-w-md mx-auto">
                        <div className="inline-block px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-secondary-dark text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                            {t.badge}
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium leading-tight whitespace-pre-line">
                            {t.title}
                        </h2>


                        <p className="text-primary/70 text-base sm:text-lg leading-relaxed font-light">
                            {t.text}
                        </p>

                        <div className="pt-4 flex flex-col gap-4 w-full">
                            <div
                                onClick={handleCopy}
                                className="bg-white p-4 sm:p-5 rounded-xl border border-secondary/20 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all shadow-sm active:scale-95 w-full overflow-hidden gap-2"
                            >
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-[10px] sm:text-xs text-secondary-dark uppercase tracking-widest font-bold mb-1">UPI ID</p>
                                    <p className="text-xs sm:text-sm md:text-base font-mono font-bold text-primary break-all">{donationConfig.upiId}</p>
                                </div>
                                <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${copied ? "bg-green-100 text-green-600" : "bg-secondary/10 text-secondary-dark group-hover:bg-secondary group-hover:text-white"}`}>
                                    {copied ? <Check size={16} className="sm:w-5 sm:h-5" /> : <Copy size={16} className="sm:w-5 sm:h-5" />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-secondary/10 max-w-md mx-auto text-center space-y-6 relative overflow-hidden w-full"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary-light to-secondary" />

                        <h3 className="text-primary-dark font-serif font-bold text-xl uppercase tracking-widest">{t.scanTitle}</h3>

                        <div className="aspect-square bg-background-ivory rounded-xl border-4 border-double border-secondary/30 flex items-center justify-center relative overflow-hidden group p-2">
                            <Image
                                src={donationConfig.qrCodeImage}
                                alt="Donate QR Code"
                                fill
                                sizes="(max-width: 768px) 100vw, 400px"
                                className="object-contain p-1 group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="space-y-3">
                            <Link href="/donate">
                                <button className="w-full py-4 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] uppercase tracking-wider">
                                    {t.razorpayBtn}
                                </button>
                            </Link>

                            <p className="text-xs text-primary/40 font-medium tracking-wide">
                                {t.accepted}
                            </p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
