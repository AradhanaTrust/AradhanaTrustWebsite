import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateStandardId } from "@/lib/id-generator";
import { generateReceiptPDF } from "@/lib/pdf-service";
import { sendEmail, getRegistrationEmailTemplate, getDonationEmailTemplate } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get("x-razorpay-signature");

        if (!signature) {
            return NextResponse.json({ error: "Missing signature" }, { status: 400 });
        }

        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) {
            console.error("[WEBHOOK] RAZORPAY_WEBHOOK_SECRET is missing");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(bodyText)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("[WEBHOOK] Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const payload = JSON.parse(bodyText);
        
        // We handle payment.captured or order.paid
        if (payload.event === "order.paid" || payload.event === "payment.captured") {
            const paymentEntity = payload.payload.payment?.entity || {};
            const orderEntity = payload.payload.order?.entity || {};
            
            const razorpay_order_id = paymentEntity.order_id || orderEntity.id;
            const razorpay_payment_id = paymentEntity.id || "unknown";
            
            // We don't have the client's signature in webhook, but the webhook itself is signed and secure.
            const razorpay_signature = "webhook_verified";
            
            // Use order notes (as they were set during order creation)
            const notes = orderEntity.notes || paymentEntity.notes || {};
            const amount = paymentEntity.amount ? (paymentEntity.amount / 100).toString() : (orderEntity.amount / 100).toString(); 
            
            const metadata = {
                type: notes.type,
                eventId: notes.eventId,
                eventTitle: notes.eventTitle,
                registrationFee: notes.regFee,
                donationAmount: notes.donAmount
            };
            
            const donorDetails = {
                name: notes.name || "Anonymous",
                email: notes.email || "",
                phone: notes.phone || "",
                address: notes.address || "", 
                organisation: notes.org || notes.organisation || "",
                referredBy: notes.referredBy || "None"
            };

            if (!razorpay_order_id) {
                 return NextResponse.json({ success: true, message: "No order id, ignoring" });
            }

            console.log(`[WEBHOOK] Processing event ${payload.event} for order ${razorpay_order_id}`);

            // Deduplication Check
            const existingEventRegistration = await prisma.eventRegistration.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
            });
            const existingDonationRecord = await prisma.donationRecord.findFirst({
                where: { razorpayOrderId: razorpay_order_id }
            });

            if (existingEventRegistration || existingDonationRecord) {
                console.log(`[WEBHOOK] Duplicate processing detected for order ${razorpay_order_id}. Skipping DB creation.`);
                return NextResponse.json({ success: true, message: "Already processed" });
            }

            let registration;
            if (metadata?.type === 'event') {
                console.log(`[WEBHOOK] Processing Event Registration for order ${razorpay_order_id}`);
                const regNo = await generateStandardId('REG');
                const regFee = parseFloat(metadata.registrationFee || "0");
                const donAmount = parseFloat(metadata.donationAmount || "0");

                try {
                    registration = await prisma.eventRegistration.create({
                        data: {
                            registrationNo: regNo,
                            eventId: metadata.eventId,
                            eventTitle: metadata.eventTitle || "Unknown Event",
                            name: donorDetails.name,
                            email: donorDetails.email,
                            phone: donorDetails.phone,
                            address: donorDetails.address,
                            organisation: donorDetails.organisation,
                            referredBy: donorDetails.referredBy,
                            registrationFee: isNaN(regFee) ? 0 : regFee,
                            donationAmount: isNaN(donAmount) ? 0 : donAmount,
                            totalAmount: (isNaN(regFee) ? 0 : regFee) + (isNaN(donAmount) ? 0 : donAmount),
                            razorpayOrderId: razorpay_order_id,
                            razorpayPaymentId: razorpay_payment_id,
                            razorpaySignature: razorpay_signature,
                            status: "confirmed"
                        }
                    });
                } catch (regError: any) {
                    if (regError?.code === 'P2002') {
                        console.log(`[WEBHOOK] Duplicate caught by DB unique constraint for order ${razorpay_order_id}.`);
                        return NextResponse.json({ success: true, message: "Already processed" });
                    }
                    console.error(`[WEBHOOK] EventRegistration creation failed:`, regError);
                    throw regError;
                }

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
                    };

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
                    console.error("[WEBHOOK] Event Verification Email Error:", emailError);
                }

                if (donAmount > 0) {
                    const receiptNo = await generateStandardId('RCT');
                    try {
                        await prisma.donationRecord.create({
                            data: {
                                donorName: donorDetails.name,
                                email: donorDetails.email,
                                phone: donorDetails.phone,
                                amount: isNaN(donAmount) ? 0 : donAmount,
                                category: "Event Donation",
                                method: "Razorpay",
                                address: donorDetails.address,
                                organisation: donorDetails.organisation,
                                referredBy: donorDetails.referredBy,
                                receiptNo,
                                status: "completed",
                                date: new Date(),
                                eventId: metadata.eventId,
                                registrationId: registration.id,
                                razorpayOrderId: razorpay_order_id,
                                razorpayPaymentId: razorpay_payment_id,
                                razorpaySignature: razorpay_signature
                            }
                        });
                    } catch (donError) {
                        console.error(`[WEBHOOK] DonationRecord creation failed:`, donError);
                    }
                }
            } else {
                console.log(`[WEBHOOK] Processing General Donation for order ${razorpay_order_id}`);
                const receiptNo = await generateStandardId('RCT');
                const parsedAmount = parseFloat(amount);
                
                try {
                    await prisma.donationRecord.create({
                        data: {
                            amount: isNaN(parsedAmount) ? 0 : parsedAmount,
                            status: "completed",
                            donorName: donorDetails.name,
                            email: donorDetails.email,
                            phone: donorDetails.phone,
                            address: donorDetails.address,
                            organisation: donorDetails.organisation,
                            referredBy: donorDetails.referredBy,
                            category: "General", 
                            method: "Razorpay",
                            receiptNo: receiptNo,
                            date: new Date(),
                            razorpayOrderId: razorpay_order_id,
                            razorpayPaymentId: razorpay_payment_id,
                            razorpaySignature: razorpay_signature
                        }
                    });
                } catch (dbError: any) {
                    if (dbError?.code === 'P2002') {
                        console.log(`[WEBHOOK] Duplicate caught by DB unique constraint for order ${razorpay_order_id}.`);
                        return NextResponse.json({ success: true, message: "Already processed" });
                    }
                    console.error(`[WEBHOOK] Database creation failed for DonationRecord. Error:`, dbError);
                    throw dbError; 
                }

                try {
                    const receiptData = {
                        receiptType: 'Donation',
                        receiptNo: receiptNo,
                        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                        userName: donorDetails.name,
                        email: donorDetails.email,
                        phone: donorDetails.phone,
                        amount: isNaN(parsedAmount) ? 0 : parsedAmount,
                        paymentStatus: 'Paid'
                    };

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
                    console.error("[WEBHOOK] Donation Verification Email Error:", emailError);
                }
            }

            return NextResponse.json({ success: true, message: "Processed successfully" });
        }

        return NextResponse.json({ success: true, message: "Event ignored" });

    } catch (error: unknown) {
        console.error("[WEBHOOK_FATAL] Webhook Error:", error);
        return NextResponse.json({ 
            error: "Internal Server Error", 
        }, { status: 500 });
    }
}
