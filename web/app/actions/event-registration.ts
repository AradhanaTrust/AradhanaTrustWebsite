"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateStandardId } from "@/lib/id-generator";
import { generateReceiptPDF } from "@/lib/pdf-service";
import { sendEmail, getRegistrationEmailTemplate } from "@/lib/mail";

export async function registerForFreeEvent(eventId: string, eventTitle: string, userDetails: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    organisation?: string;
    referredBy?: string;
}) {
    // Re-validating Prisma types after generation
    try {
        if (!userDetails.name || !userDetails.email || !userDetails.phone) {
            return { success: false, message: "All fields are required" };
        }

        // Security Check: Verify event is actually free
        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) return { success: false, message: "Event not found" };

        // If event has a price > 0, we should not allow free registration route
        if (event.price && event.price > 0) {
            return { success: false, message: "This is a paid event. Payment is required." };
        }

        const regNo = await generateStandardId('REG');
        const registration = await prisma.eventRegistration.create({
            data: {
                registrationNo: regNo,
                eventId,
                eventTitle,
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
                address: userDetails.address,
                organisation: userDetails.organisation,
                referredBy: userDetails.referredBy,
                attendees: 1,
                totalAmount: 0,
                status: "registered",
                // specific for free events
                razorpayOrderId: "FREE_REGISTRATION"
            }
        });

        // Generate and Send Email in background (non-blocking if possible, but let's await for reliability here)
        try {
            const receiptData = {
                receiptType: 'Registration',
                receiptNo: regNo,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                userName: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
                eventTitle: eventTitle,
                amount: 0,
                paymentStatus: 'Registered'
            } as any;

            const pdfBuffer = await generateReceiptPDF(receiptData);

            await sendEmail({
                to: userDetails.email,
                subject: `Registration Confirmed: ${eventTitle}`,
                html: getRegistrationEmailTemplate(userDetails.name, eventTitle, regNo),
                attachments: [
                    {
                        filename: `Registration_Receipt_${regNo}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            });
        } catch (emailError) {
            console.error("Background Email Error:", emailError);
            // Don't fail the registration if email fails
        }

        return {
            success: true,
            message: "Registration successful! A confirmation email has been sent.",
            registrationId: registration.id,
            registrationNo: registration.registrationNo
        };
    } catch (error) {
        console.error("Free Registration Error:", error);
        return { success: false, message: "Failed to register. Please try again." };
    }
}
