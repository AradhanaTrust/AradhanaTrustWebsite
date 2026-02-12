
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            const event = await prisma.event.findUnique({
                where: { id }
            });
            return NextResponse.json(event);
        }

        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' }
        });

        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["PRIMARY_ADMIN", "SECONDARY_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        // Extract fields
        const title = formData.get("title") as string;
        const titleKn = formData.get("titleKn") as string || null;
        const category = formData.get("category") as string || "community";
        const dateStr = formData.get("date") as string;
        const time = formData.get("time") as string;
        const location = formData.get("location") as string;
        const locationKn = formData.get("locationKn") as string || null;
        const description = formData.get("description") as string;
        const descriptionKn = formData.get("descriptionKn") as string || null;
        const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null;
        const registrationOpen = formData.get("registrationOpen") === "true";
        const existingImageUrl = formData.get("imageUrl") as string | null;

        let imageUrl = existingImageUrl || "";

        // Handle Image Upload
        if (file) {
            // If replacing an existing image (and it's a blob url), delete old one
            if (imageUrl && imageUrl.includes("public.blob.vercel-storage.com")) {
                try {
                    await del(imageUrl);
                } catch (e) {
                    console.error("Failed to delete old blob:", e);
                }
            }

            const blob = await put(file.name, file, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        // Validate required fields
        if (!title || !dateStr || !time || !location || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                title,
                titleKn,
                category,
                date: new Date(dateStr),
                time,
                location,
                locationKn,
                description,
                descriptionKn,
                imageUrl,
                capacity,
                registrationOpen
            }
        });

        return NextResponse.json(event);

    } catch (error) {
        console.error("Event creation failed:", error);
        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["PRIMARY_ADMIN", "SECONDARY_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const id = formData.get("id") as string;
        if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

        const file = formData.get("file") as File | null;

        // Extract fields
        const title = formData.get("title") as string;
        const titleKn = formData.get("titleKn") as string || null;
        const category = formData.get("category") as string || "community";
        const dateStr = formData.get("date") as string;
        const time = formData.get("time") as string;
        const location = formData.get("location") as string;
        const locationKn = formData.get("locationKn") as string || null;
        const description = formData.get("description") as string;
        const descriptionKn = formData.get("descriptionKn") as string || null;
        const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string) : null;
        const registrationOpen = formData.get("registrationOpen") === "true";

        let imageUrl = event.imageUrl;

        // Handle Image Upload
        if (file) {
            if (imageUrl && imageUrl.includes("public.blob.vercel-storage.com")) {
                try {
                    await del(imageUrl);
                } catch (e) {
                    console.error("Failed to delete old blob:", e);
                }
            }

            const blob = await put(file.name, file, {
                access: 'public',
            });
            imageUrl = blob.url;
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title,
                titleKn,
                category,
                date: new Date(dateStr),
                time,
                location,
                locationKn,
                description,
                descriptionKn,
                imageUrl,
                capacity,
                registrationOpen
            }
        });

        return NextResponse.json(updatedEvent);

    } catch (error) {
        console.error("Event update failed:", error);
        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["PRIMARY_ADMIN", "SECONDARY_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: "Event ID required" }, { status: 400 });
        }

        const event = await prisma.event.findUnique({ where: { id } });
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

        // Delete image from blob if exists
        if (event.imageUrl && event.imageUrl.includes("public.blob.vercel-storage.com")) {
            try {
                await del(event.imageUrl);
            } catch (e) {
                console.error("Failed to delete blob:", e);
            }
        }

        await prisma.event.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Event deletion failed:", error);
        return NextResponse.json(
            { error: "Failed to delete event" },
            { status: 500 }
        );
    }
}
