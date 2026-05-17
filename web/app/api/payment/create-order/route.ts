import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
// import { prisma } from "@/lib/prisma"; // Unused for now

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = "INR", donorDetails = {}, metadata = {} } = await req.json();

        if (!amount || amount < 1) {
            return NextResponse.json({ error: "Invalid amount. Minimum amount is 1 INR (100 paise)." }, { status: 400 });
        }

        // Instantiate inside the handler to prevent build-time errors
        // when environment variables are missing
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const notes: Record<string, string> = {
            name: donorDetails.name?.substring(0, 254) || "Anonymous",
            email: donorDetails.email?.substring(0, 254) || "",
            phone: donorDetails.phone?.substring(0, 254) || "",
            address: donorDetails.address?.substring(0, 254) || "",
            org: donorDetails.organisation?.substring(0, 254) || "",
            referredBy: donorDetails.referredBy?.substring(0, 254) || "",
            type: metadata.type?.substring(0, 254) || "general",
            eventId: metadata.eventId?.substring(0, 254) || "",
            eventTitle: metadata.eventTitle?.substring(0, 254) || "",
            regFee: metadata.registrationFee?.toString().substring(0, 254) || "0",
            donAmount: metadata.donationAmount?.toString().substring(0, 254) || "0",
        };
        // Clean up empty notes
        Object.keys(notes).forEach(key => (!notes[key]) && delete notes[key]);

        const options = {
            amount: Math.round(amount * 100), // Amount in paise (e.g. 100 INR = 10000 paise). Math.round to avoid floating point errors
            currency,
            receipt: `rcpt_${Date.now().toString().slice(-6)}`,
            notes,
        };

        const order = await razorpay.orders.create(options);

        // Send back the key_id used to create the order to ensure the frontend uses the exact same key.
        // This prevents mismatches if NEXT_PUBLIC_ variables were baked in with different values during build.
        return NextResponse.json({ ...order, key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID! });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
