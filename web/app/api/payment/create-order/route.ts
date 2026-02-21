import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
// import { prisma } from "@/lib/prisma"; // Unused for now

export async function POST(req: NextRequest) {
    try {
        const { amount, currency = "INR" } = await req.json();

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

        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: "Error creating order" }, { status: 500 });
    }
}
