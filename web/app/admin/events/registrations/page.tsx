"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/admin/DashboardLayout";
import {
    Search,
    Filter,
    Download,
    Calendar,
    Users,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    Clock,
    SearchX,
    Loader2,
    ChevronDown,
    IndianRupee,
    Briefcase,
    Phone
} from "lucide-react";
import * as XLSX from 'xlsx';

interface registration {
    id: string;
    registrationNo: string | null;
    eventId: string | null;
    eventTitle: string;
    name: string;
    email: string;
    phone: string | null;
    attendees: number;
    totalAmount: number;
    registrationFee: number;
    donationAmount: number;
    status: string;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    address: string | null;
    organisation: string | null;
    referredBy: string | null;
    createdAt: string;
    event?: {
        title: string;
        date: string;
    }
}

export default function RegistrationsPage() {
    const searchParams = useSearchParams();
    const [registrations, setRegistrations] = useState<registration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState<{ id: string, title: string }[]>([]);

    // Filters
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState(searchParams.get('eventId') || "all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });

    // Fetch Events for filter dropdown
    useEffect(() => {
        const fetchEventsList = async () => {
            try {
                const res = await fetch("/api/admin/events");
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.map((e: any) => ({ id: e.id, title: e.title })));
                }
            } catch (error) {
                console.error("Failed to fetch events list", error);
            }
        };
        fetchEventsList();
    }, []);

    const fetchRegistrations = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (eventFilter !== "all") params.append('eventId', eventFilter);
            if (statusFilter !== "all") params.append('status', statusFilter);
            if (dateRange.start) params.append('startDate', dateRange.start);
            if (dateRange.end) params.append('endDate', dateRange.end);
            if (search) params.append('search', search);

            const res = await fetch(`/api/admin/events/registrations?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setIsLoading(false);
        }
    }, [eventFilter, statusFilter, dateRange, search]);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/events/registrations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });

            if (res.ok) {
                setRegistrations(prev => prev.map(reg => reg.id === id ? { ...reg, status: newStatus } : reg));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const exportToExcel = () => {
        const dataToExport = registrations.map(reg => ({
            'Reg Number': reg.registrationNo || '-',
            'Registration Date': new Date(reg.createdAt).toLocaleDateString('en-IN'),
            'Event': reg.eventTitle + (reg.eventId ? "" : " (Deleted Event)"),
            'Attendee Name': reg.name,
            'Email': reg.email,
            'Phone': reg.phone || '-',
            'Attendees': reg.attendees,
            'Registration Fee': reg.registrationFee,
            'Donation Amount': reg.donationAmount,
            'Total Paid': reg.totalAmount,
            'Payment Status': reg.status,
            'Organisation': reg.organisation || '-',
            'Referred By': reg.referredBy || '-',
            'Razorpay Order ID': reg.razorpayOrderId || 'FREE',
            'Razorpay Payment ID': reg.razorpayPaymentId || '-'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
        XLSX.writeFile(workbook, `Aradhana_Trust_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'registered': return "bg-green-100 text-green-700 border-green-200";
            case 'confirmed': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'cancelled': return "bg-red-100 text-red-700 border-red-200";
            case 'attended': return "bg-purple-100 text-purple-700 border-purple-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                            Registration Management
                        </h2>
                        <p className="text-primary/60 mt-1">
                            Track and manage attendees for all trust events
                        </p>
                    </div>
                    <button
                        onClick={exportToExcel}
                        className="bg-secondary text-surface-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition-all flex items-center justify-center gap-2 font-semibold shadow-md active:scale-95"
                    >
                        <Download size={20} /> Export to Excel
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-primary/60 uppercase tracking-wider">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <input
                                    type="text"
                                    placeholder="Name, Email, Phone..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background-cream/50 border-2 border-secondary/20 rounded-lg focus:border-secondary transition-all outline-none text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Event Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-primary/60 uppercase tracking-wider">Filter by Event</label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <select
                                    value={eventFilter}
                                    onChange={(e) => setEventFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background-cream/50 border-2 border-secondary/20 rounded-lg focus:border-secondary transition-all outline-none text-sm font-medium appearance-none"
                                >
                                    <option value="all">All Events</option>
                                    {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-primary/60 uppercase tracking-wider">Status</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background-cream/50 border-2 border-secondary/20 rounded-lg focus:border-secondary transition-all outline-none text-sm font-medium appearance-none"
                                >
                                    <option value="all">Any Status</option>
                                    <option value="registered">Registered</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="attended">Attended</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {/* Export/Reset */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setEventFilter("all");
                                    setStatusFilter("all");
                                    setDateRange({ start: "", end: "" });
                                }}
                                className="w-full py-2 border-2 border-secondary/20 text-secondary-dark font-semibold rounded-lg hover:bg-secondary/5 transition-all text-sm"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-background-cream/50 border-b-2 border-secondary/20">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Reg No</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Attendee & Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Event Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Payment Breakdown</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-primary-dark uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-primary-dark uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary/10">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="animate-spin text-secondary" size={40} />
                                                <p className="text-primary/60 font-medium">Fetching registrations...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <SearchX className="text-primary/20" size={60} />
                                                <p className="text-primary/60 font-cinzel-decorative text-lg">No registrations found</p>
                                                <p className="text-xs text-primary/40">Try adjusting your filters or search terms</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-secondary/2 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-primary-dark">{new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</div>
                                                <div className="text-[10px] text-primary/40">{new Date(reg.createdAt).getFullYear()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs font-mono font-bold text-secondary-dark bg-secondary/10 px-2 py-1 rounded">
                                                    {reg.registrationNo || "LEGACY"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-primary-dark group-hover:text-secondary-dark transition-colors">{reg.name}</div>
                                                <div className="flex items-center gap-1 text-[11px] text-primary/60 mt-1">
                                                    <Briefcase size={12} className="text-secondary/60" /> {reg.organisation || "Individual"}
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] text-primary/40 mt-1">
                                                    <span className="flex items-center gap-1"><Phone size={10} /> {reg.phone || "No Phone"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-primary-dark truncate max-w-[180px]">
                                                    {reg.eventTitle}
                                                </div>
                                                {!reg.eventId && (
                                                    <span className="text-[10px] bg-red-50 text-red-600 px-1 border border-red-100 rounded">Deleted Event</span>
                                                )}
                                                <div className="text-[11px] text-primary/50 mt-1">Ref: {reg.referredBy || "-"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-[11px] text-primary/60">
                                                        <span>Fee:</span>
                                                        <span className="font-bold">₹{reg.registrationFee}</span>
                                                    </div>
                                                    {reg.donationAmount > 0 && (
                                                        <div className="flex items-center justify-between text-[11px] text-secondary-dark bg-secondary/5 px-1 rounded">
                                                            <span>Donation:</span>
                                                            <span className="font-bold">₹{reg.donationAmount}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between text-xs font-black text-primary-dark pt-1 border-t border-secondary/10">
                                                        <span>Total:</span>
                                                        <span>₹{reg.totalAmount}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm ${getStatusStyle(reg.status)}`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    {reg.status !== 'confirmed' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(reg.id, 'confirmed')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                            title="Confirm"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    )}
                                                    {reg.status !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleUpdateStatus(reg.id, 'cancelled')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
