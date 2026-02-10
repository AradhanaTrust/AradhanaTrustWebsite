"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Mail, MapPin, Phone } from "lucide-react";

import Link from "next/link";

export default function Footer() {
    const { language } = useLanguage();
    const t = translations[language].footer;

    return (
        <footer className="bg-background-cream text-primary border-t border-secondary/20 pt-8 pb-6 relative overflow-hidden">
            {/* Decorative Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

            <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-12 2xl:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_0.7fr_0.7fr_2.6fr] gap-8 lg:gap-10 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="/assets/Logo_Round.png"
                                alt="Logo"
                                className="w-16 h-16 lg:w-20 lg:h-20 object-contain shadow-md rounded-full border-2 border-secondary/10"
                            />
                            <div className="flex flex-col">
                                <h2 className="font-cinzel-decorative font-bold text-xl lg:text-2xl tracking-wide text-[#4A3225] leading-none mb-1">
                                    {translations[language].nav.trustNameLine1}
                                </h2>
                                <h2 className="font-cinzel-decorative font-bold text-base lg:text-lg tracking-wider text-[#4A3225]/80 leading-none">
                                    {translations[language].nav.trustNameLine2}
                                </h2>
                            </div>
                        </div>
                        <p className="text-primary/80 text-xs leading-relaxed max-w-sm font-medium font-serif">
                            {t.desc}
                        </p>

                        <div className="pt-2">
                            <div className="bg-white/50 backdrop-blur-sm p-3 rounded-xl border border-secondary/20 shadow-sm inline-block w-full md:w-auto">
                                <p className="text-[#5D4037] text-xs font-bold font-mono tracking-wider uppercase text-center md:text-left">
                                    {t.registration.number}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            {/* Social Icons - Consistently styled */}
                            {[
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, href: "#" },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>, href: "#" },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>, href: "#" },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>, href: "#" },
                                { icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>, href: `tel:${t.contactInfo.phone}` }
                            ].map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="w-8 h-8 rounded-full bg-secondary/10 hover:bg-secondary hover:text-white text-secondary-dark flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm border border-secondary/5"
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Unchanged */}
                    <div className="space-y-6 lg:justify-self-center pt-1">
                        <h4 className="font-cinzel text-secondary-dark font-bold text-xs xl:text-sm tracking-wide border-b border-secondary/20 pb-2 inline-block uppercase">
                            {t.quickLinks}
                        </h4>
                        <ul className="space-y-3.5 text-xs xl:text-sm font-serif text-primary/80">
                            {[
                                { link: "/about", label: t.about },
                                { link: "/events", label: t.events },
                                { link: "/donate", label: t.donate },
                                { link: "/contact", label: t.contact }
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link href={item.link} className="hover:text-secondary-dark transition-all duration-300 flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-secondary/40 rounded-full group-hover:bg-secondary transition-colors" />
                                        <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info - Unchanged */}
                    <div className="space-y-6 lg:justify-self-center pt-1">
                        <h4 className="font-cinzel text-secondary-dark font-bold text-xs xl:text-sm tracking-wide border-b border-secondary/20 pb-2 inline-block uppercase">
                            {t.contact}
                        </h4>
                        <ul className="space-y-5 text-xs xl:text-sm font-serif text-primary/80">
                            <li className="flex items-start gap-4 group">
                                <div className="p-2.5 bg-white rounded-lg shadow-sm border border-secondary/10 group-hover:border-secondary/30 transition-colors text-secondary-dark mt-0.5">
                                    <MapPin size={18} />
                                </div>
                                <span className="leading-relaxed">{t.contactInfo.address}</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2.5 bg-white rounded-lg shadow-sm border border-secondary/10 group-hover:border-secondary/30 transition-colors text-secondary-dark">
                                    <Phone size={18} />
                                </div>
                                <a href={`tel:${t.contactInfo.phone}`} className="hover:text-secondary-dark transition-colors font-semibold tracking-wide">{t.contactInfo.phone}</a>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="p-2.5 bg-white rounded-lg shadow-sm border border-secondary/10 group-hover:border-secondary/30 transition-colors text-secondary-dark">
                                    <Mail size={18} />
                                </div>
                                <a href={`mailto:${t.contactInfo.email}`} className="hover:text-secondary-dark transition-colors font-medium">{t.contactInfo.email}</a>
                            </li>
                        </ul>
                    </div>

                    {/* Map - Unchanged */}
                    <div className="space-y-6 pt-1">
                        <h4 className="font-cinzel text-secondary-dark font-bold text-xs xl:text-sm tracking-wide border-b border-secondary/20 pb-2 inline-block uppercase">
                            {translations[language].aboutPage.locationTitle}
                        </h4>
                        <div className="w-full h-48 bg-background-ivory rounded-xl overflow-hidden border-2 border-secondary/10 relative group shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <iframe
                                src="https://maps.google.com/maps?q=Kodihalli%20Village,%20Malur%20Taluk,%20Kolar%20District%20563160,%20Karnataka,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'contrast(1.05) saturate(1.05) sepia(0.1)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="group-hover:scale-[1.02] transition-transform duration-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-secondary/10 pt-4 flex flex-col items-center justify-center gap-2 text-[10px] sm:text-xs font-medium tracking-wide text-primary/60 text-center">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                        <p className="font-serif">
                            {/* Use translation directly to avoid duplication as per user request */}
                            {t.copyright}
                        </p>
                        <div className="hidden md:block w-1 h-1 bg-secondary/30 rounded-full" />
                        <div className="flex items-center gap-4">
                            <Link href="/privacy-policy" className="hover:text-secondary-dark transition-colors hover:underline underline-offset-4">{t.privacy}</Link>
                            <span className="w-1 h-1 bg-secondary/30 rounded-full" />
                            <Link href="/terms-conditions" className="hover:text-secondary-dark transition-colors hover:underline underline-offset-4">{t.terms}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
