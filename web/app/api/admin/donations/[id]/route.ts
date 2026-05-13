import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if deletions are enabled
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "system" },
        });

        if (!settings?.enableDeletions) {
            return new NextResponse("Record deletion is currently disabled in system settings.", { status: 403 });
        }

        const { id } = await params;

        await prisma.donationRecord.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Donation record deleted successfully" });
    } catch (error) {
        console.error("[DONATION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
