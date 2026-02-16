
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";

export async function GET() {
    try {
        const images = await prisma.galleryImage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(images);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const title = formData.get("title") as string;
        const category = formData.get("category") as string;

        if (!file || !category) {
            return new NextResponse("Missing file or category", { status: 400 });
        }

        // Upload to Vercel Blob
        const blob = await put(file.name, file, {
            access: 'public',
        });

        // Create DB record with Blob URL
        const image = await prisma.galleryImage.create({
            data: {
                title: title || "",
                category,
                imageUrl: blob.url
            }
        });

        return NextResponse.json(image);
    } catch (error) {
        console.error("[GALLERY_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing ID", { status: 400 });
        }

        const image = await prisma.galleryImage.findUnique({
            where: { id }
        });

        if (!image) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Delete from Vercel Blob
        try {
            await del(image.imageUrl);
        } catch (e) {
            console.error("Failed to delete blob:", e);
        }

        // Delete from DB
        await prisma.galleryImage.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[GALLERY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
