
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Testing GroupBy Query...");
    try {
        const uniqueDonors = await prisma.donationRecord.groupBy({
            by: ['donorName'],
        });
        console.log("Unique Donors Result:", uniqueDonors);
        console.log("Count:", uniqueDonors.length);
    } catch (e) {
        console.error("GroupBy Error:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
