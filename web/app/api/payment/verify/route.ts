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

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(body.toString())
            .digest("hex");

        console.log(`[VERIFY_PAYMENT] Signature generated for order ${razorpay_order_id}. Expecting: ${expectedSignature}, Received: ${razorpay_signature}`);

        if (expectedSignature === razorpay_signature) {
            // 1. Signature matches - Payment Successful
            console.log(`[VERIFY_PAYMENT] Signature MATCHED for order ${razorpay_order_id}. Proceeding with DB operations.`);


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
                // Default: Create Donation Record (for Admin Dashboard)
                console.log(`[VERIFY_PAYMENT] Processing General Donation for order ${razorpay_order_id}`);
                const receiptNo = await generateStandardId('RCT');
                
                try {
                    const donation = await prisma.donationRecord.create({
                        data: {
                            amount: parseFloat(amount),
                            status: "completed",
                            donorName: donorDetails?.name || "Anonymous",
                            email: donorDetails?.email || "",
                            phone: donorDetails?.phone || "",
                            address: donorDetails?.address || "",
                            organisation: donorDetails?.organisation || "",
                            referredBy: donorDetails?.referredBy || "None",
                            category: "General", // Default category
                            method: "Razorpay",
                            receiptNo: receiptNo,
                            date: new Date()
                        }
                    });
                    console.log(`[VERIFY_PAYMENT] Successfully created DonationRecord with ID: ${donation.id}, Receipt: ${receiptNo}`);
                } catch (dbError) {
                    console.error(`[VERIFY_PAYMENT] Database creation failed for DonationRecord. Error:`, dbError);
                    throw dbError; // Bubble up to trigger 500 error properly
                }

                // Send Donation Receipt Email
                try {
                    console.log(`[VERIFY_PAYMENT] Generating PDF and sending email for Receipt: ${receiptNo}`);
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

            console.log(`[VERIFY_PAYMENT] Transaction successfully completed for order ${razorpay_order_id}. Returning success to frontend.`);
            return NextResponse.json({
                success: true,
                registrationNo: registration?.registrationNo,
                registrationId: registration?.id
            });
        } else {
            console.error(`[VERIFY_PAYMENT] Signature MISMATCH for order ${razorpay_order_id}`);
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("[VERIFY_PAYMENT_FATAL] Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error. Check server logs." }, { status: 500 });
    }
}
