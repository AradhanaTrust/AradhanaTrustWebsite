"use client";

import { motion } from "framer-motion";
import { Copy, QrCode } from "lucide-react";

export default function Donation() {
    return (
        <section id="donations" className="py-20 relative bg-background overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-[0.97]" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10 text-white">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    <div className="space-y-6">
                        <div className="inline-block px-3 py-1 bg-secondary/20 border border-secondary/50 rounded-full text-secondary text-xs font-bold tracking-widest uppercase mb-2">
                            Support Our Cause
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                            Your Contribution <br />
                            <span className="text-secondary">Sustains Dharma</span>
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            All donations are tax-exempt under 80G. Your support helps us perform Annadanam, maintain the temple, and conduct cultural activities.
                        </p>

                        <div className="pt-4 flex flex-col gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                                <div>
                                    <p className="text-xs text-white/60 uppercase tracking-widest">UPI ID</p>
                                    <p className="text-lg font-mono font-bold text-secondary">aradhana@upi</p>
                                </div>
                                <Copy className="text-white/60 group-hover:text-white transition-colors" size={20} />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm mx-auto text-center space-y-6"
                    >
                        <h3 className="text-primary font-bold text-xl uppercase tracking-widest">Scan to Donate</h3>

                        <div className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                            <QrCode size={120} className="text-gray-400 group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 to-transparent pointer-events-none" />
                        </div>

                        <button className="w-full py-3 bg-gradient-to-r from-secondary to-secondary-dark text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                            Donate via Razorpay
                        </button>

                        <p className="text-xs text-gray-400">
                            Accepted: GPay, PhonePe, Paytm, Cards
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
