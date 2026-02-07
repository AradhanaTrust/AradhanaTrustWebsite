"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsConditions() {
    return (
        <main className="min-h-screen bg-background-cream flex flex-col">
            <Header />
            <div className="flex-grow pt-36 pb-12">
                <div className="container mx-auto px-4 lg:px-12 max-w-4xl">
                    <h1 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-8 text-center border-b border-[#B8860B]/30 pb-4">
                        Terms & Conditions
                    </h1>

                    <div className="space-y-8 font-poppins text-primary/80 leading-relaxed text-sm md:text-base">
                        <section>
                            <p className="mb-4">
                                <strong>Last Updated: February 2026</strong>
                            </p>
                            <p>
                                Welcome to the website of <strong>Aradhana Dharmika Trust</strong>. By accessing or using our website, making a donation, or registering for events, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                1. Acceptance of Terms
                            </h2>
                            <p>
                                By using this website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. If you do not agree with any part of these terms, you must not use our website or services.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                2. Use of Services
                            </h2>
                            <p>
                                You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                3. Donations and Payments
                            </h2>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Voluntary Contribution:</strong> All donations made to Aradhana Dharmika Trust are voluntary.</li>
                                <li><strong>Purpose:</strong> The funds collected will be used strictly for the charitable and Dharmika activities of the Trust, including temple maintenance, Vedic rituals, Annadanam, and social welfare projects.</li>
                                <li><strong>No Refunds:</strong> Once a donation is made, it is generally non-refundable. However, in cases of erroneous duplicate transactions, please contact us within 7 days for review.</li>
                                <li><strong>Tax Exemption:</strong> Receipts for donations will be issued for tax exemption purposes as per applicable Indian laws (e.g., Section 80G of the Income Tax Act), subject to the donor providing valid PAN details.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                4. Intellectual Property
                            </h2>
                            <p>
                                The content, layout, design, data, databases, and graphics on this website are protected by Indian and other international intellectual property laws and are owned by Aradhana Dharmika Trust. You may not copy, reproduce, republish, download, post, broadcast, transmit, make available to the public, or otherwise use our content in any way except for your own personal, non-commercial use.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                5. Limitation of Liability
                            </h2>
                            <p>
                                Aradhana Dharmika Trust generally does not guarantee that the functions contained in the website content will be uninterrupted or error-free, that defects will be corrected, or that the website or the server that makes it available are free of viruses or bugs.
                            </p>
                            <p className="mt-2">
                                In no event will the Trust, its trustees, employees, or agents be liable for any damages including, without limitation, indirect or consequential damages, or any damages whatsoever arising from use or loss of use, data, or profits, whether in action of contract, negligence, or other tortious action, arising out of or in connection with the use of the website.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                6. Governing Law and Jurisdiction
                            </h2>
                            <p>
                                These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising herefrom shall be subject to the exclusive jurisdiction of the courts in <strong>Kolar, Karnataka</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                7. Contact Us
                            </h2>
                            <p className="mb-2">
                                For any questions regarding these Terms & Conditions, please contact us at:
                            </p>
                            <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20">
                                <p className="font-bold text-[#4A3225]">Aradhana Dharmika Trust</p>
                                <p>Kodihalli Village, Malur Taluk,</p>
                                <p>Kolar District – 563160, Karnataka, India</p>
                                <p className="mt-2"><strong>Email:</strong> contact@aradhanatrust.org</p>
                                <p><strong>Phone:</strong> +91 98765 43210</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
