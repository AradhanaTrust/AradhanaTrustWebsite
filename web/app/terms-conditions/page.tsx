"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export default function TermsConditions() {
    const { language } = useLanguage();
    const t = translations[language].termsConditions;

    return (
        <main className="min-h-screen bg-background-cream flex flex-col">
            <Header />
            <div className="flex-grow pt-36 pb-12">
                <div className="container mx-auto px-4 lg:px-12 max-w-4xl">
                    <h1 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-8 text-center border-b border-[#B8860B]/30 pb-4">
                        {t.title}
                    </h1>

                    <div className="space-y-8 font-poppins text-primary/80 leading-relaxed text-sm md:text-base">
                        <section>
                            <p className="mb-4">
                                <strong>{t.lastUpdated}</strong>
                            </p>
                            <p>
                                {t.intro}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section1.title}
                            </h2>
                            <p>
                                {t.section1.content}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section2.title}
                            </h2>
                            <p>
                                {t.section2.content}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section3.title}
                            </h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>{t.section3.items.voluntary.split(':')[0]}:</strong> {t.section3.items.voluntary.split(':').slice(1).join(':')}</li>
                                <li><strong>{t.section3.items.purpose.split(':')[0]}:</strong> {t.section3.items.purpose.split(':').slice(1).join(':')}</li>
                                <li><strong>{t.section3.items.noRefunds.split(':')[0]}:</strong> {t.section3.items.noRefunds.split(':').slice(1).join(':')}</li>
                                <li><strong>{t.section3.items.taxExemption.split(':')[0]}:</strong> {t.section3.items.taxExemption.split(':').slice(1).join(':')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section4.title}
                            </h2>
                            <p>
                                {t.section4.content}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section5.title}
                            </h2>
                            <p>
                                {t.section5.content}
                            </p>
                            <p className="mt-2">
                                {t.section5.content2}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section6.title}
                            </h2>
                            <p>
                                {t.section6.content}
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                {t.section7.title}
                            </h2>
                            <p className="mb-2">
                                {t.section7.content}
                            </p>
                            <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20">
                                <p className="font-bold text-[#4A3225]">{t.section7.contact.name}</p>
                                <p>{t.section7.contact.address1}</p>
                                <p>{t.section7.contact.address2}</p>
                                <p className="mt-2"><strong>{t.section7.contact.email}</strong> {t.section7.contact.emailValue}</p>
                                <p><strong>{t.section7.contact.phone}</strong> {t.section7.contact.phoneValue}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
