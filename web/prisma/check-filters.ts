
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Check distinct categories
    console.log("--- Categories in DB ---");
    const categories = await prisma.donationRecord.groupBy({
        by: ['category'],
    });
    console.log(categories.map((c: any) => c.category));

    // 2. Check all events
    console.log("\n--- Events in DB ---");
    const events = await prisma.event.findMany({
        select: { id: true, title: true, date: true }
    });
    console.log(events);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
