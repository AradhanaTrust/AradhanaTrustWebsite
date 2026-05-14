import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
// import { prisma } from "@/lib/prisma"; // Unused for now

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = "INR" } = await req.json();

        if (!amount || amount < 1) {
            return NextResponse.json({ error: "Invalid amount. Minimum amount is 1 INR (100 paise)." }, { status: 400 });
        }

        // Instantiate inside the handler to prevent build-time errors
        // when environment variables are missing
        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
            amount: Math.round(amount * 100), // Amount in paise (e.g. 100 INR = 10000 paise). Math.round to avoid floating point errors
            currency,
            receipt: `rcpt_${Date.now().toString().slice(-6)}`,
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
