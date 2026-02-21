# Razorpay Integration Guide for Aradhana Trust

This guide runs through the steps to integrate Razorpay for donations and event registrations.

## 1. Pre-requisites
1.  **Create a Razorpay Account**: [Sign up here](https://dashboard.razorpay.com/signup).
2.  **Generate API Keys**:
    -   Go to **Settings** > **API Keys**.
    -   Generate a "Test Key" for development.
    -   Download/Copy `Key ID` and `Key Secret`.

## 2. Installation
Install the Razorpay Node.js SDK and `crypto` (built-in, but ensuring usage):

```bash
npm install razorpay shortid
```
*(Note: `shortid` is useful for generating unique receipt IDs, or we can use CUIDs)*

## 3. Environment Variables
Add the following to your `.env` file (and Vercel Env Vars):

```env
# Razorpay Test Credentials
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_key_secret"
```
*Note: `NEXT_PUBLIC_` prefix is needed for the Key ID as it will be used on the client-side.*

## 4. Database Schema Updates (`prisma/schema.prisma`)
Update the `Donation` or `EventRegistration` models to store payment details.

```prisma
model Donation {
  id              String   @id @default(cuid())
  amount          Float
  currency        String   @default("INR")
  status          String   // "created", "paid", "failed"
  razorpayOrderId String   @unique
  razorpayPaymentId String?
  razorpaySignature String?
  donorName       String
  donorEmail      String
  donorPhone      String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```
*Run `npx prisma push` after updating.*

## 5. API Routes

### A. Create Order (`app/api/payment/create-order/route.ts`)
This API interacts with Razorpay to generate an order ID.

```typescript
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma"; // Adjust path to your prisma client

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "INR" } = await req.json();

    const options = {
      amount: amount * 100, // Amount in paise (e.g. 100 INR = 10000 paise)
      currency,
      receipt: `rcpt_${Date.now().toString().slice(-6)}`,
    };

    const order = await razorpay.orders.create(options);

    // Optional: Save 'created' order to DB here if needed
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
```

### B. Verify Payment (`app/api/payment/verify/route.ts`)
This API verifies the signature returned by Razorpay after a successful client-side transaction.

```typescript
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, donorDetails } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // 1. Signature matches - Payment Successful
      
      // 2. Save to Database
      await prisma.donation.create({
        data: {
          amount: parseFloat(amount),
          status: "paid",
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          donorName: donorDetails.name,
          donorEmail: donorDetails.email,
          donorPhone: donorDetails.phone,
        }
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
```

## 6. Frontend Integration (`components/RazorpayButton.tsx`)

1. Limit loading the script to when needed, or use `next/script` in `layout.tsx` or the component.

```tsx
"use client";
import { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({ amount, donorDetails }: { amount: number, donorDetails: any }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    // 1. Create Order
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
    const order = await res.json();

    if (!order.id) {
      alert("Server error. Please try again.");
      setLoading(false);
      return;
    }

    // 2. Initialize Options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Aradhana Dharmika Trust",
      description: "Donation",
      // image: "/logo.png",
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify Payment
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          body: JSON.stringify({
            ...response,
            amount,
            donorDetails
          }),
        });
        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed.");
        }
      },
      prefill: {
        name: donorDetails.name,
        email: donorDetails.email,
        contact: donorDetails.phone,
      },
      theme: {
        color: "#D4AF37", // Trust Gold
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
    setLoading(false);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button onClick={handlePayment} disabled={loading} className="...">
        {loading ? "Processing..." : "Donate Now"}
      </button>
    </>
  );
}
```

## 7. Testing
-   Use the "Test Mode" keys.
-   Use Razorpay's [Test Card Details](https://razorpay.com/docs/payments/payments/test-card-details/) to simulate success/failure.
