"use client";
import { useState } from "react";
import Script from "next/script";

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
}

// Define Razorpay response type
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export default function RazorpayButton({ amount, donorDetails, metadata, disabled }: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);

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
                body: JSON.stringify({ amount }),
            });
            const order = await res.json();

            if (!order.id) {
                throw new Error("Server error: No order ID returned");
            }

            // 2. Initialize Options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Aradhana Dharmika Trust",
                description: "Donation",
                // image: "/logo.png", // Ensure you have a logo at public/logo.png
                order_id: order.id,
                handler: async function (response: RazorpayResponse) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch("/api/payment/verify", {
                            method: "POST",
                            body: JSON.stringify({
                                ...response,
                                amount,
                                donorDetails,
                                metadata
                            }),
                        });
                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            alert("Payment Successful! Thank you for your donation.");
                            // Optional: Redirect or clear form
                        } else {
                            alert("Payment Verification Failed.");
                        }
                    } catch (error) {
                        console.error("Verification error:", error);
                        alert("Payment verified but failed to record locally. Please contact support.");
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
                alert("Payment Failed: " + response.error.description);
                setLoading(false);
            });
            rzp1.open();
        } catch (error) {
            console.error("Payment initialization error:", error);
            alert("Failed to initialize payment. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <button
                onClick={handlePayment}
                disabled={loading || disabled}
                className="relative z-10 w-full md:w-auto px-16 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold text-base rounded-full shadow-lg hover:shadow-[#D4AF37]/50 hover:-translate-y-1 transition-all duration-300 border border-white/20 flex items-center justify-center gap-3 mx-auto group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                {loading ? "Processing..." : `Donate ₹${amount}`}
                {!loading && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                )}
            </button>
        </>
    );
}
