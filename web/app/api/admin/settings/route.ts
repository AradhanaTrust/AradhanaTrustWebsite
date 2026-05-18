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

        let settings = await prisma.systemSettings.findUnique({
            where: { id: "system" },
        });

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: { id: "system", enableDeletions: false },
            });
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new NextResponse("Unauthorized.", { status: 401 });
        }

        const { enableDeletions, facebookUrl, instagramUrl, youtubeUrl, whatsappUrl, callUrl, upiId, upiQrCodeImage } = await req.json();

        const updateData: any = {};
        if (enableDeletions !== undefined) updateData.enableDeletions = enableDeletions;
        if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
        if (instagramUrl !== undefined) updateData.instagramUrl = instagramUrl;
        if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl;
        if (whatsappUrl !== undefined) updateData.whatsappUrl = whatsappUrl;
        if (callUrl !== undefined) updateData.callUrl = callUrl;
        if (upiId !== undefined) updateData.upiId = upiId;
        if (upiQrCodeImage !== undefined) updateData.upiQrCodeImage = upiQrCodeImage;

        const settings = await prisma.systemSettings.upsert({
            where: { id: "system" },
            update: updateData,
            create: { id: "system", enableDeletions: false, ...updateData },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
