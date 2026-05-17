"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Compass, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background-cream flex flex-col font-poppins text-primary/80">
      <Header />
      
      <div className="flex-grow flex items-center justify-center relative py-32 px-4">
        {/* Background Mandala */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-5 mix-blend-multiply overflow-hidden">
            <div className="w-[800px] h-[800px] bg-[url('/assets/mandala-bg.svg')] bg-contain bg-no-repeat bg-center animate-spin-slow" />
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center max-w-2xl mx-auto"
        >
            <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-[#F3E5C5] to-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <Compass size={40} className="text-[#8D6E63]" />
                </div>
            </div>

            <h1 className="font-cinzel-decorative font-bold text-8xl md:text-9xl text-[#D4AF37] mb-2 drop-shadow-sm">
                404
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium mb-6">
                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                <span className="font-serif italic tracking-wider text-lg md:text-xl text-[#8D6E63]">Path Not Found</span>
                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
            </div>

            <p className="text-lg text-[#5D4037] leading-relaxed font-medium mb-10 px-4">
                The sacred space you are seeking appears to be hidden or no longer exists. 
                Let us guide you back to the spiritual journey.
            </p>

            <Link href="/">
                <span className="px-8 py-3 bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#F4C430,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_0_0_2px_#F4C430,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.2)] hover:-translate-y-1 active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-3 inline-flex">
                    <Home size={20} />
                    Return to Sanctuary
                </span>
            </Link>
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
