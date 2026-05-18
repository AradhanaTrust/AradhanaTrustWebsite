import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "system" },
            select: {
                facebookUrl: true,
                instagramUrl: true,
                youtubeUrl: true,
                whatsappUrl: true,
                callUrl: true,
            },
        });

        return NextResponse.json(settings || {});
    } catch (error) {
        console.error("[PUBLIC_SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
