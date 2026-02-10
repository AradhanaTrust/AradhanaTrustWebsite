
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const donationCount = await prisma.donation.count();
    const donationRecordCount = await prisma.donationRecord.count();
    const eventCount = await prisma.event.count();

    console.log(`Donations (Razorpay): ${donationCount}`);
    console.log(`DonationRecords (Admin): ${donationRecordCount}`);
    console.log(`Events: ${eventCount}`);

    const events = await prisma.event.findMany({ take: 3 });
    console.log("Sample Events:", events);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
