"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-background-cream flex flex-col">
            <Header />
            <div className="flex-grow pt-36 pb-12">
                <div className="container mx-auto px-4 lg:px-12 max-w-4xl">
                    <h1 className="font-cinzel-decorative font-bold text-4xl text-[#4A3225] mb-8 text-center border-b border-[#B8860B]/30 pb-4">
                        Privacy Policy
                    </h1>

                    <div className="space-y-8 font-poppins text-primary/80 leading-relaxed text-sm md:text-base">
                        <section>
                            <p className="mb-4">
                                <strong>Last Updated: February 2026</strong>
                            </p>
                            <p>
                                Welcome to <strong>Aradhana Dharmika Trust</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website, make a donation, or register for our events.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                1. Information We Collect
                            </h2>
                            <p className="mb-2">
                                We collect information necessary to provide our services, process donations, and keep you informed about our Dharmika activities. This may include:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, and PAN card details (for tax exemption purposes as per Indian law).</li>
                                <li><strong>Transaction Information:</strong> Donation amount, date of transaction, and transaction reference numbers. <em>Note: We do not store your credit/debit card numbers or UPI PINs. All payments are processed through secure third-party payment gateways.</em></li>
                                <li><strong>Event Registration Data:</strong> Details provided when you register for temple activities, poojas, or social welfare programs.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                2. How We Use Your Information
                            </h2>
                            <p className="mb-2">
                                The information we collect is used strictly for the following purposes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Trust Activities:</strong> To utilize donations for the betterment of services at associated temples and to conduct various Dharmika activities as per the Trust's objectives.</li>
                                <li><strong>Communication:</strong> To send you receipts, donation acknowledgments, and updates regarding your transactions.</li>
                                <li><strong>Promotional Activities:</strong> To inform you about upcoming temple events, festivals, social welfare initiatives, and other promotional activities conducted by the Trust. By providing your contact details, you consent to receive such communications.</li>
                                <li><strong>Legal Compliance:</strong> To comply with applicable laws within India, including maintaining records for the Income Tax Department.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                3. Data Protection & Security
                            </h2>
                            <p>
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. We follow standard industry practices and comply with the <strong>Information Technology Act, 2000</strong> and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                4. Sharing of Information
                            </h2>
                            <p>
                                We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners and trusted affiliates for the purposes outlined above. We may disclose your information if required to do so by Indian law or in the good faith belief that such action is necessary to comply with a legal obligation.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                5. Your Rights
                            </h2>
                            <p>
                                You have the right to request access to the personal data we hold about you and to ask for your data to be corrected or updated. If you define to unsubscribe from our promotional communications, you may do so by contacting us.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-cinzel-decorative font-bold text-2xl text-[#4A3225] mb-4">
                                6. Contact Us
                            </h2>
                            <p className="mb-2">
                                If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
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
