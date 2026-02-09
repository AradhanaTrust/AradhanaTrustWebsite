const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.donationRecord.updateMany({
        where: {
            referredBy: null,
        },
        data: {
            referredBy: 'None',
        },
    });
    console.log(`Updated ${result.count} records.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
