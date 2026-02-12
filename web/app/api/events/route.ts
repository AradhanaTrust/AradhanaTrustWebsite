
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const event = await prisma.event.findUnique({
                where: { id }
            });
            return NextResponse.json(event);
        }

        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });

        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
