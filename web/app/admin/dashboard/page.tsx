"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import {
    TrendingUp,
    Users as UsersIcon,
    Calendar,
    FileText,
    IndianRupee,
    Activity
} from "lucide-react";

export default function AdminDashboard() {
    const { data: session } = useSession();
    const isPrimaryAdmin = session?.user?.role === "PRIMARY_ADMIN";

    // State for real data
    const [stats, setStats] = useState({
        totalDonations: "₹0",
        donationsThisMonth: "₹0",
        newDevotees: 0,
        upcomingEvents: 0,
        registrations: 0,
        recentDonations: [] as any[]
    });
    const [isLoading, setIsLoading] = useState(true);

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
                        totalDonations: formatCurrency(data.totalDonations),
                        donationsThisMonth: formatCurrency(data.donationsThisMonth),
                        newDevotees: data.newDevotees,
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
                            Here's an overview of Aradhana Dharmika Trust's activities
                        </p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Donations */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-secondary/10 rounded-lg">
                                    <IndianRupee className="w-6 h-6 text-secondary-dark" />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+12%</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.donationsThisMonth}</h3>
                            <p className="text-sm text-primary/60 mt-1">This Month</p>
                            <p className="text-xs text-primary/40 mt-2">Total: {stats.totalDonations}</p>
                        </div>

                        {/* New Devotees */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-accent-saffron/10 rounded-lg">
                                    <UsersIcon className="w-6 h-6 text-accent-saffron" />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+8%</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.newDevotees}</h3>
                            <p className="text-sm text-primary/60 mt-1">New Devotees</p>
                            <p className="text-xs text-primary/40 mt-2">This month</p>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <Calendar className="w-6 h-6 text-primary-dark" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.upcomingEvents}</h3>
                            <p className="text-sm text-primary/60 mt-1">Upcoming Events</p>
                            <p className="text-xs text-primary/40 mt-2">Next 30 days</p>
                        </div>

                        {/* Registrations */}
                        <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 hover:shadow-lg hover:border-secondary/40 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-secondary-light/10 rounded-lg">
                                    <FileText className="w-6 h-6 text-secondary-light" />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>+15%</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.registrations}</h3>
                            <p className="text-sm text-primary/60 mt-1">Event Registrations</p>
                            <p className="text-xs text-primary/40 mt-2">All time</p>
                        </div>
                    </div>

                    {/* Recent Donations Table */}
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-cinzel-decorative font-bold text-primary-dark">
                                Recent Donations
                            </h3>
                            <a href="/admin/donations" className="text-sm text-secondary-dark hover:text-secondary font-semibold">
                                View All →
                            </a>
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
                                    {stats.recentDonations.map((donation) => (
                                        <tr key={donation.id} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors">
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

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <button className="p-4 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-all font-semibold">
                            + Add Donation
                        </button>
                        <button className="p-4 bg-secondary/10 text-secondary-dark border-2 border-secondary/30 rounded-lg hover:bg-secondary/20 transition-all font-semibold">
                            + Create Event
                        </button>
                        <button className="p-4 bg-primary/10 text-primary-dark border-2 border-primary/30 rounded-lg hover:bg-primary/20 transition-all font-semibold">
                            📊 Generate Report
                        </button>
                        <button className="p-4 bg-accent-saffron/10 text-accent-saffron border-2 border-accent-saffron/30 rounded-lg hover:bg-accent-saffron/20 transition-all font-semibold">
                            👥 Manage Users
                        </button>
                    </div>
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
                            <h3 className="text-2xl font-bold text-primary-dark">{stats.donationsThisMonth}</h3>
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
