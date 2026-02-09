import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const method = searchParams.get("method");
        const eventId = searchParams.get("eventId");
        const search = searchParams.get("search");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const whereClause: any = {};

        if (category && category !== "all") {
            whereClause.category = category;
        }

        if (method && method !== "all") {
            whereClause.method = method;
        }

        if (eventId && eventId !== "all") {
            whereClause.eventId = eventId;
        }

        if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            whereClause.date = {
                gte: new Date(startDate),
                lte: end,
            };
        }

        if (search) {
            whereClause.OR = [
                { donorName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { receiptNo: { contains: search, mode: 'insensitive' } },
            ];
        }

        const donations = await prisma.donationRecord.findMany({
            where: whereClause,
            include: {
                event: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(donations);
    } catch (error) {
        console.error("[DONATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
