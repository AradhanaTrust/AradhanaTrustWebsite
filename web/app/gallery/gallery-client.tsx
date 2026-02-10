"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { galleryCategories, type GalleryCategory } from "@/lib/galleryData";

export interface GalleryImage {
    id: string | number;
    src: string;
    category: string;
    alt: string;
    titleKey?: string;
    title?: string;
}

interface GalleryClientProps {
    initialImages: GalleryImage[];
}

export default function GalleryClient({ initialImages }: GalleryClientProps) {
    const { language } = useLanguage();
    const t = translations[language].galleryPage;

    const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("All");
    const [lightboxImageId, setLightboxImageId] = useState<string | number | null>(null);

    // Filter images based on selected category
    const filteredImages = selectedCategory === "All"
        ? initialImages
        : initialImages.filter(img => img.category === selectedCategory);

    // Lightbox navigation
    const openLightbox = (imageId: string | number) => {
        setLightboxImageId(imageId);
    };

    const closeLightbox = () => {
        setLightboxImageId(null);
    };

    const goToNext = () => {
        if (lightboxImageId !== null) {
            const currentIndex = filteredImages.findIndex(img => img.id === lightboxImageId);
            const nextIndex = (currentIndex + 1) % filteredImages.length;
            setLightboxImageId(filteredImages[nextIndex].id);
        }
    };

    const goToPrev = () => {
        if (lightboxImageId !== null) {
            const currentIndex = filteredImages.findIndex(img => img.id === lightboxImageId);
            const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
            setLightboxImageId(filteredImages[prevIndex].id);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (lightboxImageId !== null) {
                if (e.key === "Escape") closeLightbox();
                if (e.key === "ArrowRight") goToNext();
                if (e.key === "ArrowLeft") goToPrev();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [lightboxImageId]);

    const currentLightboxImage = initialImages.find(img => img.id === lightboxImageId);

    // Category mapping for translations
    const getCategoryTranslation = (category: string) => {
        const map: Record<string, string> = {
            "All": t.categories.all,
            "Temple Events": t.categories.templeEvents,
            "Deity Darshan": t.categories.deityDarshan,
            "Annadanam": t.categories.annadanam,
            "Cultural Programs": t.categories.cultural,
            "Social Welfare": t.categories.welfare
        };
        return map[category] || category;
    };

    // Get translated image title
    const getImageTitle = (image: GalleryImage) => {
        if (image.title) return image.title;
        if (image.titleKey) return t.imageTitles[image.titleKey as keyof typeof t.imageTitles] || image.titleKey;
        return "";
    };

    return (
        <main className="min-h-screen bg-background-ivory">
            <Header />

            {/* Hero Section */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-background-cream to-background-ivory relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-mandala-premium opacity-[0.03] animate-spin-slow pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-4"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-center gap-4 text-secondary mb-2">
                            <span className="h-[1.5px] w-16 md:w-24 bg-gradient-to-r from-transparent to-secondary" />
                            <span className="font-serif uppercase tracking-[0.2em] text-sm md:text-base font-bold text-secondary-dark">
                                {t.subtitle}
                            </span>
                            <span className="h-[1.5px] w-16 md:w-24 bg-gradient-to-r from-secondary to-transparent" />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif font-medium text-primary-dark leading-tight">
                            {t.title}
                        </h1>

                        {/* Decorative Divider */}
                        <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto opacity-80 py-3">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary" />
                            <div className="w-2.5 h-2.5 bg-secondary rotate-45 shadow-sm" />
                            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-background-ivory sticky top-20 z-40 border-b-2 border-secondary/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                        {galleryCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 font-serif font-medium text-sm md:text-base rounded-full border-2 transition-all duration-300 ${selectedCategory === category
                                    ? "bg-secondary text-white border-secondary shadow-lg scale-105"
                                    : "bg-background-cream text-primary-dark border-secondary/30 hover:border-secondary hover:shadow-md hover:scale-105"
                                    }`}
                            >
                                {getCategoryTranslation(category)}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 bg-background-ivory">
                <div className="container mx-auto px-4 lg:px-12">
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredImages.map((image) => (
                                <motion.div
                                    key={image.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="cursor-pointer group"
                                    onClick={() => openLightbox(image.id)}
                                >
                                    {/* Temple-Inspired Frame */}
                                    <div className="relative pt-4 pb-6 px-3 bg-gradient-to-b from-[#F9F1D8] to-[#D4B483] rounded-sm shadow-2xl border-x-2 border-[#CFA14E] hover:shadow-3xl transition-shadow duration-300">

                                        {/* Top Molding */}
                                        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-[#CFA14E] to-[#8B5E3C] border-b border-[#FFFDF8]/30 flex justify-center gap-1 items-center z-10">
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        </div>

                                        {/* Pillar Elements */}
                                        <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-[#8B5E3C] to-[#CFA14E] border-r border-[#4A3225]/20" />
                                        <div className="absolute top-0 bottom-0 right-0 w-2 bg-gradient-to-l from-[#8B5E3C] to-[#CFA14E] border-l border-[#4A3225]/20" />

                                        {/* Image Container */}
                                        <div className="relative bg-[#4A3225] p-1.5 shadow-inner">
                                            <div className="relative h-64 w-full overflow-hidden border border-[#CFA14E]/50 rounded-[2px]">
                                                <Image
                                                    src={image.src}
                                                    alt={image.alt}
                                                    fill
                                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                                {/* Vignette */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                                                {/* Title Overlay */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                                    <p className="text-white font-serif text-sm font-medium">{getImageTitle(image)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Base */}
                                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-[#CFA14E] to-[#8B5E3C] border-t border-[#FFFDF8]/30 flex justify-center gap-1 items-center">
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                            <div className="w-1 h-1 rounded-full bg-[#4A3225]/40" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* No Results Message */}
                    {filteredImages.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-xl text-primary/60 font-serif">No images found in this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxImageId !== null && currentLightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                            className="absolute left-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-10"
                        >
                            <ChevronLeft size={28} />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); goToNext(); }}
                            className="absolute right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all z-10"
                        >
                            <ChevronRight size={28} />
                        </button>

                        {/* Image */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-7xl max-h-[90vh] mx-auto px-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <Image
                                    src={currentLightboxImage.src}
                                    alt={currentLightboxImage.alt}
                                    width={1200}
                                    height={800}
                                    className="max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl"
                                />

                                {/* Image Info - Two Separate Glassmorphic Pills */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center">
                                    {/* Title Pill - Gold */}
                                    <div className="px-6 py-2 bg-white/10 backdrop-blur-xl border-2 border-[#D4AF37]/50 rounded-full shadow-2xl">
                                        <h3 className="text-[#D4AF37] font-serif text-lg md:text-xl font-bold text-center drop-shadow-lg whitespace-nowrap">
                                            {getImageTitle(currentLightboxImage)}
                                        </h3>
                                    </div>
                                    {/* Category Pill - Ivory */}
                                    <div className="px-5 py-1.5 bg-white/10 backdrop-blur-xl border border-[#FDFBF7]/30 rounded-full shadow-xl">
                                        <p className="text-[#FDFBF7] text-sm md:text-base font-medium text-center">
                                            {getCategoryTranslation(currentLightboxImage.category)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
