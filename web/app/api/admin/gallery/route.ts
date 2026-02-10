
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

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

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save file locally
        const fileName = `${crypto.randomUUID()}${path.extname(file.name)}`;
        const relativePath = `/uploads/gallery/${fileName}`;
        const absolutePath = path.join(process.cwd(), "public", "uploads", "gallery", fileName);

        // Ensure folder exists
        const dir = path.dirname(absolutePath);
        if (!existsSync(dir)) {
            await mkdir(dir, { recursive: true });
        }

        await writeFile(absolutePath, buffer);

        // Create DB record
        const image = await prisma.galleryImage.create({
            data: {
                title: title || "",
                category,
                imageUrl: relativePath
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

        // Delete from FS
        const absolutePath = path.join(process.cwd(), "public", image.imageUrl);
        try {
            if (existsSync(absolutePath)) {
                await unlink(absolutePath);
            }
        } catch (e) {
            console.error("Failed to delete file:", e);
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
