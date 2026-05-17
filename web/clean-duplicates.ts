import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up EventRegistration duplicates...");
    const registrations = await prisma.eventRegistration.findMany({
        where: { razorpayOrderId: { not: null } },
        orderBy: { createdAt: 'asc' } // Keep the first one created
    });
    
    const seenReg = new Map();
    for (const reg of registrations) {
        if (!reg.razorpayOrderId) continue;
        if (seenReg.has(reg.razorpayOrderId)) {
            console.log(`Deleting duplicate EventRegistration: ${reg.id} (Order: ${reg.razorpayOrderId})`);
            await prisma.eventRegistration.delete({ where: { id: reg.id } });
        } else {
            seenReg.set(reg.razorpayOrderId, true);
        }
    }

    console.log("Cleaning up DonationRecord duplicates...");
    const donations = await prisma.donationRecord.findMany({
        where: { razorpayOrderId: { not: null } },
        orderBy: { createdAt: 'asc' } // Keep the first one created
    });
    
    const seenDon = new Map();
    for (const don of donations) {
        if (!don.razorpayOrderId) continue;
        if (seenDon.has(don.razorpayOrderId)) {
            console.log(`Deleting duplicate DonationRecord: ${don.id} (Order: ${don.razorpayOrderId})`);
            await prisma.donationRecord.delete({ where: { id: don.id } });
        } else {
            seenDon.set(don.razorpayOrderId, true);
        }
    }

    console.log("Cleanup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
