
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Checking DonationRecords...");

    // basic count
    const count = await prisma.donationRecord.count();
    console.log(`Total DonationRecords: ${count}`);

    // Test the exact query from the API
    try {
        const donations = await prisma.donationRecord.findMany({
            where: {}, // Simulate "all" filters
            include: {
                event: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: {
                date: 'desc',
            },
        });

        console.log(`Query returned ${donations.length} records.`);
        if (donations.length > 0) {
            console.log("First record sample:", JSON.stringify(donations[0], null, 2));
        }
    } catch (e) {
        console.error("Query failed:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
