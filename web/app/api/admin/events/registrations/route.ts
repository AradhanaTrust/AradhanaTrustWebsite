import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["PRIMARY_ADMIN", "SECONDARY_ADMIN"].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const search = searchParams.get('search');

        const where: any = {};

        if (eventId) where.eventId = eventId;
        if (status) where.status = status;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }
        if (search) {
            where.OR = [
                { registrationNo: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { eventTitle: { contains: search, mode: 'insensitive' } }
            ];
        }

        const registrations = await prisma.eventRegistration.findMany({
            where,
            include: {
                event: {
                    select: {
                        title: true,
                        date: true,
                        price: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(registrations);
    } catch (error) {
        console.error("[REGISTRATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["PRIMARY_ADMIN", "SECONDARY_ADMIN"].includes(session.user.role)) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const updated = await prisma.eventRegistration.update({
            where: { id },
            data: { status }
        });

        // Send Status Update Email
        try {
            const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
            await sendEmail({
                to: updated.email,
                subject: `Registration Status Updated: ${statusLabel}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #D4AF37;">Registration Status Update</h2>
                        <p>Dear <strong>${updated.name}</strong>,</p>
                        <p>The status of your registration for <strong>${updated.eventTitle}</strong> has been updated to:</p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                            <span style="font-size: 18px; font-weight: bold; color: #D4AF37; text-transform: uppercase;">${statusLabel}</span>
                        </div>
                        <p>Registration No: <strong>${updated.registrationNo || 'LEGACY'}</strong></p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="color: #888; font-size: 12px;">Thank you for your association with Aradhana Trust.</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Status Update Email Error:", emailError);
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[REGISTRATIONS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
