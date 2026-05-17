import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReceiptPDF } from "@/lib/pdf-service";
import fs from "fs";
import path from "path";

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

        // Prepare logo base64
        let logoDataUrl = undefined;
        try {
            const logoPath = path.join(process.cwd(), "public/assets/Logo_Main.png");
            const logoBuffer = fs.readFileSync(logoPath);
            const base64 = logoBuffer.toString("base64");
            logoDataUrl = `data:image/png;base64,${base64}`;
        } catch (e) {
            console.error("Failed to read logo for PDF generation:", e);
        }

        let receiptData;

        if (registration) {
            receiptData = {
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
                paymentStatus: registration.status === 'registered' || registration.status === 'confirmed' ? 'Paid' : 'Pending',
                logoDataUrl
            };
        } else {
            const donation = await prisma.donationRecord.findUnique({
                where: { id: registrationId },
                include: { event: true }
            });

            if (!donation) {
                return NextResponse.json({ error: "Receipt record not found" }, { status: 404 });
            }

            receiptData = {
                receiptType: 'Donation',
                receiptNo: donation.receiptNo,
                date: new Date(donation.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                userName: donation.donorName,
                email: donation.email || "",
                phone: donation.phone || undefined,
                eventTitle: donation.event?.title || undefined,
                amount: donation.amount,
                paymentStatus: donation.status === 'completed' ? 'Paid' : 'Pending',
                logoDataUrl
            };
        }

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
