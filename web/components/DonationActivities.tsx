"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DonationActivity {
    id: string;
    title: string;
    titleKn: string | null;
    description: string;
    descriptionKn: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    isActive: boolean;
    order: number;
}

const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&rel=0&loop=1&playlist=${match[2]}`;
    }
    return url;
};

export default function DonationActivities() {
    const { language } = useLanguage();
    const [activities, setActivities] = useState<DonationActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await fetch("/api/admin/donation-activities");
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data.filter((a: DonationActivity) => a.isActive));
                }
            } catch (error) {
                console.error("Failed to fetch donation activities", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full py-16 flex justify-center items-center bg-[#FDFBF7]">
                <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
            </div>
        );
    }

    if (activities.length === 0) {
        return null;
    }

    return (
        <section className="py-24 bg-[#FDFBF7] relative min-h-[40vh] border-b border-[#D4AF37]/10">
            {/* Very faint background pattern */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:400px_400px] bg-center opacity-[0.02] animate-spin-slow pointer-events-none mix-blend-multiply" />
            </div>

            <div className="container mx-auto px-4 lg:px-12 relative z-10 space-y-32">
                {activities.map((activity, index) => {
                    const isEven = index % 2 === 0;

                    return (
                        <div key={activity.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-16 items-center`}>

                            {/* Text Content */}
                            <motion.div
                                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8 }}
                                className="w-full lg:w-1/2 space-y-6"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`h-[2px] w-12 flex-shrink-0 bg-gradient-to-${isEven ? 'r' : 'l'} from-[#D4AF37] to-transparent`} />
                                    <span className={`font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63] uppercase ${language === 'kn' ? 'font-kannada' : ''}`}>
                                        {language === 'kn' ? "ಸಕ್ರಿಯ ಉಪಕ್ರಮ" : "Active Initiative"}
                                    </span>
                                    {isEven || <div className="h-[2px] w-12 flex-shrink-0 bg-gradient-to-r from-[#D4AF37] to-transparent" />}
                                </div>

                                <h2 className={`text-3xl md:text-4xl lg:text-5xl font-cinzel-decorative font-bold text-[#5D4037] leading-tight drop-shadow-sm ${language === 'kn' ? 'font-kannada leading-normal' : ''}`}>
                                    {language === 'kn' && activity.titleKn ? activity.titleKn : activity.title}
                                </h2>

                                <div className={`prose prose-lg prose-brown max-w-none text-gray-700 leading-relaxed font-serif whitespace-pre-wrap ${language === 'kn' ? 'font-kannada leading-loose' : ''}`}>
                                    {language === 'kn' && activity.descriptionKn ? activity.descriptionKn : activity.description}
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={() => document.getElementById('donate-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        className={`h-12 px-8 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_15px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 ${language === 'kn' ? 'font-kannada' : ''}`}
                                    >
                                        {language === 'kn' ? "ಈಗಲೇ ಕೊಡುಗೆ ನೀಡಿ" : "Contribute Now"}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Media Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-full lg:w-1/2 relative group"
                            >
                                {/* Glow backdrop */}
                                <div className="absolute inset-4 rounded-3xl bg-[#D4AF37]/20 blur-2xl transform translate-y-4 lg:translate-y-6 -z-10" />

                                <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl border-[4px] md:border-[6px] border-double border-[#D4AF37]/40 bg-[#FFFDF9]">
                                    {/* Inner precise gold stroke */}
                                    <div className="absolute inset-2 rounded-[1rem] md:rounded-[1.25rem] border-2 border-[#D4AF37] pointer-events-none z-20 opacity-60" />

                                    {activity.videoUrl ? (
                                        <iframe
                                            src={getYouTubeEmbedUrl(activity.videoUrl)}
                                            className="absolute inset-0 w-full h-full z-10"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : activity.imageUrl ? (
                                        <>
                                            <Image
                                                src={activity.imageUrl}
                                                alt={activity.title}
                                                fill
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] z-10"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                            {/* Vignette */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/50 via-transparent to-transparent pointer-events-none z-10" />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-[#FDFBF7] flex items-center justify-center z-10">
                                            <span className="text-[#8D6E63] font-serif italic text-lg opacity-50">Initiative Media Pending</span>
                                        </div>
                                    )}
                                </div>

                                {/* Beautiful Outer Corners */}
                                <div className="absolute -top-3 -left-3 w-12 h-12 bg-[#FDFBF7] rounded-full z-30 flex items-center justify-center drop-shadow-md lg:drop-shadow-lg opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]" />
                                </div>
                                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#FDFBF7] rounded-full z-30 flex items-center justify-center drop-shadow-md lg:drop-shadow-lg opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37]" />
                                </div>
                            </motion.div>

                        </div>
                    );
                })}
            </div>
        </section>
    );
}
