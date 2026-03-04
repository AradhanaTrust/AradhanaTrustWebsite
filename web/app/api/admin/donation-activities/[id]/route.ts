import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@/lib/storage";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        const title = formData.get("title") as string;
        const titleKn = formData.get("titleKn") as string | null;
        const description = formData.get("description") as string;
        const descriptionKn = formData.get("descriptionKn") as string | null;
        const videoUrl = formData.get("videoUrl") as string | null;
        const isActive = formData.get("isActive") === "true";
        const orderVal = formData.get("order") ? parseInt(formData.get("order") as string) : 0;
        const existingImageUrl = formData.get("imageUrl") as string | null;

        const { id } = await params;

        let imageUrl = existingImageUrl || "";

        // Handle Image Upload
        if (file && file.size > 0) {
            if (imageUrl && imageUrl.includes("public.blob.vercel-storage.com")) {
                try { await del(imageUrl); } catch (e) { console.error("Failed to delete old blob:", e); }
            }

            const blob = await put(file.name, file, {
                access: 'public',
                allowOverwrite: true,
                addRandomSuffix: true
            });
            imageUrl = blob.url;
        }

        const activity = await prisma.donationActivity.update({
            where: { id },
            data: {
                title,
                titleKn,
                description,
                descriptionKn,
                imageUrl: imageUrl || null,
                videoUrl,
                isActive,
                order: orderVal,
            }
        });

        return NextResponse.json(activity);
    } catch (error) {
        console.error("[DONATION_ACTIVITY_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const activity = await prisma.donationActivity.findUnique({ where: { id } });
        if (activity?.imageUrl && activity.imageUrl.includes("public.blob.vercel-storage.com")) {
            try { await del(activity.imageUrl); } catch (e) { console.error("Failed to delete blob:", e); }
        }

        await prisma.donationActivity.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DONATION_ACTIVITY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
