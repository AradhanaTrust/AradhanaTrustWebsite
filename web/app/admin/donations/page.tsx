"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Search, Filter, Download, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

export default function DonationsPage() {
    const [donations, setDonations] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [method, setMethod] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [eventId, setEventId] = useState("all");

    const categories = ["Annadanam", "Temple", "Education", "Cultural", "Gauseva", "General Fund"];
    const methods = ["UPI", "Credit/Debit Card", "Net Banking", "Cash", "Cheque"];

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            fetchDonations();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, category, method, startDate, endDate, eventId]);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/admin/events/list");
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        }
    }

    const fetchDonations = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (category !== "all") params.append("category", category);
            if (method !== "all") params.append("method", method);
            if (eventId !== "all") params.append("eventId", eventId);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const res = await fetch(`/api/admin/donations?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setDonations(data);
            }
        } catch (error) {
            console.error("Failed to fetch donations", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        // Prepare data for export
        const exportData = donations.map(d => ({
            "Receipt No": d.receiptNo,
            "Date": new Date(d.date).toLocaleDateString("en-IN"),
            "Donor Name": d.donorName,
            "Email": d.email,
            "Phone": d.phone,
            "Amount (₹)": d.amount,
            "Category": d.category,
            "Event": d.event?.title || "N/A",
            "Payment Method": d.method,
            "Status": d.status,
            "PAN": d.panNumber || "N/A"
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Auto-filter
        if (exportData.length > 0) {
            const range = XLSX.utils.decode_range(ws['!ref'] || "A1");
            ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
        }

        // Column widths
        ws['!cols'] = [
            { wch: 15 }, // Receipt
            { wch: 12 }, // Date
            { wch: 25 }, // Donor
            { wch: 25 }, // Email
            { wch: 15 }, // Phone
            { wch: 12 }, // Amount
            { wch: 20 }, // Category
            { wch: 25 }, // Event
            { wch: 15 }, // Method
            { wch: 12 }, // Status
            { wch: 15 }, // PAN
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Donations");

        // Generate filename
        const dateStr = new Date().toISOString().split('T')[0];
        const fileName = `Donations_Report_${dateStr}.xlsx`;

        // Save file
        XLSX.writeFile(wb, fileName);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                            Donations Management
                        </h2>
                        <p className="text-primary/60 mt-1">
                            Track and manage all trust donations
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={isLoading || donations.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        Export to Excel
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-surface-white p-3 rounded-xl border-2 border-secondary/20 shadow-sm space-y-3 md:space-y-0 md:flex md:items-center md:gap-2 flex-wrap text-sm">

                    {/* Search */}
                    <div className="relative w-full md:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary/60" />
                        <input
                            type="text"
                            placeholder="Name, Receipt No..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none text-sm"
                        />
                    </div>

                    {/* Event Filter */}
                    <div className="relative min-w-[140px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-secondary/60" />
                        <select
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
                            className="w-full pl-8 pr-6 py-1.5 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none appearance-none bg-white text-sm"
                        >
                            <option value="all">All Events</option>
                            {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div className="relative min-w-[140px]">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-1.5 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none bg-white text-sm"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Method Filter */}
                    <div className="relative min-w-[120px]">
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full px-3 py-1.5 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none bg-white text-sm"
                        >
                            <option value="all">All Methods</option>
                            {methods.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-1.5">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-40 px-3 py-1.5 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none text-sm"
                        />
                        <span className="text-primary/60 text-sm">to</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-40 px-3 py-1.5 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64">
                            <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
                            <p className="text-primary/60">Loading records...</p>
                        </div>
                    ) : donations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64 text-center">
                            <p className="text-primary/60 text-lg mb-2">No donations found</p>
                            <p className="text-sm text-primary/40">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/5 border-b-2 border-secondary/20">
                                    <tr>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Receipt No</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Date</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Donor</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Event</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Amount</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Category</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Method</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary/10">
                                    {donations.map((donation) => (
                                        <tr key={donation.id} className="hover:bg-secondary/5 transition-colors">
                                            <td className="p-4 font-mono text-sm text-primary/70">{donation.receiptNo}</td>
                                            <td className="p-4 text-sm text-primary/80">
                                                {new Date(donation.date).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric"
                                                })}
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-primary-dark">{donation.donorName}</div>
                                                <div className="text-xs text-primary/50">{donation.email}</div>
                                            </td>
                                            <td className="p-4 text-sm text-primary/80">
                                                {donation.event ? (
                                                    <span className="font-medium text-secondary-dark">{donation.event.title}</span>
                                                ) : (
                                                    <span className="text-primary/40">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-primary-dark">
                                                ₹{donation.amount.toLocaleString("en-IN")}
                                            </td>
                                            <td className="p-4 text-sm text-primary/80">
                                                <span className="px-2 py-1 bg-secondary/10 rounded-md text-secondary-dark text-xs font-semibold">
                                                    {donation.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-primary/70">{donation.method}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                    ${donation.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}`}>
                                                    {donation.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-primary/40">
                    Showing {donations.length} records based on current filters
                </div>
            </div>
        </DashboardLayout>
    );
}
