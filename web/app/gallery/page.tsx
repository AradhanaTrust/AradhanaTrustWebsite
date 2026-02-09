
import { prisma } from "@/lib/prisma";
import { galleryImages } from "@/lib/galleryData";
import GalleryClient from "./gallery-client";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
    // Fetch dynamic images from DB
    const dbImages = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // Map DB images to GalleryImage interface
    const formattedDbImages = dbImages.map(img => ({
        id: img.id,
        src: img.imageUrl,
        category: img.category,
        alt: img.title,
        title: img.title,
        titleKey: undefined
    }));

    // Merge static and dynamic images
    // You might want to show dynamic first
    const allImages = [...formattedDbImages, ...galleryImages];

    return <GalleryClient initialImages={allImages} />;
}
