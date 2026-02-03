"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen pt-20 flex items-center overflow-hidden bg-primary text-white">
            {/* Background Gradient & Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#2E0249,transparent)] opacity-90" />

            {/* Animated Mandala/Pattern Placeholder */}
            <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-block px-4 py-1 border border-secondary/50 rounded-full text-secondary text-sm font-medium tracking-wide">
                        EST. 2024
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                        Serving <span className="text-secondary">Dharma</span> <br />
                        Spreading Devotion
                    </h1>
                    <div className="h-1 w-24 bg-secondary rounded-full" />
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-sans opacity-90 max-w-lg">
                        "Promoting Dharma & Social Welfare for a Better Society"
                        <br />
                        <span className="text-sm font-medium text-secondary/80 mt-1 block">
                            ಉತ್ತಮ ಸಮಾಜಕ್ಕಾಗಿ ಧರ್ಮ ಮತ್ತು ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣವನ್ನು ಉತ್ತೇಜಿಸುವುದು
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button className="px-8 py-3 bg-secondary hover:bg-secondary-light text-primary font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                            Donate Now
                            <ArrowRight size={18} />
                        </button>
                        <button className="px-8 py-3 border border-secondary/50 hover:bg-secondary/10 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2">
                            <Calendar size={18} />
                            Upcoming Events
                        </button>
                    </div>
                </motion.div>

                {/* Illustration / Image Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center"
                >
                    <div className="relative w-full h-full bg-gradient-to-tr from-secondary/20 to-primary-light rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden flex items-center justify-center group">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />

                        {/* Placeholder Text */}
                        <div className="text-center opacity-70">
                            <div className="text-6xl mb-4">🕉️</div>
                            <p className="font-serif text-secondary tracking-widest text-lg">TEMPLE ILLUSTRATION</p>
                            <p className="text-xs text-white/50 mt-2">Place image here</p>
                        </div>

                        {/* Decorative Corner Elements */}
                        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-secondary/50 rounded-tr-xl" />
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-secondary/50 rounded-bl-xl" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
