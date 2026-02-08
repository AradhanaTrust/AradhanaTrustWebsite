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


            <div className="container mx-auto px-4 lg:px-12 relative z-10 text-primary-dark">
                <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">

                    <div className="space-y-8 text-center max-w-md mx-auto">
                        <div className="inline-block px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-secondary-dark text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                            {t.badge}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight whitespace-pre-line">
                            {t.title}
                        </h2>


                        <p className="text-primary/70 text-lg leading-relaxed font-light">
                            {t.text}
                        </p>

                        <div className="pt-4 flex flex-col gap-4">
                            <div
                                onClick={handleCopy}
                                className="bg-white p-5 rounded-xl border border-secondary/20 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all shadow-sm active:scale-95"
                            >
                                <div className="text-left">
                                    <p className="text-xs text-secondary-dark uppercase tracking-widest font-bold">UPI ID</p>
                                    <p className="text-lg font-mono font-bold text-primary">{donationConfig.upiId}</p>
                                </div>
                                <div className={`p-2 rounded-lg transition-colors ${copied ? "bg-green-100 text-green-600" : "bg-secondary/10 text-secondary-dark group-hover:bg-secondary group-hover:text-white"}`}>
                                    {copied ? <Check size={20} /> : <Copy size={20} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-secondary/10 max-w-md mx-auto text-center space-y-6 relative overflow-hidden"
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
