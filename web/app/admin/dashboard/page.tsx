"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import AddDonationModal from "@/components/admin/AddDonationModal";
import {
    TrendingUp,
    Users as UsersIcon,
    Calendar,
    FileText,
    IndianRupee,
    Activity,
    Plus
} from "lucide-react";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const isPrimaryAdmin = session?.user?.role === "PRIMARY_ADMIN";

    // State for real data
    const [stats, setStats] = useState({
        totalCollection: "₹0",
        collectionThisMonth: "₹0",
        segregation: {
            general: 0,
            eventFees: 0,
            eventDonations: 0,
            eventTotal: 0
        },
        totalDonors: 0,
        newDonors: 0,
        upcomingEvents: 0,
        registrations: 0,
        recentDonations: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDonationModalOpen, setIsAddDonationModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/dashboard/stats");
                if (res.ok) {
                    const data = await res.json();

                    // Format currency
                    const formatCurrency = (amount: number) => {
                        return new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                        }).format(amount);
                    };

                    setStats({
                        totalCollection: formatCurrency(data.totalCollection),
                        collectionThisMonth: formatCurrency(data.collectionThisMonth),
                        segregation: data.segregation,
                        totalDonors: data.totalDonors,
                        newDonors: data.newDonors,
                        upcomingEvents: data.upcomingEvents,
                        registrations: data.registrations,
                        recentDonations: data.recentDonations.map((d: any) => ({
                            ...d,
                            amount: formatCurrency(d.amount),
                            date: new Date(d.date).toLocaleDateString('en-IN')
                        }))
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrencySmall = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };


    return (
        <DashboardLayout>
            {isPrimaryAdmin ? (
                /* PRIMARY ADMIN DASHBOARD */
                <div className="space-y-6">
                    {/* Welcome Message */}
                    <div className="bg-gradient-to-r from-secondary/10 to-secondary-light/10 border-l-4 border-secondary p-6 rounded-lg">
                        <h2 className="text-xl font-cinzel-decorative font-bold text-primary-dark">
                            Welcome, {session?.user?.name}
                        </h2>
                        <p className="text-primary/70 mt-1">
                            Here's a detailed overview of Aradhana Dharmika Trust's collections and registrations
                        </p>
                    </div>



                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Total Collections */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 md:p-3 bg-secondary/10 rounded-lg">
                                    <IndianRupee className="w-5 h-5 md:w-6 md:h-6 text-secondary-dark" />
                                </div>
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Collections</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-primary-dark">
                                {isLoading ? "..." : stats.collectionThisMonth}
                            </h3>
                            <p className="text-xs md:text-sm text-primary/60 mt-1">This Month</p>

                            <div className="mt-4 pt-4 border-t border-secondary/10 space-y-1">
                                <p className="text-[10px] md:text-xs text-primary/40 flex justify-between">
                                    <span>Total:</span>
                                    <span className="font-bold text-primary-dark">{stats.totalCollection}</span>
                                </p>
                                <p className="text-[10px] text-secondary-dark flex justify-between">
                                    <span>General:</span>
                                    <span>{formatCurrencySmall(stats.segregation.general)}</span>
                                </p>
                            </div>
                        </div>

                        {/* Total Donors */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 md:p-3 bg-accent-saffron/10 rounded-lg">
                                    <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-accent-saffron" />
                                </div>
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Donors</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-primary-dark">
                                {isLoading ? "..." : stats.totalDonors}
                            </h3>
                            <p className="text-xs md:text-sm text-primary/60 mt-1">Total Donors</p>
                            <p className="text-[10px] md:text-xs text-primary/40 mt-2">
                                {stats.newDonors} active
                            </p>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 md:p-3 bg-primary/10 rounded-lg">
                                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary-dark" />
                                </div>
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Upcoming</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-primary-dark">
                                {isLoading ? "..." : stats.upcomingEvents}
                            </h3>
                            <p className="text-xs md:text-sm text-primary/60 mt-1">Events</p>
                            <p className="text-[10px] md:text-xs text-primary/40 mt-2">Next 30 days</p>
                        </div>

                        {/* Registrations & Event Income */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2 md:p-3 bg-secondary-light/10 rounded-lg">
                                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-secondary-light" />
                                </div>
                                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Regs</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-primary-dark">
                                {isLoading ? "..." : stats.registrations}
                            </h3>
                            <p className="text-xs md:text-sm text-primary/60 mt-1">Attendees</p>

                            <div className="mt-4 pt-4 border-t border-secondary/10 space-y-1">
                                <p className="text-[10px] text-primary/60 flex justify-between">
                                    <span>Fees:</span>
                                    <span>{formatCurrencySmall(stats.segregation.eventFees)}</span>
                                </p>
                                <div className="pt-1 flex justify-between text-[10px] font-bold text-secondary-dark font-mono">
                                    <span>Total: {formatCurrencySmall(stats.segregation.eventTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Donations Table */}
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base md:text-lg font-cinzel-decorative font-bold text-primary-dark">
                                Recent Donations
                            </h3>
                            <Link href="/admin/donations" className="text-xs md:text-sm text-secondary-dark hover:text-secondary font-semibold">
                                View All →
                            </Link>
                        </div>
                        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                            <table className="w-full min-w-[500px]">
                                <thead>
                                    <tr className="border-b-2 border-secondary/20">
                                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-primary-dark">Donor</th>
                                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-primary-dark">Amount</th>
                                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-primary-dark">Category</th>
                                        <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-primary-dark">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentDonations.map((donation) => (
                                        <tr key={donation.id} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors">
                                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm text-primary-dark truncate max-w-[120px]">{donation.donor}</td>
                                            <td className="py-3 px-2 md:px-4 text-xs md:text-sm font-semibold text-secondary-dark">{donation.amount}</td>
                                            <td className="py-3 px-2 md:px-4">
                                                <span className="text-[10px] md:text-xs px-2 py-0.5 bg-secondary/10 text-secondary-dark rounded-full whitespace-nowrap">
                                                    {donation.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-2 md:px-4 text-[10px] md:text-sm text-primary/60 whitespace-nowrap">{donation.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[500px] md:max-w-none mx-auto md:mx-0 w-full">
                        <button
                            onClick={() => setIsAddDonationModalOpen(true)}
                            className="p-3 md:p-4 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-all text-[11px] md:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm border-b-4 border-secondary-dark active:border-b-0 active:translate-y-[2px]"
                        >
                            <Plus className="w-4 h-4" />
                            Donation
                        </button>
                        <Link href="/admin/events" className="p-3 md:p-4 bg-secondary/10 text-secondary-dark border-2 border-secondary/30 rounded-lg hover:bg-secondary/20 transition-all text-[11px] md:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm active:translate-y-[2px]">
                            <Plus className="w-4 h-4" />
                            Events
                        </Link>
                        <Link href="/admin/donations" className="p-3 md:p-4 bg-primary/10 text-primary-dark border-2 border-primary/30 rounded-lg hover:bg-primary/20 transition-all text-[11px] md:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm active:translate-y-[2px]">
                            📊 Reports
                        </Link>
                        <Link href="/admin/users" className="p-3 md:p-4 bg-accent-saffron/10 text-accent-saffron border-2 border-accent-saffron/30 rounded-lg hover:bg-accent-saffron/20 transition-all text-[11px] md:text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm active:translate-y-[2px]">
                            👥 Users
                        </Link>
                    </div>
                    <AddDonationModal
                        isOpen={isAddDonationModalOpen}
                        onClose={() => setIsAddDonationModalOpen(false)}
                        onSuccess={() => window.location.reload()}
                    />
                </div>
            ) : (
                /* SECONDARY ADMIN DASHBOARD */
                <div className="space-y-6">
                    {/* Welcome Message */}
                    <div className="bg-gradient-to-r from-accent-saffron/10 to-accent-saffron/5 border-l-4 border-accent-saffron p-6 rounded-lg">
                        <h2 className="text-xl font-cinzel-decorative font-bold text-primary-dark">
                            Welcome, {session?.user?.name}
                        </h2>
                        <p className="text-primary/70 mt-1">
                            Event Coordinator Dashboard
                        </p>
                    </div>

                    {/* KPI Cards (Limited for Secondary Admin) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Upcoming Events */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Calendar className="w-6 h-6 text-primary-dark" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.upcomingEvents}</h3>
                            <p className="text-sm text-primary/60 mt-1">Upcoming Events</p>
                            <a href="/admin/events" className="text-xs text-secondary-dark hover:text-secondary mt-2 inline-block">
                                Manage Events →
                            </a>
                        </div>

                        {/* Event Registrations */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-secondary-light/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-secondary-light" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.registrations}</h3>
                            <p className="text-sm text-primary/60 mt-1">Total Registrations</p>
                            <p className="text-xs text-primary/40 mt-2">Across all events</p>
                        </div>

                        {/* Recent Donations (View Only) */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-secondary/10 rounded-lg">
                                    <Activity className="w-6 h-6 text-secondary-dark" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.collectionThisMonth}</h3>
                            <p className="text-sm text-primary/60 mt-1">Recent Donations</p>
                            <p className="text-xs text-primary/40 mt-2">View only access</p>
                        </div>
                    </div>

                    {/* Event Management Section */}
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6">
                        <h3 className="text-lg font-cinzel-decorative font-bold text-primary-dark mb-4">
                            Event Management
                        </h3>
                        <p className="text-primary/60 mb-4">
                            Manage upcoming events, view registrations, and update event details.
                        </p>
                        <button className="px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-all font-semibold">
                            Manage Events
                        </button>
                    </div>

                    {/* Donation Overview (View Only) */}
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-cinzel-decorative font-bold text-primary-dark">
                                Recent Donations (View Only)
                            </h3>
                            <span className="text-xs px-2 py-1 bg-primary/10 text-primary-dark rounded-full">
                                Read-Only Access
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-secondary/20">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary-dark">Donor</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary-dark">Amount</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary-dark">Category</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-primary-dark">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentDonations.slice(0, 3).map((donation) => (
                                        <tr key={donation.id} className="border-b border-secondary/10">
                                            <td className="py-3 px-4 text-sm text-primary-dark">{donation.donor}</td>
                                            <td className="py-3 px-4 text-sm font-semibold text-secondary-dark">{donation.amount}</td>
                                            <td className="py-3 px-4">
                                                <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary-dark rounded-full">
                                                    {donation.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-primary/60">{donation.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
