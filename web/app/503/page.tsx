"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Settings, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Maintenance503() {
  return (
    <main className="min-h-screen bg-background-cream flex flex-col font-poppins text-primary/80">
      <Header />
      
      <div className="flex-grow flex items-center justify-center relative py-32 px-4">
        {/* Background Mandala */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-5 mix-blend-multiply overflow-hidden">
            <div className="w-[800px] h-[800px] bg-[url('/assets/mandala-bg.svg')] bg-contain bg-no-repeat bg-center animate-spin-slow" />
        </div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-2xl mx-auto bg-[url('/assets/texture-parchment.png')] bg-cover bg-[#FFFBE6] border border-[#CFA14E]/30 p-10 md:p-16 rounded-sm shadow-xl"
        >
            {/* Corner Ornaments */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#CFA14E] rounded-tl-3xl opacity-50" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#CFA14E] rounded-tr-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#CFA14E] rounded-bl-3xl opacity-50" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#CFA14E] rounded-br-3xl opacity-50" />

            <div className="flex justify-center mb-8 relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[#F3E5C5] to-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <Settings size={40} className="text-[#8D6E63] animate-spin-slow" />
                </div>
            </div>

            <h1 className="font-cinzel-decorative font-bold text-5xl md:text-7xl text-[#D4AF37] mb-4 drop-shadow-sm">
                503
            </h1>
            
            <h2 className="font-cinzel-decorative font-bold text-2xl md:text-3xl text-[#4A3225] mb-4">
                Sacred Maintenance
            </h2>

            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium mb-6">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                <Clock size={16} className="text-[#8D6E63]" />
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
            </div>

            <p className="text-lg text-[#5D4037] leading-relaxed font-medium px-4">
                Our digital sanctuary is currently undergoing necessary maintenance and spiritual enrichment. 
                Please return shortly to continue your journey with us.
            </p>

        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
