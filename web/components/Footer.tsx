"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Mail, MapPin, Phone } from "lucide-react";

import Link from "next/link";

export default function Footer() {
    const { language } = useLanguage();
    const t = translations[language].footer;

    return (
        <footer className="bg-background-cream text-primary border-t border-secondary/20 pt-8 pb-6">
            <div className="container mx-auto px-4 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_0.9fr_2fr] gap-6 md:gap-8 lg:gap-8 mb-6 md:mb-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 md:gap-4">
                            <img src="/assets/Logo_Round.png" alt="Logo" className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain shadow-lg rounded-full" />
                            <div className="flex flex-col -space-y-1">
                                <h2 className="font-cinzel-decorative font-bold text-2xl md:text-3xl lg:text-4xl tracking-wide text-[#4A3225] leading-none py-1">
                                    {translations[language].nav.trustNameLine1}
                                </h2>
                                <h2 className="font-cinzel-decorative font-bold text-xl md:text-2xl lg:text-3xl tracking-wide text-[#4A3225] leading-none py-1 whitespace-nowrap">
                                    {translations[language].nav.trustNameLine2}
                                </h2>
                            </div>
                        </div>
                        <p className="text-primary/70 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
                            {t.desc}
                        </p>

                        {/* Registration Details */}
                        <div className="bg-secondary/5 p-3.5 md:p-3 rounded-lg border border-secondary/10 max-w-sm inline-block w-full md:w-auto text-center md:text-left shadow-sm">
                            <p className="text-[#5D4037] text-xs font-bold font-mono tracking-wide">{t.registration.number}</p>
                        </div>

                        <div className="flex gap-4 md:gap-3 flex-wrap justify-center md:justify-start">
                            {/* Facebook */}
                            <a href="#" className="w-11 h-11 md:w-10 md:h-10 lg:w-8 lg:h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="w-11 h-11 md:w-10 md:h-10 lg:w-8 lg:h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                            {/* Play/Youtube */}
                            <a href="#" className="w-11 h-11 md:w-10 md:h-10 lg:w-8 lg:h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                            </a>
                            {/* WhatsApp */}
                            <a href="#" className="w-11 h-11 md:w-10 md:h-10 lg:w-8 lg:h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            </a>
                            {/* Phone Call */}
                            <a href="#" className="w-11 h-11 md:w-10 md:h-10 lg:w-8 lg:h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all cursor-pointer">
                                <Phone size={18} className="md:w-4 md:h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-6 lg:justify-self-center">
                        <h4 className="font-serif font-bold text-secondary-dark tracking-widest text-[11px] md:text-xs uppercase">{t.quickLinks}</h4>
                        <ul className="space-y-3.5 md:space-y-3 text-sm md:text-base text-primary/70">
                            <li><Link href="/about" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.about}</Link></li>
                            <li><Link href="/events" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.events}</Link></li>
                            <li><Link href="/donate" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.donate}</Link></li>
                            <li><Link href="/contact" className="hover:text-secondary-dark transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-secondary rounded-full"></span>{t.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 lg:justify-self-center">
                        <h4 className="font-serif font-bold text-secondary-dark tracking-widest text-[11px] md:text-xs uppercase">{t.contact}</h4>
                        <ul className="space-y-4 text-sm md:text-base text-primary/70">
                            <li className="flex items-start gap-3 group">
                                <div className="p-2.5 md:p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary group-hover:text-white text-secondary-dark transition-colors mt-0.5">
                                    <MapPin size={16} />
                                </div>
                                <span className="leading-relaxed">{t.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="p-2.5 md:p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary group-hover:text-white text-secondary-dark transition-colors">
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
                    <div className="space-y-6 lg:ml-8 xl:ml-12">
                        <h4 className="font-serif font-bold text-secondary-dark tracking-widest text-[11px] md:text-xs uppercase">{translations[language].aboutPage.locationTitle}</h4>
                        <div className="w-full h-36 sm:h-44 md:h-48 lg:h-52 bg-background-ivory rounded-2xl overflow-hidden border border-secondary/20 relative group shadow-lg">
                            <iframe
                                src="https://maps.google.com/maps?q=Kodihalli%20Village,%20Malur%20Taluk,%20Kolar%20District%20563160,%20Karnataka,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'contrast(1.1) saturate(1.1) sepia(0.15) opacity(0.9)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:filter-none transition-all duration-500"
                            />
                            <div className="absolute inset-0 pointer-events-none border border-secondary/10 rounded-2xl"></div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-secondary/10 pt-6 md:pt-4 flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8 text-xs sm:text-sm font-medium tracking-wide text-[#B8860B]">
                    <p>{t.copyright}</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy-policy" className="hover:text-gray-800 transition-colors font-semibold">{t.privacy}</Link>
                        <Link href="/terms-conditions" className="hover:text-gray-800 transition-colors font-semibold">{t.terms}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
