import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const whereClause: any = {};
        if (status) whereClause.status = status;

        const priests = await prisma.priestRegistration.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(priests);
    } catch (error) {
        console.error("Error fetching Priest Registrations:", error);
        return NextResponse.json(
            { error: "Failed to fetch Priest applications." },
            { status: 500 }
        );
    }
}
