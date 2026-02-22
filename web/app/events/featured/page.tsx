import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FeaturedEventClient from "./FeaturedEventClient";

async function getFeaturedEvent() {
    const featured = await prisma.event.findFirst({
        where: { isFeatured: true }
    });
    return featured;
}

export default async function FeaturedEventPage() {
    const event = await getFeaturedEvent();

    if (!event) {
        notFound();
    }

    return <FeaturedEventClient event={event as any} />;
}
