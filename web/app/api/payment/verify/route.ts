import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateStandardId } from "@/lib/id-generator";

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

            let registration;
            if (metadata?.type === 'event') {
                const regFee = parseFloat(metadata.registrationFee || 0);
                const donAmount = parseFloat(metadata.donationAmount || 0);
                const regNo = generateStandardId('REG');

                // Create Event Registration
                registration = await prisma.eventRegistration.create({
                    data: {
                        registrationNo: regNo,
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
                        registrationFee: regFee,
                        donationAmount: donAmount,
                        status: "registered",
                        razorpayOrderId: razorpay_order_id,
                        razorpayPaymentId: razorpay_payment_id,
                        razorpaySignature: razorpay_signature,
                        // Relational connection
                        event: metadata.eventId ? { connect: { id: metadata.eventId } } : undefined
                    }
                });

                // If there's a donation amount, also create a DonationRecord for the donations management section
                if (donAmount > 0) {
                    const receiptNo = generateStandardId('RCT');

                    await prisma.donationRecord.create({
                        data: {
                            donorName: donorDetails.name,
                            email: donorDetails.email,
                            phone: donorDetails.phone,
                            amount: donAmount,
                            category: "Event Donation",
                            method: "Razorpay",
                            address: donorDetails.address,
                            organisation: donorDetails.organisation,
                            referredBy: donorDetails.referredBy || "None",
                            receiptNo,
                            status: "completed",
                            date: new Date(),
                            eventId: metadata.eventId,
                            registrationId: registration.id
                        }
                    });
                }
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

            return NextResponse.json({
                success: true,
                registrationNo: registration?.registrationNo
            });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
