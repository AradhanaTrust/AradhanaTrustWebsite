"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { 
    Loader2, 
    Search, 
    CheckCircle, 
    XCircle, 
    Clock, 
    User, 
    Phone, 
    Mail, 
    Calendar, 
    Info, 
    Edit, 
    Trash2,
    RefreshCw,
    Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type RequestStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

interface ServiceRequest {
    id: string;
    fullName: string;
    email: string | null;
    phoneNumber: string;
    ritualType: string;
    preferredDate: string | null;
    additionalInfo: string | null;
    status: RequestStatus;
    adminNotes: string | null;
    priestId: string | null;
    priest?: {
        fullName: string;
        phoneNumber: string;
    };
    createdAt: string;
}

export default function ServiceRequestsAdminPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState<RequestStatus>("PENDING");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
    const [tempNotes, setTempNotes] = useState("");

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/services");
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: RequestStatus) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/services`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                setRequests(prev =>
                    prev.map(req => (req.id === id ? { ...req, status: newStatus } : req))
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
            const res = await fetch(`/api/admin/services`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, adminNotes: tempNotes }),
            });

            if (res.ok) {
                setRequests(prev =>
                    prev.map(req => (req.id === id ? { ...req, adminNotes: tempNotes } : req))
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
        if (!confirm("Are you sure you want to delete this request?")) return;

        setUpdatingId(id);
        try {
            const res = await fetch(`/api/admin/services?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setRequests(prev => prev.filter(req => req.id !== id));
            }
        } catch (error) {
            console.error("Error deleting request", error);
            alert("Failed to delete request.");
            setUpdatingId(null);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesTab = req.status === activeTab;
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            req.fullName.toLowerCase().includes(searchLower) ||
            req.phoneNumber.includes(searchLower) ||
            req.ritualType.toLowerCase().includes(searchLower);

        return matchesTab && matchesSearch;
    });

    const getTabCount = (status: RequestStatus) => {
        return requests.filter(r => r.status === status).length;
    };

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case "PENDING": return "text-amber-600 bg-amber-50 border-amber-200";
            case "CONFIRMED": return "text-blue-600 bg-blue-50 border-blue-200";
            case "COMPLETED": return "text-green-600 bg-green-50 border-green-200";
            case "CANCELLED": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or ritual..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                        />
                    </div>

                    <button
                        onClick={fetchRequests}
                        className="flex items-center gap-2 px-4 py-2 text-primary-dark bg-secondary/10 hover:bg-secondary/20 rounded-xl transition-colors font-medium text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh List
                    </button>
                </div>

                {/* Status Tabs */}
                <div className="flex overflow-x-auto space-x-2 border-b border-gray-200 pb-px">
                    {(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as RequestStatus[]).map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status)}
                            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === status
                                ? "border-secondary text-secondary-dark"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {status === "PENDING" && <Clock className="w-4 h-4" />}
                            {status === "CONFIRMED" && <CheckCircle className="w-4 h-4" />}
                            {status === "COMPLETED" && <Check className="w-4 h-4" />}
                            {status === "CANCELLED" && <XCircle className="w-4 h-4" />}
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === status ? "bg-secondary/10 text-secondary-dark" : "bg-gray-100 text-gray-500"}`}>
                                {getTabCount(status)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Requests List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No {activeTab.toLowerCase()} requests</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {searchTerm ? "No results match your search." : "Everything is caught up!"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredRequests.map((req) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={req.id}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                                >
                                    <div className="p-5 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-cinzel font-bold text-primary-dark">{req.fullName}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </div>
                                        </div>

                                        <div className="bg-secondary/5 rounded-xl p-4 mb-4 border border-secondary/10">
                                            <div className="text-sm font-bold text-secondary-dark mb-1 flex items-center gap-2">
                                                <Info className="w-4 h-4" /> Ritual Type
                                            </div>
                                            <div className="text-primary-dark font-medium">{req.ritualType}</div>
                                            
                                            {req.preferredDate && (
                                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 text-secondary" />
                                                    <span className="font-medium">Preferred Date:</span>
                                                    <span>{new Date(req.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-sm text-gray-700">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <span>{req.phoneNumber}</span>
                                            </div>
                                            {req.email && (
                                                <div className="flex items-center gap-3 text-sm text-gray-700">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                        <Mail className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <span className="truncate">{req.email}</span>
                                                </div>
                                            )}
                                            {req.additionalInfo && (
                                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-dotted border-gray-200 italic">
                                                    "{req.additionalInfo}"
                                                </div>
                                            )}
                                        </div>

                                        {/* Admin Notes */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Internal Notes</label>
                                                {editingNotesId !== req.id && (
                                                    <button 
                                                        onClick={() => {
                                                            setEditingNotesId(req.id);
                                                            setTempNotes(req.adminNotes || "");
                                                        }}
                                                        className="text-[10px] font-bold text-secondary hover:underline"
                                                    >
                                                        {req.adminNotes ? "EDIT" : "ADD NOTE"}
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {editingNotesId === req.id ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        autoFocus
                                                        className="w-full p-2 text-xs border border-secondary/30 rounded-lg focus:ring-1 focus:ring-secondary focus:outline-none"
                                                        rows={2}
                                                        value={tempNotes}
                                                        onChange={(e) => setTempNotes(e.target.value)}
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => setEditingNotesId(null)}
                                                            className="text-[10px] text-gray-500 font-bold"
                                                        >
                                                            CANCEL
                                                        </button>
                                                        <button 
                                                            onClick={() => handleSaveNotes(req.id)}
                                                            className="text-[10px] bg-secondary text-white px-2 py-1 rounded font-bold"
                                                        >
                                                            SAVE
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-[13px] text-gray-700">
                                                    {req.adminNotes || <span className="text-gray-400 italic">No notes added.</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="bg-gray-50 border-t border-gray-100 p-3 flex gap-2">
                                        {activeTab === "PENDING" && (
                                            <button
                                                onClick={() => handleStatusUpdate(req.id, "CONFIRMED")}
                                                disabled={updatingId === req.id}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" /> Confirm
                                            </button>
                                        )}
                                        {activeTab === "CONFIRMED" && (
                                            <button
                                                onClick={() => handleStatusUpdate(req.id, "COMPLETED")}
                                                disabled={updatingId === req.id}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Mark Completed
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleStatusUpdate(req.id, activeTab === "CANCELLED" ? "PENDING" : "CANCELLED")}
                                            disabled={updatingId === req.id}
                                            className={`px-3 py-2 rounded-lg border text-xs font-bold transition-colors ${
                                                activeTab === "CANCELLED" 
                                                ? "border-gray-300 text-gray-600 hover:bg-gray-100" 
                                                : "border-red-200 text-red-600 hover:bg-red-50"
                                            }`}
                                        >
                                            {activeTab === "CANCELLED" ? "Restore" : "Cancel"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(req.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
