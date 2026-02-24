import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { id } = await params;

        const updatedRegistration = await prisma.priestRegistration.update({
            where: { id },
            data: {
                status: data.status,
                adminNotes: data.adminNotes
            }
        });

        return NextResponse.json(updatedRegistration);
    } catch (error) {
        console.error("Error updating Priest Registration:", error);
        return NextResponse.json({ error: "Failed to update Priest registration" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.priestRegistration.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting Priest Registration:", error);
        return NextResponse.json({ error: "Failed to delete Priest registration" }, { status: 500 });
    }
}
