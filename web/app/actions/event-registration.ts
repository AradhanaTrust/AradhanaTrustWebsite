"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

        await prisma.eventRegistration.create({
            data: {
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

        // revalidatePath(`/events`); // Optional: if we show attendee counts
        return { success: true, message: "Registration successful!" };
    } catch (error) {
        console.error("Free Registration Error:", error);
        return { success: false, message: "Failed to register. Please try again." };
    }
}
