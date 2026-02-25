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

        // 1. Calculate General Donations (DonationRecord with registrationId: null)
        const generalDonations = await prisma.donationRecord.aggregate({
            where: { registrationId: null },
            _sum: { amount: true }
        });

        // 2. Calculate Event-related Collections
        // - Event Fees (sum of registrationFee from EventRegistration)
        const eventFees = await prisma.eventRegistration.aggregate({
            _sum: { registrationFee: true }
        });
        // - Event Donations (sum of donationAmount from EventRegistration, which also exist as DonationRecord with registrationId)
        const eventDonations = await prisma.eventRegistration.aggregate({
            _sum: { donationAmount: true }
        });

        const totalGeneralAmount = generalDonations?._sum?.amount || 0;
        const totalEventFees = eventFees?._sum?.registrationFee || 0;
        const totalEventDonations = eventDonations?._sum?.donationAmount || 0;
        const totalCollection = totalGeneralAmount + totalEventFees + totalEventDonations;

        // 3. Monthly Calculations
        const monthGeneralDonations = await prisma.donationRecord.aggregate({
            where: {
                registrationId: null,
                date: { gte: firstDayOfMonth }
            },
            _sum: { amount: true }
        });
        const monthEventRegistrations = await prisma.eventRegistration.aggregate({
            where: { createdAt: { gte: firstDayOfMonth } },
            _sum: {
                registrationFee: true,
                donationAmount: true
            }
        });
        const monthTotal = (monthGeneralDonations?._sum?.amount || 0) + (monthEventRegistrations?._sum?.registrationFee || 0) + (monthEventRegistrations?._sum?.donationAmount || 0);

        // 4. Total Donors (Unique Donor Names from DonationRecord)
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

        // 5. Upcoming Events
        const upcomingEventsCount = await prisma.event.count({
            where: {
                date: { gte: now }
            }
        });

        // 6. Registrations (Total)
        const totalRegistrations = await prisma.eventRegistration.count();

        // 7. Recent 5 Donations
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
            totalCollection: totalCollection,
            collectionThisMonth: monthTotal,
            segregation: {
                general: totalGeneralAmount,
                eventFees: totalEventFees,
                eventDonations: totalEventDonations,
                eventTotal: totalEventFees + totalEventDonations
            },
            totalDonors: totalDonorsCount,
            newDonors: newDonorsThisMonth,
            upcomingEvents: upcomingEventsCount,
            registrations: totalRegistrations,
            recentDonations: recentDonations.map((d: any) => ({
                id: d.id,
                donor: d.donorName,
                amount: d.amount,
                category: d.category,
                date: d.date
            }))
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("[DASHBOARD_STATS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
