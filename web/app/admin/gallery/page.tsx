import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GalleryImage } from "@prisma/client";
import GalleryManagementClient from "./gallery-client";
import DashboardLayout from "@/components/admin/DashboardLayout";

export default async function GalleryAdminPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const images = await prisma.galleryImage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const serializedImages = images.map((img: GalleryImage) => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
        updatedAt: img.updatedAt.toISOString()
    }));

    return (
        <DashboardLayout>
            <GalleryManagementClient initialImages={serializedImages} />
        </DashboardLayout>
    );
}
