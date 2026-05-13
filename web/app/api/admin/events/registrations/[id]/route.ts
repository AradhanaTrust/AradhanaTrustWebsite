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

        // When deleting a registration, we might also want to delete associated donation records
        // However, in our schema, DonationRecord has registrationId. 
        // If we delete the registration, the DonationRecord will have a null registrationId if it was set to onDelete: SetNull.
        // Let's check the schema again.

        await prisma.eventRegistration.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Event registration deleted successfully" });
    } catch (error) {
        console.error("[REGISTRATION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
