import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateStandardId } from "@/lib/id-generator";
import { generateReceiptPDF } from "@/lib/pdf-service";
import { sendEmail, getRegistrationEmailTemplate, getDonationEmailTemplate } from "@/lib/mail";

export async function POST(req: NextRequest) {
    // Re-validating Prisma types
    try {
        const payload = await req.json();
        console.log("[VERIFY_PAYMENT] Payload received:", JSON.stringify(payload, null, 2));

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, donorDetails, metadata } = payload;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            console.error("[VERIFY_PAYMENT] Missing required payment fields");
            return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
        }

        const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
        if (!secret) {
            console.error("[VERIFY_PAYMENT] RAZORPAY_KEY_SECRET is not configured in environment variables");
            return NextResponse.json({ error: "Internal Server Error: Secret key missing" }, { status: 500 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        console.log(`[VERIFY_PAYMENT] Signature generated for order ${razorpay_order_id}. Expecting: ${expectedSignature}, Received: ${razorpay_signature}`);

        if (expectedSignature === razorpay_signature) {
            // 1. Signature matches - Payment Successful
            console.log(`[VERIFY_PAYMENT] Signature MATCHED for order ${razorpay_order_id}. Proceeding with DB operations.`);

            // Deduplication Check
            const existingEventRegistration = await prisma.eventRegistration.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
            });
            const existingDonationRecord = await prisma.donationRecord.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
            });

            if (existingEventRegistration || existingDonationRecord) {
                console.log(`[VERIFY_PAYMENT] Duplicate processing detected for order ${razorpay_order_id}. Skipping DB creation.`);
                return NextResponse.json({
                    success: true,
                    registrationNo: existingEventRegistration?.registrationNo || existingDonationRecord?.receiptNo,
                    registrationId: existingEventRegistration?.id || existingDonationRecord?.id
                });
            }


            let registration;
            if (metadata?.type === 'event') {
                console.log(`[VERIFY_PAYMENT] Processing Event Registration for order ${razorpay_order_id}`);
                const regNo = await generateStandardId('REG');
                const regFee = parseFloat(metadata.registrationFee || 0);
                const donAmount = parseFloat(metadata.donationAmount || 0);

                if (isNaN(regFee) || isNaN(donAmount)) {
                    console.error(`[VERIFY_PAYMENT] Invalid amounts received: regFee=${metadata.registrationFee}, donAmount=${metadata.donationAmount}`);
                }

                // Create Event Registration
                try {
                    registration = await prisma.eventRegistration.create({
                        data: {
                            registrationNo: regNo,
                            eventId: metadata.eventId,
                            eventTitle: metadata.eventTitle || "Unknown Event",
                            name: donorDetails?.name || "Anonymous",
                            email: donorDetails?.email || "",
                            phone: donorDetails?.phone || "",
                            address: donorDetails?.address || "",
                            organisation: donorDetails?.organisation || "",
                            referredBy: donorDetails?.referredBy || "None",
                            registrationFee: isNaN(regFee) ? 0 : regFee,
                            donationAmount: isNaN(donAmount) ? 0 : donAmount,
                            totalAmount: (isNaN(regFee) ? 0 : regFee) + (isNaN(donAmount) ? 0 : donAmount),
                            razorpayOrderId: razorpay_order_id,
                            razorpayPaymentId: razorpay_payment_id,
                            razorpaySignature: razorpay_signature,
                            status: "confirmed"
                        }
                    });
                    console.log(`[VERIFY_PAYMENT] Successfully created EventRegistration ID: ${registration.id}, RegNo: ${regNo}`);
                } catch (regError: any) {
                    if (regError?.code === 'P2002') {
                        console.log(`[VERIFY_PAYMENT] Duplicate caught by DB unique constraint for order ${razorpay_order_id}.`);
                        return NextResponse.json({ success: true, message: "Already processed" });
                    }
                    console.error(`[VERIFY_PAYMENT] EventRegistration creation failed:`, regError);
                    throw regError;
                }

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
                    try {
                        await prisma.donationRecord.create({
                            data: {
                                donorName: donorDetails?.name || "Anonymous",
                                email: donorDetails?.email || "",
                                phone: donorDetails?.phone || "",
                                amount: isNaN(donAmount) ? 0 : donAmount,
                                category: "Event Donation",
                                method: "Razorpay",
                                address: donorDetails?.address || "",
                                organisation: donorDetails?.organisation || "",
                                referredBy: donorDetails?.referredBy || "None",
                                receiptNo,
                                status: "completed",
                                date: new Date(),
                                eventId: metadata.eventId,
                                registrationId: registration.id,
                                razorpayOrderId: razorpay_order_id
                            }
                        });
                        console.log(`[VERIFY_PAYMENT] Successfully created DonationRecord linked to EventRegistration. Receipt: ${receiptNo}`);
                    } catch (donError) {
                        console.error(`[VERIFY_PAYMENT] DonationRecord (from Event) creation failed:`, donError);
                        // We don't throw here to avoid failing the whole registration if only donation record fails
                    }
                }
            } else {
                // Default: Create Donation Record (for Admin Dashboard)
                console.log(`[VERIFY_PAYMENT] Processing General Donation for order ${razorpay_order_id}`);
                const receiptNo = await generateStandardId('RCT');
                const parsedAmount = parseFloat(amount);
                
                try {
                    const donation = await prisma.donationRecord.create({
                        data: {
                            amount: isNaN(parsedAmount) ? 0 : parsedAmount,
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
                            date: new Date(),
                            razorpayOrderId: razorpay_order_id
                        }
                    });
                    console.log(`[VERIFY_PAYMENT] Successfully created DonationRecord with ID: ${donation.id}, Receipt: ${receiptNo}`);
                } catch (dbError: any) {
                    if (dbError?.code === 'P2002') {
                        console.log(`[VERIFY_PAYMENT] Duplicate caught by DB unique constraint for order ${razorpay_order_id}.`);
                        return NextResponse.json({ success: true, message: "Already processed" });
                    }
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
                        userName: donorDetails?.name || "Donor",
                        email: donorDetails?.email || "",
                        phone: donorDetails?.phone || "",
                        amount: isNaN(parsedAmount) ? 0 : parsedAmount,
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
    } catch (error: any) {
        console.error("[VERIFY_PAYMENT_FATAL] Verification Error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error. Check server logs.", 
            details: error?.message || String(error)
        }, { status: 500 });
    }
}
