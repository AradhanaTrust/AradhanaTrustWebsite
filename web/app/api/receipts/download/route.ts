import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReceiptPDF } from "@/lib/pdf-service";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const registrationId = searchParams.get("id");

        if (!registrationId) {
            return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
        }

        const registration = await prisma.eventRegistration.findUnique({
            where: { id: registrationId },
            include: { event: true }
        });

        if (!registration) {
            return NextResponse.json({ error: "Registration not found" }, { status: 404 });
        }

        // Prepare data for the PDF template
        const receiptData = {
            receiptType: registration.donationAmount > 0 && registration.registrationFee === 0 ? 'Donation' : 'Registration',
            receiptNo: registration.registrationNo || "LEGACY",
            date: new Date(registration.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }),
            userName: registration.name,
            email: registration.email,
            phone: registration.phone || undefined,
            eventTitle: registration.eventTitle,
            amount: registration.totalAmount,
            paymentStatus: registration.status === 'registered' || registration.status === 'confirmed' ? 'Paid' : 'Pending'
        };

        const pdfBuffer = await generateReceiptPDF(receiptData);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=Aradhana_Trust_Receipt_${receiptData.receiptNo}.pdf`,
            },
        });
    } catch (error) {
        console.error("Download Receipt Error:", error);
        return NextResponse.json({ error: "Failed to generate receipt" }, { status: 500 });
    }
}
