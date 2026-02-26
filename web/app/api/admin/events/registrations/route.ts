
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[REGISTRATIONS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
