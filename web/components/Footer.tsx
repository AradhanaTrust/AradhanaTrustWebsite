"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    const { language } = useLanguage();
    const t = translations[language].footer;

    return (
        <footer className="bg-primary-dark text-white border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary font-bold">A</div>
                            <h2 className="font-serif font-bold text-xl">ARADHANA</h2>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed max-w-md">
                            {t.desc}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-secondary tracking-widest text-sm">{t.quickLinks}</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition-colors">{t.about}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t.events}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t.donate}</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">{t.contact}</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-secondary tracking-widest text-sm">{t.contact}</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-secondary shrink-0 mt-0.5" />
                                <span>{t.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-secondary shrink-0" />
                                <a href={`tel:${t.contactInfo.phone}`} className="hover:text-white transition-colors">{t.contactInfo.phone}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-secondary shrink-0" />
                                <a href={`mailto:${t.contactInfo.email}`} className="hover:text-white transition-colors">{t.contactInfo.email}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary shrink-0"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg>
                                <a href="https://wa.me/919876543210" className="hover:text-white transition-colors">{t.contactInfo.whatsapp}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Map / Legal - Moved Legal to bottom or sidebar if needed, but fitting map here */}
                    <div className="space-y-4">
                        <h4 className="font-serif font-bold text-secondary tracking-widest text-sm">LOCATION</h4>
                        <div className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden border border-white/10 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d77.49085261355655!3d12.953959988118836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1709667547564!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
                    <p>{t.copyright}</p>
                    <p>{t.designed}</p>
                </div>
            </div>
        </footer>
    );
}
