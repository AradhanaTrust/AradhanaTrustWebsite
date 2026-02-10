
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- User Analysis ---");
    const totalUsers = await prisma.user.count();
    console.log(`Total Users in DB: ${totalUsers}`);

    const allUsers = await prisma.user.findMany({
        select: { id: true, name: true, createdAt: true }
    });
    console.log("All Users:", allUsers);

    console.log("\n--- Event Registration Analysis ---");
    const totalRegistrations = await prisma.eventRegistration.count();
    console.log(`Total Registrations in DB: ${totalRegistrations}`);

    const allRegistrations = await prisma.eventRegistration.findMany();
    console.log("All Registrations:", allRegistrations);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
