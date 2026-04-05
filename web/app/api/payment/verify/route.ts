import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateStandardId } from "@/lib/id-generator";
import { generateReceiptPDF } from "@/lib/pdf-service";
import { sendEmail, getRegistrationEmailTemplate, getDonationEmailTemplate } from "@/lib/mail";

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
                const regNo = await generateStandardId('REG');

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

                // Generate and Send Email
                try {
                    const receiptData = {
                        receiptType: 'Registration',
                        receiptNo: regNo,
                        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                        userName: donorDetails.name,
                        email: donorDetails.email,
                        phone: donorDetails.phone,
                        eventTitle: metadata.eventTitle,
                        amount: parseFloat(amount),
                        paymentStatus: 'Paid'
                    } as any;

                    const pdfBuffer = await generateReceiptPDF(receiptData);

                    await sendEmail({
                        to: donorDetails.email,
                        subject: `Payment Successful & Registration Confirmed: ${metadata.eventTitle}`,
                        html: getRegistrationEmailTemplate(donorDetails.name, metadata.eventTitle, regNo),
                        attachments: [
                            {
                                filename: `Registration_Receipt_${regNo}.pdf`,
                                content: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        ]
                    });
                } catch (emailError) {
                    console.error("Event Verification Email Error:", emailError);
                }

                // If there's a donation amount, also create a DonationRecord for the donations management section
                if (donAmount > 0) {
                    const receiptNo = await generateStandardId('RCT');

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
                const donation = await prisma.donation.create({
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

                // Send Donation Receipt Email
                try {
                    const receiptNo = await generateStandardId('RCT'); // We could store this in DB too
                    const receiptData = {
                        receiptType: 'Donation',
                        receiptNo: receiptNo,
                        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                        userName: donorDetails.name,
                        email: donorDetails.email,
                        phone: donorDetails.phone,
                        amount: parseFloat(amount),
                        paymentStatus: 'Paid'
                    } as any;

                    const pdfBuffer = await generateReceiptPDF(receiptData);

                    await sendEmail({
                        to: donorDetails.email,
                        subject: `Donation Receipt: Aradhana Trust`,
                        html: getDonationEmailTemplate(donorDetails.name, parseFloat(amount), receiptNo),
                        attachments: [
                            {
                                filename: `Donation_Receipt_${receiptNo}.pdf`,
                                content: pdfBuffer,
                                contentType: 'application/pdf'
                            }
                        ]
                    });
                } catch (emailError) {
                    console.error("Donation Verification Email Error:", emailError);
                }
            }

            return NextResponse.json({
                success: true,
                registrationNo: registration?.registrationNo,
                registrationId: registration?.id
            });
        } else {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
