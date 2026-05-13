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

        if (!session || session.user?.role !== "PRIMARY_ADMIN") {
            return new NextResponse("Unauthorized. Only Primary Admin can change system settings.", { status: 401 });
        }

        const { enableDeletions } = await req.json();

        const settings = await prisma.systemSettings.upsert({
            where: { id: "system" },
            update: { enableDeletions },
            create: { id: "system", enableDeletions },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
