"use client";

import { motion } from "framer-motion";

export default function Gallery() {
    return (
        <section id="gallery" className="py-20 bg-primary text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-mandala-pattern opacity-5" />

            <div className="container mx-auto px-4 lg:px-12 relative z-10">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Photo Gallery</h2>
                    <p className="text-secondary font-medium">ಛಾಯಾಚಿತ್ರ ಗ್ಯಾಲರಿ</p>
                    <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
                    {/* Main Large Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="col-span-2 row-span-2 bg-gray-800 rounded-2xl overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                        <div className="absolute bottom-4 left-4">
                            <p className="text-white font-bold">Temple Premises</p>
                        </div>
                    </motion.div>

                    {/* Smaller Images */}
                    {[1, 2, 3, 4].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-700 rounded-2xl overflow-hidden relative group"
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="px-8 py-3 border border-secondary text-secondary hover:bg-secondary hover:text-primary font-bold rounded-full transition-all">
                        View Full Gallery
                    </button>
                </div>
            </div>
        </section>
    );
}
