"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoldCurveSeparator from "@/components/GoldCurveSeparator";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { Phone, Mail, MapPin, Clock, Send, Calendar, MessageSquare, Users, Heart, Sparkles, Flower, ChevronDown } from "lucide-react";
import Link from "next/link";
import { sendContactEmail } from "@/app/actions/send-contact-email";

export default function ContactPage() {
    const { language } = useLanguage();
    const t = translations[language].contact;
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });
    const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus("loading");

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("subject", formData.subject);
        formDataToSend.append("message", formData.message);

        const result = await sendContactEmail(formDataToSend);

        if (result.success) {
            setFormStatus("success");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            setTimeout(() => setFormStatus("idle"), 5000);
        } else {
            setFormStatus("error");
            setTimeout(() => setFormStatus("idle"), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Scroll Animation Logic (Matching Home Page)
    const { scrollY } = useScroll();

    // Transform scroll to curve control point Y
    // Range: 0px scroll -> Deep curve (320), 300px scroll -> Flat (190)
    const curveControlY = useTransform(scrollY, [0, 300], [320, 190]);

    const curveControlY_Line1 = useTransform(curveControlY, (y) => y + 1.5);
    const curveControlY_Line2 = useTransform(curveControlY, (y) => y + 12);

    const pathMain = useMotionTemplate`M0,190 Q600,${curveControlY} 1200,190 L1200,280 L0,280 Z`;
    const pathLine1 = useMotionTemplate`M0,191.5 Q600,${curveControlY_Line1} 1200,191.5`;
    const pathLine2 = useMotionTemplate`M0,202 Q600,${curveControlY_Line2} 1200,202`;

    const handleScroll = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
        });
    };

    return (
        <>
            <Header />

            {/* HERO SECTION - Refined V5 Layout */}
            <div className="relative pt-32 pb-48 lg:pt-40 lg:pb-32 overflow-hidden bg-[#FDFBF7] min-h-[85vh] flex items-center">
                {/* Background - Mandala Overlay Only */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:600px_600px] bg-center opacity-5 animate-spin-slow pointer-events-none mix-blend-multiply" />
                </div>

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7]/0 via-[#FDFBF7]/30 to-[#FDFBF7]/90 pointer-events-none" />

                <div className="container-gold relative z-10 w-full">
                    {/* Adjusted Grid: Reduced gap further (gap-0 to gap-4) and added symmetric padding (pl-12 pr-12) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-0 items-center">

                        {/* LEFT CONTENT - Centered Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center space-y-6 order-1 lg:order-1 flex flex-col items-center justify-center h-full"
                        >
                            {/* Decorative Quote */}
                            <div className="flex items-center justify-center gap-4 text-[#B8860B]/80 font-medium">
                                <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B8860B]" />
                                <span className="font-serif italic tracking-wider text-sm md:text-base text-[#8D6E63]">{t.hero.tagline}</span>
                                <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B8860B]" />
                            </div>

                            {/* Main Heading - Updated Size & Color */}
                            <h1 className="font-cinzel-decorative font-bold leading-tight drop-shadow-sm filter">
                                <span className="block text-4xl md:text-5xl lg:text-6xl text-[#D4AF37]">
                                    {t.hero.title}
                                </span>
                            </h1>

                            <p className="font-serif text-lg md:text-xl text-[#5D4037] w-full leading-relaxed font-medium px-4 lg:px-0">
                                {t.hero.description}
                            </p>
                        </motion.div>

                        {/* RIGHT CONTENT - Temple Arch Image - Reduced Size */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative h-[300px] md:h-[400px] lg:h-[450px] w-full order-2 lg:order-2 flex justify-center lg:justify-end items-center"
                        >
                            {/* Temple Arch Container */}
                            <div className="relative w-full max-w-sm h-full">
                                {/* Outer Glow/Shadow */}
                                <div className="absolute inset-4 rounded-t-full bg-[#D4AF37]/20 blur-xl transform translate-y-4" />

                                {/* Main Image Container with Temple Border */}
                                <div className="relative h-full w-full rounded-t-full overflow-hidden border-[6px] border-double border-[#D4AF37]/40 shadow-2xl bg-[#FFFDF9]">
                                    {/* Inner Gold Border */}
                                    <div className="absolute inset-2 rounded-t-full border-2 border-[#D4AF37] pointer-events-none z-20 opacity-60" />

                                    <img
                                        src="/assets/event-ganesh.png"
                                        alt="Temple"
                                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-1000"
                                    />

                                    {/* Vignette for Depth */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#5D4037]/40 via-transparent to-transparent pointer-events-none z-10" />
                                </div>

                                {/* Decorative Keystone Element - Flower Pattern for Nature Feel */}
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-full flex items-center justify-center shadow-lg z-30">
                                    <Flower className="text-[#D4AF37] w-7 h-7" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Down Indicator - Pushed Up slightly */}

                <GoldCurveSeparator fillColor="fill-[#FFFDF9]" />
            </div>

            {/* Contact Information Grid */}
            <section className="bg-[#FFFDF9] py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Phone & Email */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center">
                                    <Phone size={24} className="text-white" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037]">{t.info.phoneEmail.title}</h3>
                            </div>
                            <div className="space-y-4 text-[#5D4037]/80">
                                <div>
                                    <p className="font-semibold text-sm text-[#5D4037]">{t.info.phoneEmail.office}</p>
                                    <a href="tel:+918550093111" className="text-[#D4AF37] hover:text-[#B8860B]">+91 85500 93111</a>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[#5D4037]">{t.info.phoneEmail.pujaBooking}</p>
                                    <a href="tel:+918550093111" className="text-[#D4AF37] hover:text-[#B8860B]">+91 85500 93111</a>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[#5D4037]">{t.info.phoneEmail.email}</p>
                                    <a href="mailto:support@aradhanadharmikatrust.org" className="text-[#D4AF37] hover:text-[#B8860B] break-all">support@aradhanadharmikatrust.org</a>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[#5D4037]">{t.info.phoneEmail.whatsapp}</p>
                                    <a href="https://wa.me/918550093111" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#B8860B]">+91 85500 93111</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visit Us */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center">
                                    <MapPin size={24} className="text-white" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037]">{t.info.visit.title}</h3>
                            </div>
                            <div className="space-y-3 text-[#5D4037]/80 mb-6">
                                <p className="font-semibold text-sm text-[#5D4037]">{t.info.visit.address}</p>
                                <div className="leading-relaxed">
                                    <p>{t.info.visit.addressLine1}</p>
                                    <p>{t.info.visit.addressLine2}</p>
                                    <p>{t.info.visit.addressLine3}</p>
                                    <p>{t.info.visit.addressLine4}</p>
                                    <p className="text-sm italic mt-2 text-[#8D6E63]">{t.info.visit.landmark}</p>
                                </div>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/Kx9rd5npQzJcuikt5?g_st=iw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-sm rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]"
                            >
                                <MapPin size={16} />
                                {t.info.visit.getDirections}
                            </a>
                        </motion.div>

                        {/* Temple Timings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center">
                                    <Clock size={24} className="text-white" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037]">{t.info.timings.title}</h3>
                            </div>
                            <div className="space-y-4 text-[#5D4037]/80">
                                <div>
                                    <p className="font-semibold text-sm text-[#5D4037] mb-2">{t.info.timings.darshan}</p>
                                    <p className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#D4AF37]" />
                                        {t.info.timings.morning}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Calendar size={16} className="text-[#D4AF37]" />
                                        {t.info.timings.evening}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-[#5D4037] mb-2">{t.info.timings.office}</p>
                                    <p>{t.info.timings.officeTime}</p>
                                </div>
                                <div className="pt-2 border-t border-[#CFA14E]/20">
                                    <p className="text-sm italic text-[#8D6E63]">{t.info.timings.closed}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Google Maps Embed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-12 rounded-2xl overflow-hidden shadow-xl border-4 border-[#D4AF37]/30"
                    >
                        <iframe
                            src="https://maps.google.com/maps?q=Kodihalli%20Village,%20Malur%20Taluk,%20Kolar%20District%20563160,%20Karnataka,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Contact Form Section */}
            {/* Contact Form Section */}
            <section className="bg-gradient-to-b from-[#FFF9E6] to-[#FFFDF9] relative pt-20 pb-48 lg:pb-32 md:py-20">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <h2 className="font-cinzel-decorative font-bold text-3xl md:text-4xl text-[#D4AF37] mb-4">{t.form.title}</h2>
                            <p className="text-[#5D4037]/80 text-lg">{t.form.subtitle}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl border border-[#CFA14E]/20">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-[#5D4037] mb-2">{t.form.name} *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.form.namePlaceholder}
                                        className="w-full px-4 py-3 border-2 border-[#CFA14E]/30 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-[#5D4037] mb-2">{t.form.email} *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder={t.form.emailPlaceholder}
                                        className="w-full px-4 py-3 border-2 border-[#CFA14E]/30 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-[#5D4037] mb-2">{t.form.phone}</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder={t.form.phonePlaceholder}
                                        className="w-full px-4 py-3 border-2 border-[#CFA14E]/30 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-[#5D4037] mb-2">{t.form.subject} *</label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#CFA14E]/30 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors bg-white"
                                    >
                                        <option value="">{t.form.subjectPlaceholder}</option>
                                        <option value="general">{t.form.subjects.general}</option>
                                        <option value="puja">{t.form.subjects.puja}</option>
                                        <option value="donation">{t.form.subjects.donation}</option>
                                        <option value="event">{t.form.subjects.event}</option>
                                        <option value="volunteer">{t.form.subjects.volunteer}</option>
                                        <option value="other">{t.form.subjects.other}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <label htmlFor="message" className="block text-sm font-semibold text-[#5D4037] mb-2">{t.form.message} *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder={t.form.messagePlaceholder}
                                    className="w-full px-4 py-3 border-2 border-[#CFA14E]/30 rounded-xl focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            {/* Status Messages */}
                            {formStatus === "success" && (
                                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-800 flex items-center gap-2">
                                    <Sparkles size={20} />
                                    {t.form.success}
                                </div>
                            )}
                            {formStatus === "error" && (
                                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800">
                                    {t.form.error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full px-8 py-4 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-semibold text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] ${formStatus === "loading" ? "opacity-70 cursor-not-allowed" : ""}`}
                                disabled={formStatus === "loading"}
                            >
                                <Send size={20} />
                                {formStatus === "loading" ? "Sending..." : t.form.submit}
                            </button>
                        </form>
                    </motion.div>
                </div>
                <GoldCurveSeparator fillColor="fill-[#FFFDF9]" />
            </section>

            {/* Quick Contact Cards */}
            <section className="bg-[#FFFDF9] py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="font-cinzel-decorative font-bold text-3xl md:text-4xl text-[#D4AF37]">{t.quickContact.title}</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {/* Puja Services */}
                        <Link href="/events" className="h-full block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group h-full flex flex-col"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <MessageSquare size={32} className="text-white" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037] text-center mb-2">{t.quickContact.puja.title}</h3>
                                <p className="text-[#5D4037]/70 text-sm text-center flex-grow">{t.quickContact.puja.desc}</p>
                            </motion.div>
                        </Link>

                        {/* Donations */}
                        <Link href="/donate" className="h-full block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group h-full flex flex-col"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <Heart size={32} className="text-white" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037] text-center mb-2">{t.quickContact.donate.title}</h3>
                                <p className="text-[#5D4037]/70 text-sm text-center flex-grow">{t.quickContact.donate.desc}</p>
                            </motion.div>
                        </Link>

                        {/* Events */}
                        <Link href="/events" className="h-full block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group h-full flex flex-col"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                    <Calendar size={32} className="text-white" />
                                </div>
                                <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037] text-center mb-2">{t.quickContact.events.title}</h3>
                                <p className="text-[#5D4037]/70 text-sm text-center flex-grow">{t.quickContact.events.desc}</p>
                            </motion.div>
                        </Link>

                        {/* Volunteer */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-[#CFA14E]/20 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group h-full flex flex-col"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F2C96D] to-[#9E731C] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                <Users size={32} className="text-white" />
                            </div>
                            <h3 className="font-cinzel-decorative font-bold text-xl text-[#5D4037] text-center mb-2">{t.quickContact.volunteer.title}</h3>
                            <p className="text-[#5D4037]/70 text-sm text-center flex-grow">{t.quickContact.volunteer.desc}</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
