"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    const { language } = useLanguage();
    const t = translations[language].footer;

    return (
        <footer className="bg-background-cream text-primary border-t border-secondary/20 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <img src="/assets/Logo_Round.png" alt="Logo" className="w-12 h-12 object-contain shadow-lg rounded-full" />
                            <h2 className="font-serif font-bold text-2xl tracking-wide text-primary-dark">ARADHANA</h2>
                        </div>
                        <p className="text-primary/70 text-sm leading-relaxed max-w-sm font-medium">
                            {t.desc}
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6">
                        <h4 className="font-serif font-bold text-secondary-dark tracking-widest text-xs uppercase">{t.quickLinks}</h4>
                        <ul className="space-y-3 text-sm text-primary/70">
                            <li><a href="#" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.about}</a></li>
                            <li><a href="#" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.events}</a></li>
                            <li><a href="#" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.donate}</a></li>
                            <li><a href="#" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.contact}</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h4 className="font-serif font-bold text-secondary-dark tracking-widest text-xs uppercase">{t.contact}</h4>
                        <ul className="space-y-4 text-sm text-primary/70">
                            <li className="flex items-start gap-3 group">
                                <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary group-hover:text-white text-secondary-dark transition-colors mt-0.5">
                                    <MapPin size={16} />
                                </div>
                                <span className="leading-relaxed">{t.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary group-hover:text-white text-secondary-dark transition-colors">
                                    <Phone size={16} />
                                </div>
                                <a href={`tel:${t.contactInfo.phone}`} className="hover:text-secondary-dark transition-colors">{t.contactInfo.phone}</a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary group-hover:text-white text-secondary-dark transition-colors">
                                    <Mail size={16} />
                                </div>
                                <a href={`mailto:${t.contactInfo.email}`} className="hover:text-secondary-dark transition-colors">{t.contactInfo.email}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div className="space-y-6">
                        <h4 className="font-serif font-bold text-secondary-dark tracking-widest text-xs uppercase">Location</h4>
                        <div className="w-full h-40 bg-background-ivory rounded-2xl overflow-hidden border border-secondary/20 relative group shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d77.49085261355655!3d12.953959988118836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1709667547564!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(100%) opacity(0.8)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:filter-none transition-all duration-500"
                            />
                            <div className="absolute inset-0 pointer-events-none border border-secondary/10 rounded-2xl"></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-secondary/10 pt-8 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-primary/50 font-light tracking-wide">
                    <p>{t.copyright}</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-secondary-dark transition-colors">{t.privacy}</a>
                        <a href="#" className="hover:text-secondary-dark transition-colors">{t.terms}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
