"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Welcome() {
    return (
        <section id="about" className="relative py-20 lg:py-32 bg-surface overflow-hidden">
            {/* Decorative Top Curve - simulates the "Curved top edge" from prompt */}
            <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-primary to-surface opacity-10 rounded-b-[100%]" />

            <div className="container mx-auto px-4 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <div className="flex items-center justify-center gap-4 text-secondary/60">
                        <span className="h-px w-12 bg-current" />
                        <span className="font-serif uppercase tracking-widest text-xs font-bold">About Us</span>
                        <span className="h-px w-12 bg-current" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Aradhana Dharmika Trust</span>
                    </h2>

                    <h3 className="text-lg md:text-xl font-medium text-secondary-dark italic">
                        "Promoting Dharma, Spiritual Awareness, and Social Welfare"
                    </h3>

                    <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />

                    <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                        Our mission is to preserve the sanctity of Sanatana Dharma while actively engaging in social welfare.
                        From conducting Vedic rituals to providing Annadanam and educational support, we strive to build a
                        community rooted in devotion and humanity.
                    </p>

                    <p className="font-kannada text-gray-500 font-medium">
                        ನಮ್ಮ ಉದ್ದೇಶವು ಸನಾತನ ಧರ್ಮದ ಪಾವಿತ್ರ್ಯವನ್ನು ಕಾಪಾಡುವುದು ಮತ್ತು ಸಾಮಾಜಿಕ ಕಲ್ಯಾಣದಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿ ತೊಡಗುವುದು.
                    </p>

                    <div className="pt-8">
                        <button className="px-8 py-3 bg-primary hover:bg-primary-light text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2">
                            Learn More <ArrowRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
