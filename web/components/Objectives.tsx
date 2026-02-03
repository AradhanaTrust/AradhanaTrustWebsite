"use client";

import { motion } from "framer-motion";
import { BookOpen, HandHeart, Home, Music, Users, Utensils } from "lucide-react";

const objectives = [
    {
        title: "Temple Activities",
        kan: "ದೇವಾಲಯ ಕಾರ್ಯಕ್ರಮಗಳು",
        icon: Home,
        color: "bg-orange-100 text-orange-600",
    },
    {
        title: "Annadanam",
        kan: "ಅನ್ನದಾನ",
        icon: Utensils,
        color: "bg-yellow-100 text-yellow-600",
    },
    {
        title: "Vedic Pooja",
        kan: "ವೇದ ಪೂಜೆ",
        icon: BookOpen,
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Spiritual Education",
        kan: "ಆಧ್ಯಾತ್ಮಿಕ ಶಿಕ್ಷಣ",
        icon: Music, // Using Music as proxy for cultural/spiritual vibes or Book
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Social Welfare",
        kan: "ಸಮಾಜ ಸೇವೆ",
        icon: Users,
        color: "bg-green-100 text-green-600",
    },
    {
        title: "Cultural Programs",
        kan: "ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳು",
        icon: HandHeart,
        color: "bg-pink-100 text-pink-600",
    },
];

export default function Objectives() {
    return (
        <section className="py-20 bg-background border-t border-b border-gray-100">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Our Objectives</h2>
                    <p className="text-secondary-dark font-medium">ನಮ್ಮ ಉದ್ದೇಶಗಳು</p>
                    <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {objectives.map((obj, idx) => (
                        <motion.div
                            key={obj.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-100 flex flex-col items-center text-center space-y-4 cursor-pointer"
                        >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${obj.color} group-hover:scale-110 transition-transform`}>
                                <obj.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-primary text-sm md:text-base">{obj.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{obj.kan}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
