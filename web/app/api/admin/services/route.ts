import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET all service requests
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const requests = await prisma.serviceRequest.findMany({
            include: {
                priest: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(requests);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch service requests" }, { status: 500 });
    }
}

// PATCH update service request (status, notes, priest assignment)
export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        const updated = await prisma.serviceRequest.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update service request" }, { status: 500 });
    }
}

// DELETE service request
export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await prisma.serviceRequest.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete service request" }, { status: 500 });
    }
}
