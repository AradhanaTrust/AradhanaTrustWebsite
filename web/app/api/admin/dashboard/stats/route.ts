import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Total Donations & This Month
        const allDonations = await prisma.donationRecord.aggregate({
            _sum: { amount: true }
        });

        const monthDonations = await prisma.donationRecord.aggregate({
            where: {
                date: { gte: firstDayOfMonth }
            },
            _sum: { amount: true }
        });

        // 2. Total Donors (Unique Donor Names)
        const uniqueDonors = await prisma.donationRecord.groupBy({
            by: ['donorName'],
        });
        const totalDonorsCount = uniqueDonors.length;

        const thisMonthDonations = await prisma.donationRecord.groupBy({
            by: ['donorName'],
            where: {
                date: { gte: firstDayOfMonth }
            }
        });
        const newDonorsThisMonth = thisMonthDonations.length;

        // 3. Upcoming Events
        const upcomingEventsCount = await prisma.event.count({
            where: {
                date: { gte: now }
            }
        });

        // 4. Registrations (Total)
        const totalRegistrations = await prisma.eventRegistration.count();

        // 5. Recent 5 Donations
        const recentDonations = await prisma.donationRecord.findMany({
            take: 5,
            orderBy: { date: 'desc' },
            select: {
                id: true,
                donorName: true,
                amount: true,
                category: true,
                date: true,
            }
        });

        const stats = {
            totalDonations: allDonations._sum.amount || 0,
            donationsThisMonth: monthDonations._sum.amount || 0,
            totalDonors: totalDonorsCount,
            newDonors: newDonorsThisMonth,
            upcomingEvents: upcomingEventsCount,
            registrations: totalRegistrations,
            recentDonations: recentDonations.map((d: any) => ({
                id: d.id,
                donor: d.donorName,
                amount: d.amount,
                category: d.category,
                date: d.date // return date object or string, frontend handles it
            }))
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("[DASHBOARD_STATS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
