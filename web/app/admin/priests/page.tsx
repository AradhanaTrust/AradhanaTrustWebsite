"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Loader2, Search, CheckCircle, XCircle, Clock, MapPin, BookOpen, Star, RefreshCw, Download } from "lucide-react";
import * as XLSX from 'xlsx';

type RegistrationStatus = "CANDIDATE" | "SELECTED" | "REJECTED";

interface PriestRegistration {
    id: string;
    fullName: string;
    phoneNumber: string;
    whatsappNumber: string | null;
    email: string | null;
    gothram: string | null;
    vedicTradition: string | null;
    experienceYears: number | null;
    currentTemple: string | null;
    specialization: string | null;
    address: string | null;
    status: RegistrationStatus;
    adminNotes: string | null;
    createdAt: string;
}

export default function PriestRegistrationsAdminPage() {
    const [registrations, setRegistrations] = useState<PriestRegistration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<RegistrationStatus>("CANDIDATE");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
    const [tempNotes, setTempNotes] = useState("");

    const fetchRegistrations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/priests");
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: RegistrationStatus) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/priests/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setRegistrations(prev =>
                    prev.map(reg => (reg.id === id ? { ...reg, status: newStatus } : reg))
                );
            }
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleSaveNotes = async (id: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/priests/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adminNotes: tempNotes }),
            });

            if (res.ok) {
                setRegistrations(prev =>
                    prev.map(reg => (reg.id === id ? { ...reg, adminNotes: tempNotes } : reg))
                );
                setEditingNotesId(null);
            }
        } catch (error) {
            console.error("Error saving notes", error);
            alert("Failed to save notes.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this registration?")) return;

        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/priests/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setRegistrations(prev => prev.filter(reg => reg.id !== id));
            }
        } catch (error) {
            console.error("Error deleting registration", error);
            alert("Failed to delete registration.");
            setUpdatingId(null);
        }
    };

    const exportToExcel = () => {
        const dataToExport = registrations.map(reg => ({
            'Submission Date': new Date(reg.createdAt).toLocaleDateString('en-IN'),
            'Full Name': reg.fullName,
            'Phone': reg.phoneNumber,
            'WhatsApp': reg.whatsappNumber || '-',
            'Email': reg.email || '-',
            'Gothram': reg.gothram || '-',
            'Vedic Tradition': reg.vedicTradition || '-',
            'Experience (Years)': reg.experienceYears ?? '-',
            'Current Temple': reg.currentTemple || '-',
            'Specialization': reg.specialization || '-',
            'Address': reg.address || '-',
            'Status': reg.status,
            'Admin Notes': reg.adminNotes || '-',
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Purohit Registrations');
        XLSX.writeFile(workbook, `Aradhana_Trust_Purohit_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
    };


    const filteredRegistrations = registrations.filter(reg => {
        const matchesTab = reg.status === activeTab;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            reg.fullName.toLowerCase().includes(searchLower) ||
            reg.phoneNumber.includes(searchLower) ||
            (reg.specialization && reg.specialization.toLowerCase().includes(searchLower)) ||
            (reg.vedicTradition && reg.vedicTradition.toLowerCase().includes(searchLower));

        return matchesTab && matchesSearch;
    });

    const getTabCount = (status: RegistrationStatus) => {
        return registrations.filter(r => r.status === status).length;
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                        />
                    </div>

                    <button
                        onClick={fetchRegistrations}
                        className="flex items-center gap-2 px-4 py-2 text-primary-dark bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-colors font-medium text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl hover:bg-secondary-dark transition-colors font-medium text-sm shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export to Excel
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 border-b border-gray-200">
                    {(["CANDIDATE", "SELECTED", "REJECTED"] as RegistrationStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === status
                                ? "border-secondary text-secondary-dark"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {status === "CANDIDATE" && <Clock className="w-4 h-4" />}
                            {status === "SELECTED" && <CheckCircle className="w-4 h-4" />}
                            {status === "REJECTED" && <XCircle className="w-4 h-4" />}
                            {status === "CANDIDATE" ? "Candidates" : status.charAt(0) + status.slice(1).toLowerCase()}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === status ? "bg-secondary/10 text-secondary-dark" : "bg-gray-100 text-gray-500"
                                }`}>
                                {getTabCount(status)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No {activeTab === "CANDIDATE" ? "candidates" : activeTab.toLowerCase()} found</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {searchTerm ? "Try adjusting your search terms." : `There are no registrations currently marked as ${activeTab}.`}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredRegistrations.map((reg) => (
                            <div key={reg.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-cinzel font-bold text-primary-dark">{reg.fullName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <span>Submitted: {new Date(reg.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {activeTab === "CANDIDATE" && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, "SELECTED")}
                                                        disabled={updatingId === reg.id}
                                                        className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors tooltip"
                                                        title="Select / Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, "REJECTED")}
                                                        disabled={updatingId === reg.id}
                                                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            {activeTab === "REJECTED" && (
                                                <button
                                                    onClick={() => handleDelete(reg.id)}
                                                    disabled={updatingId === reg.id}
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            {activeTab === "SELECTED" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(reg.id, "CANDIDATE")}
                                                    disabled={updatingId === reg.id}
                                                    className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    Unselect
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 py-4 border-y border-gray-100">
                                        <div className="space-y-3">
                                            <div className="text-sm">
                                                <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">Phone</span>
                                                <span className="font-medium text-gray-900">{reg.phoneNumber}</span>
                                            </div>
                                            {reg.email && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">Email</span>
                                                    <span className="font-medium text-gray-900">{reg.email}</span>
                                                </div>
                                            )}
                                            {reg.vedicTradition && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">Tradition</span>
                                                    <span className="font-medium text-gray-900">{reg.vedicTradition}</span>
                                                </div>
                                            )}
                                            {reg.gothram && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">Gothram</span>
                                                    <span className="font-medium text-gray-900">{reg.gothram}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {reg.specialization && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                                                        <Star className="w-3 h-3" /> Specialization
                                                    </span>
                                                    <span className="font-medium text-gray-900">{reg.specialization}</span>
                                                </div>
                                            )}
                                            {reg.experienceYears !== null && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider">Experience</span>
                                                    <span className="font-medium text-gray-900">{reg.experienceYears} Years</span>
                                                </div>
                                            )}
                                            {reg.currentTemple && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500 block text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> Current Temple
                                                    </span>
                                                    <span className="font-medium text-gray-900">{reg.currentTemple}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Admin Notes Section */}
                                    <div className="pt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Notes</h4>
                                            {editingNotesId !== reg.id && (
                                                <button
                                                    onClick={() => {
                                                        setEditingNotesId(reg.id);
                                                        setTempNotes(reg.adminNotes || "");
                                                    }}
                                                    className="text-xs font-medium text-secondary hover:text-secondary-dark"
                                                >
                                                    {reg.adminNotes ? 'Edit' : 'Add Note'}
                                                </button>
                                            )}
                                        </div>

                                        {editingNotesId === reg.id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    className="w-full px-3 py-2 text-sm border border-secondary/30 rounded-lg focus:ring-1 focus:ring-secondary focus:border-secondary bg-surface-white"
                                                    rows={3}
                                                    value={tempNotes}
                                                    onChange={(e) => setTempNotes(e.target.value)}
                                                    placeholder="Add internal notes about this candidate..."
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingNotesId(null)}
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveNotes(reg.id)}
                                                        disabled={updatingId === reg.id}
                                                        className="px-3 py-1.5 text-xs font-medium bg-secondary text-white rounded-md hover:bg-secondary-dark"
                                                    >
                                                        {updatingId === reg.id ? 'Saving...' : 'Save Note'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className={`text-sm ${reg.adminNotes ? 'text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100' : 'text-gray-400 italic'}`}>
                                                {reg.adminNotes || "No notes added yet."}
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
