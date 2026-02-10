
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    console.log(`--- Verification for ${now.toISOString()} ---`);
    console.log(`First day of month: ${firstDayOfMonth.toISOString()}`);

    // 1. Total Donations
    const allDonations = await prisma.donationRecord.aggregate({
        _sum: { amount: true }
    });
    console.log(`Total Donations: ${allDonations._sum.amount || 0}`);

    // 2. This Month Donations
    const monthDonations = await prisma.donationRecord.aggregate({
        where: {
            date: { gte: firstDayOfMonth }
        },
        _sum: { amount: true }
    });
    console.log(`Donations This Month: ${monthDonations._sum.amount || 0}`);

    // 3. Devotees
    const totalUsers = await prisma.user.count();
    console.log(`Total Devotees (Users): ${totalUsers}`);

    const newUsersCount = await prisma.user.count({
        where: {
            createdAt: { gte: firstDayOfMonth }
        }
    });
    console.log(`New Devotees (This Month): ${newUsersCount}`);

    // Check unique Donors
    const uniqueDonors = await prisma.donationRecord.groupBy({
        by: ['donorName'],
        _count: true
    });
    console.log(`Unique Donors in Donations: ${uniqueDonors.length}`);

    // 4. Upcoming Events
    const upcomingEventsCount = await prisma.event.count({
        where: {
            date: { gte: now }
        }
    });
    console.log(`Upcoming Events: ${upcomingEventsCount}`);

    // 5. Registrations
    const totalRegistrations = await prisma.eventRegistration.count();
    console.log(`Total Registrations: ${totalRegistrations}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
