import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    // Re-validating Prisma types
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, donorDetails, metadata } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // 1. Signature matches - Payment Successful

            if (metadata?.type === 'event') {
                // Create Event Registration
                await prisma.eventRegistration.create({
                    data: {
                        eventId: metadata.eventId,
                        eventTitle: metadata.eventTitle, // Ensure this is passed
                        name: donorDetails.name,
                        email: donorDetails.email,
                        phone: donorDetails.phone,
                        address: donorDetails.address,
                        organisation: donorDetails.organisation,
                        referredBy: donorDetails.referredBy,
                        attendees: 1, // Default to 1 for now
                        totalAmount: parseFloat(amount),
                        status: "registered",
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        event: { connect: { id: metadata.eventId } }
                    }
                });
            } else {
                // Default: Create Donation
                await prisma.donation.create({
                    data: {
                        amount: parseFloat(amount),
                        status: "paid",
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        donorName: donorDetails?.name,
                        donorEmail: donorDetails?.email,
                        donorPhone: donorDetails?.phone,
                        currency: "INR"
                    }
                });
            }

            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
