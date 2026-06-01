"use client";
import { useState } from "react";
import Script from "next/script";
import toast from "react-hot-toast";
import RegistrationStatusModal from "./RegistrationStatusModal";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayButtonProps {
    amount: number;
    donorDetails: {
        name: string;
        email: string;
        phone: string;
        address?: string;
        organisation?: string;
        referredBy?: string;
    };
    metadata?: Record<string, any>;
    disabled?: boolean;
    label?: string;
}

// Define Razorpay response type
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export default function RazorpayButton({ amount, donorDetails, metadata, disabled, label }: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);
    const { language } = useLanguage();
    const t = translations[language].eventRegistration;
    const [modalData, setModalData] = useState<{
        isOpen: boolean;
        status: 'success' | 'error' | null;
        title?: string;
        message?: string;
        registrationNo?: string;
        receiptUrl?: string;
    }>({ isOpen: false, status: null });

    const handlePayment = async () => {
        if (amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        setLoading(true);

        try {
            // 1. Create Order
            const res = await fetch("/api/payment/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, donorDetails, metadata }),
            });
            const order = await res.json();

            if (!order.id) {
                throw new Error("Server error: No order ID returned");
            }

            // 2. Initialize Options
            const options = {
                key: order.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Aradhana Dharmika Trust",
                description: metadata?.type === 'event'
                    ? `Event Registration: ${metadata.eventTitle}`
                    : "Trust Donation",
                // image: "/logo.png", // Ensure you have a logo at public/logo.png
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...response,
                                amount,
                                donorDetails,
                                metadata
                            }),
                        });
                        
                        let verifyData;
                        const contentType = verifyRes.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            verifyData = await verifyRes.json();
                        } else {
                            const textData = await verifyRes.text();
                            console.error("Non-JSON response from verify:", textData);
                            throw new Error("Server returned an invalid response (500 Internal Error)");
                        }

                        if (verifyRes.ok && verifyData.success) {
                            setModalData({
                                isOpen: true,
                                status: 'success',
                                title: metadata?.type === 'event' ? t.successTitle : (language === 'kn' ? 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Payment Successful!'),
                                message: metadata?.type === 'event'
                                    ? t.successMessage
                                    : donorDetails.email
                                        ? (language === 'kn' ? 'ನಿಮ್ಮ ವಹಿವಾಟನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ರಸೀದಿಯನ್ನು ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.' : 'Your transaction has been verified successfully. A copy of the receipt has been sent to your email.')
                                        : (language === 'kn' ? 'ನಿಮ್ಮ ವಹಿವಾಟನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ಕೆಳಗಿನಿಂದ ನಿಮ್ಮ ರಸೀದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು.' : 'Your transaction has been verified successfully. You can download your receipt below.'),
                                registrationNo: verifyData.registrationNo,
                                receiptUrl: verifyData.registrationId ? `/api/receipts/download?id=${verifyData.registrationId}` : undefined
                            });
                            setLoading(false);
                            // Optional: Redirect or clear form
                        } else {
                            setModalData({
                                isOpen: true,
                                status: 'error',
                                title: language === 'kn' ? 'ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ' : 'Verification Failed',
                                message: verifyData.details ? `${verifyData.error}: ${verifyData.details}` : (verifyData.error || (language === 'kn' ? "ಪಾವತಿ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ." : "Payment Verification Failed."))
                            });
                            setLoading(false);
                        }
                    } catch (error: any) {
                        console.error("Verification error:", error);
                        setModalData({
                            isOpen: true,
                            status: 'error',
                            title: language === 'kn' ? 'ದಾಖಲಾತಿ ವಿಫಲವಾಗಿದೆ' : 'Recording Failed',
                            message: language === 'kn' ? 'ಪಾವತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಆದರೆ ಇಲ್ಲಿ ದಾಖಲಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ.' : "Payment verified but failed to record locally. Please contact support."
                        });
                        setLoading(false);
                    }
                },
                prefill: {
                    name: donorDetails.name,
                    email: donorDetails.email,
                    contact: donorDetails.phone,
                },
                theme: {
                    color: "#D4AF37", // Trust Gold
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
                setModalData({
                    isOpen: true,
                    status: 'error',
                    title: language === 'kn' ? 'ಪಾವತಿ ವಿಫಲವಾಗಿದೆ' : 'Payment Failed',
                    message: response.error.description
                });
                setLoading(false);
            });
            rzp1.open();
        } catch (error) {
            console.error("Payment initialization error:", error);
            setModalData({
                isOpen: true,
                status: 'error',
                title: language === 'kn' ? 'ಪ್ರಾರಂಭ ದೋಷ' : 'Initialization Error',
                message: language === 'kn' ? 'ಪಾವತಿಯನ್ನು ಪ್ರಾರಂಭಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Failed to initialize payment. Please try again.'
            });
            setLoading(false);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <RegistrationStatusModal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ ...modalData, isOpen: false })}
                status={modalData.status}
                title={modalData.title}
                message={modalData.message}
                registrationNo={modalData.registrationNo}
                receiptUrl={modalData.receiptUrl}
            />
            <button
                onClick={handlePayment}
                disabled={loading || disabled}
                className="relative z-10 w-full md:w-auto px-10 py-4 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_6px_12px_rgba(0,0,0,0.4)] hover:-translate-y-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-300 transform flex items-center justify-center gap-3 mx-auto disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
            >
                {loading ? (language === 'kn' ? "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ..." : "Processing...") : (label || (language === 'kn' ? `ದೇಣಿಗೆ ₹${amount}` : `Donate ₹${amount}`))}
                {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                )}
            </button>
        </>
    );
}
