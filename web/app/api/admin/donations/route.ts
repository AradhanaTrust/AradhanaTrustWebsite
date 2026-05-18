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
        const referredBy = searchParams.get("referredBy");

        const conditions: any[] = [];

        if (category && category !== "all") {
            conditions.push({ category });
        }

        if (method && method !== "all") {
            if (method === "UPI") {
                conditions.push({
                    OR: [
                        { method: "UPI" },
                        { method: { contains: "UPI" } }
                    ]
                });
            } else if (method === "Credit/Debit Card") {
                conditions.push({
                    OR: [
                        { method: "Credit/Debit Card" },
                        { method: { contains: "CARD" } }
                    ]
                });
            } else if (method === "Net Banking") {
                conditions.push({
                    OR: [
                        { method: "Net Banking" },
                        { method: { contains: "NETBANKING" } }
                    ]
                });
            } else {
                conditions.push({ method });
            }
        }

        if (eventId && eventId !== "all") {
            conditions.push({ eventId });
        }

        if (referredBy) {
            conditions.push({ referredBy: { contains: referredBy } });
        }

        if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            conditions.push({
                date: {
                    gte: new Date(startDate),
                    lte: end,
                }
            });
        }

        if (search) {
            conditions.push({
                OR: [
                    { donorName: { contains: search } },
                    { email: { contains: search } },
                    { phone: { contains: search } },
                    { receiptNo: { contains: search } },
                    { referredBy: { contains: search } },
                    { razorpayOrderId: { contains: search } },
                    { razorpayPaymentId: { contains: search } },
                ]
            });
        }

        const whereClause = conditions.length > 0 ? { AND: conditions } : {};

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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            donorName,
            email,
            phone,
            amount,
            category,
            method,
            address,
            panNumber,
            referredBy
        } = body;

        if (!donorName || !amount || !category || !method) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Generate simple receipt number
        const date = new Date();
        const receiptNo = `RCT-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        const donation = await prisma.donationRecord.create({
            data: {
                donorName,
                email,
                phone,
                amount: parseFloat(amount),
                category,
                method,
                address,
                panNumber,
                referredBy: referredBy || "None",
                receiptNo,
                status: "completed",
                date: new Date()
            }
        });

        return NextResponse.json(donation);
    } catch (error) {
        console.error("[DONATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
