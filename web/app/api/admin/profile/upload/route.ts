import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { put } from "@/lib/storage";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse("Missing file", { status: 400 });
        }

        // Upload to Vercel Blob / Local Storage Proxy
        const blob = await put(file.name, file, {
            access: 'public',
            allowOverwrite: true,
            addRandomSuffix: true,
            category: 'profile' // Instructs lib/storage.ts to use absolute path
        });

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error("[PROFILE_UPLOAD_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
