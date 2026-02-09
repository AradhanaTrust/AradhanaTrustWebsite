import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch only necessary fields for the dropdown
        const events = await prisma.event.findMany({
            select: {
                id: true,
                title: true,
                date: true,
            },
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("[EVENTS_LIST_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
