"use client";

import { motion } from "framer-motion";
import { Copy, QrCode } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function Donation() {
    const { language } = useLanguage();
    const t = translations[language].donation;

    return (
        <section id="donations" className="py-24 relative bg-background-cream overflow-hidden">
            {/* Ornamental Divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10 text-primary-dark">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-block px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-secondary-dark text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                            {t.badge}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight">
                            {t.title}
                        </h2>
                        <div className="h-1 w-24 bg-secondary rounded-full mx-auto lg:mx-0" />

                        <p className="text-primary/70 text-lg leading-relaxed font-light">
                            {t.text}
                        </p>

                        <div className="pt-4 flex flex-col gap-4 max-w-md mx-auto lg:mx-0">
                            <div className="bg-white p-5 rounded-xl border border-secondary/20 flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all shadow-sm">
                                <div className="text-left">
                                    <p className="text-xs text-secondary-dark uppercase tracking-widest font-bold">UPI ID</p>
                                    <p className="text-lg font-mono font-bold text-primary">aradhana@upi</p>
                                </div>
                                <div className="p-2 bg-secondary/10 rounded-lg text-secondary-dark group-hover:bg-secondary group-hover:text-white transition-colors">
                                    <Copy size={20} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-secondary/10 max-w-sm mx-auto text-center space-y-8 relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary-light to-secondary rounded-t-[2rem]" />

                        <h3 className="text-primary-dark font-serif font-bold text-xl uppercase tracking-widest">{t.scanTitle}</h3>

                        <div className="aspect-square bg-background-ivory rounded-xl border-4 border-double border-secondary/30 flex items-center justify-center relative overflow-hidden group p-4">
                            <Image
                                src="/assets/donation-qr.png"
                                alt="Donate QR Code"
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <button className="w-full py-4 bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all uppercase tracking-wider text-sm">
                            {t.razorpayBtn}
                        </button>

                        <p className="text-xs text-primary/40 font-medium tracking-wide">
                            {t.accepted}
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
