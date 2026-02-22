"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useSession } from "next-auth/react";
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    Upload,
    Loader2,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define Event Type matching Prisma Schema
interface Event {
    id: string;
    title: string;
    titleKn?: string;
    category: string;
    date: string; // ISO string
    time: string;
    location: string;
    locationKn?: string;
    description: string;
    descriptionKn?: string;
    imageUrl: string;
    videoUrl?: string; // NEW
    capacity?: number;
    price?: number;
    registrationOpen: boolean;
    isFeatured: boolean; // NEW
    createdAt: string;
    updatedAt: string;
    attendees?: number; // Derived or related
}

const CATEGORIES = [
    { value: "festival", label: "Festival" },
    { value: "discourse", label: "Discourse" },
    { value: "community", label: "Community Service" },
    { value: "cultural", label: "Cultural" },
    { value: "educational", label: "Educational" }
];

export default function EventsPage() {
    const { data: session } = useSession();
    const router = useRouter();

    // State
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        titleKn: "",
        category: "community",
        date: "",
        time: "",
        location: "",
        locationKn: "",
        description: "",
        descriptionKn: "",
        capacity: "",
        price: "0",
        registrationOpen: "true",
        isFeatured: "false", // NEW
        videoUrl: "", // NEW
        file: null as File | null
    });

    // Fetch Events
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/admin/events");
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (event: Event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            titleKn: event.titleKn || "",
            category: event.category,
            date: new Date(event.date).toISOString().split('T')[0],
            time: event.time,
            location: event.location,
            locationKn: event.locationKn || "",
            description: event.description,
            descriptionKn: event.descriptionKn || "",
            capacity: event.capacity?.toString() || "",
            price: (event as any).price?.toString() || "0",
            registrationOpen: event.registrationOpen ? "true" : "false",
            isFeatured: event.isFeatured ? "true" : "false", // NEW
            videoUrl: event.videoUrl || "", // NEW
            file: null
        });
        setShowAddModal(true);
    };

    const handleAddNewClick = () => {
        setSelectedEvent(null);
        setFormData({
            title: "",
            titleKn: "",
            category: "community",
            date: "",
            time: "",
            location: "",
            locationKn: "",
            description: "",
            descriptionKn: "",
            capacity: "",
            price: "0",
            registrationOpen: "true",
            isFeatured: "false", // NEW
            videoUrl: "", // NEW
            file: null
        });
        setShowAddModal(true);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Manual validation for file input (since it's hidden)
        if (!selectedEvent && !formData.file) {
            alert("Please select an event image.");
            return;
        }

        setIsSubmitting(true);

        const submitData = new FormData();
        submitData.append("title", formData.title);
        if (formData.titleKn) submitData.append("titleKn", formData.titleKn);
        submitData.append("category", formData.category);
        submitData.append("date", formData.date);
        submitData.append("time", formData.time);
        submitData.append("location", formData.location);
        if (formData.locationKn) submitData.append("locationKn", formData.locationKn);
        submitData.append("description", formData.description);
        if (formData.descriptionKn) submitData.append("descriptionKn", formData.descriptionKn);
        if (formData.capacity) submitData.append("capacity", formData.capacity);
        if (formData.price) submitData.append("price", formData.price);
        submitData.append("registrationOpen", formData.registrationOpen);
        submitData.append("isFeatured", formData.isFeatured); // NEW
        if (formData.videoUrl) submitData.append("videoUrl", formData.videoUrl); // NEW

        if (formData.file) {
            submitData.append("file", formData.file);
        }

        if (selectedEvent) {
            submitData.append("id", selectedEvent.id);
        }

        try {
            const method = selectedEvent ? "PUT" : "POST";
            const res = await fetch("/api/admin/events", {
                method,
                body: submitData
            });

            if (!res.ok) throw new Error("Failed to save event");

            await fetchEvents();
            setShowAddModal(false);
            router.refresh(); // Refresh server components if any
        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/events?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setEvents(events.filter(e => e.id !== id));
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete event");
        }
    }


    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of today

    // Compare normalized dates (ignoring time)
    const upcomingEvents = events.filter(e => new Date(e.date).setHours(0, 0, 0, 0) >= now.getTime());
    const pastEvents = events.filter(e => new Date(e.date).setHours(0, 0, 0, 0) < now.getTime());

    const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

    const getCategoryBadgeStyle = (category: string) => {
        const base = "backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase";

        const styles = {
            festival: "bg-[#FFF9F0]/90 border-[#FFB347]/30 text-[#D97706]", // Warm Orange/Gold for Festival
            discourse: "bg-[#F0FDFA]/90 border-[#5EEAD4]/30 text-[#0F766E]", // Teal for Discourse
            community: "bg-[#F0F9FF]/90 border-[#7DD3FC]/30 text-[#0369A1]", // Light Blue for Community
            cultural: "bg-[#FFF1F2]/90 border-[#FDA4AF]/30 text-[#BE123C]", // Rose/Pink for Cultural
            educational: "bg-[#FAF5FF]/90 border-[#D8B4FE]/30 text-[#7E22CE]", // Purple for Educational
        };

        return `${base} ${styles[category as keyof typeof styles] || "bg-gray-50/90 border-gray-200 text-gray-700"}`;
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                            Events Management
                        </h2>
                        <p className="text-primary/60 mt-1">
                            Manage upcoming and past events, registrations, and details
                        </p>
                    </div>
                    <button
                        onClick={handleAddNewClick}
                        className="px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors font-semibold flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Event
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary/60">Upcoming Events</p>
                                <p className="text-2xl font-bold text-primary-dark mt-1">{upcomingEvents.length}</p>
                            </div>
                            <CalendarIcon className="w-10 h-10 text-secondary/30" />
                        </div>
                    </div>
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary/60">Past Events</p>
                                <p className="text-2xl font-bold text-primary-dark mt-1">{pastEvents.length}</p>
                            </div>
                            <CalendarIcon className="w-10 h-10 text-primary/20" />
                        </div>
                    </div>
                    {/* Placeholder stats requiring additional backend implementation for attendees */}
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary/60">Total Events</p>
                                <p className="text-2xl font-bold text-primary-dark mt-1">
                                    {events.length}
                                </p>
                            </div>
                            <Users className="w-10 h-10 text-accent-saffron/30" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b-2 border-secondary/20">
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === "upcoming"
                            ? "text-secondary-dark border-b-4 border-secondary"
                            : "text-primary/60 hover:text-primary"
                            }`}
                    >
                        Upcoming Events ({upcomingEvents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`px-6 py-3 font-semibold transition-all ${activeTab === "past"
                            ? "text-secondary-dark border-b-4 border-secondary"
                            : "text-primary/60 hover:text-primary"
                            }`}
                    >
                        Past Events ({pastEvents.length})
                    </button>
                </div>

                {/* Events List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayEvents.map((event) => (
                            <div
                                key={event.id}
                                className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                            >
                                {/* Event Image */}
                                <div className="relative h-48 w-full bg-secondary/10">
                                    <Image
                                        src={event.imageUrl}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={getCategoryBadgeStyle(event.category)}>
                                            {event.category}
                                        </span>
                                        {event.isFeatured && (
                                            <span className="backdrop-blur-md shadow-[0_2px_4px_rgba(0,0,0,0.05)] border px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-secondary text-white border-secondary-light">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-5">
                                    <h3 className="font-cinzel-decorative text-lg font-bold text-primary-dark mb-3">
                                        {event.title}
                                    </h3>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-primary/70">
                                            <CalendarIcon className="w-4 h-4 text-secondary" />
                                            <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-primary/70">
                                            <Clock className="w-4 h-4 text-secondary" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-primary/70">
                                            <MapPin className="w-4 h-4 text-secondary" />
                                            <span>{event.location}</span>
                                        </div>
                                        {event.capacity && (
                                            <div className="flex items-center gap-2 text-sm text-primary/70">
                                                <Users className="w-4 h-4 text-secondary" />
                                                <span>
                                                    Capacity: {event.capacity}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t border-secondary/20">
                                        <button
                                            onClick={() => handleEditClick(event)}
                                            className="flex-1 px-4 py-2 border-2 border-secondary/30 text-secondary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold flex items-center justify-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="px-4 py-2 border-2 border-accent-saffron/30 text-accent-saffron rounded-lg hover:bg-accent-saffron/5 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && displayEvents.length === 0 && (
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-12 text-center">
                        <CalendarIcon className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-primary-dark mb-2">
                            No {activeTab} events
                        </h3>
                        <p className="text-primary/60">
                            {activeTab === "upcoming"
                                ? "Click 'Add New Event' to create an upcoming event"
                                : "No past events to display"}
                        </p>
                    </div>
                )}
            </div>

            {/* Add/Edit Event Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl z-10 border-2 border-secondary/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                                    {selectedEvent ? "Edit Event" : "Add New Event"}
                                </h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-full hover:bg-secondary/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Event Title (English) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="Ugadi Festival 2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Event Title (Kannada - ಕನ್ನಡ)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.titleKn}
                                            onChange={(e) => setFormData({ ...formData, titleKn: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="ಯುಗಾದಿ ಹಬ್ಬ 2026"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Time *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="6:00 AM - 12:00 PM"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Location (English) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="Main Temple Hall"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Location (Kannada)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.locationKn}
                                            onChange={(e) => setFormData({ ...formData, locationKn: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="ಮುಖ್ಯ ದೇವಾಲಯ ಸಭಾಂಗಣ"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Description (English) *
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Enter event description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Description (Kannada)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.descriptionKn}
                                        onChange={(e) => setFormData({ ...formData, descriptionKn: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="ಕಾರ್ಯಕ್ರಮದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ..."
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Registration Fee (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="0 for Free"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Registration Open
                                        </label>
                                        <select
                                            value={formData.registrationOpen}
                                            onChange={(e) => setFormData({ ...formData, registrationOpen: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        >
                                            <option value="true">Yes</option>
                                            <option value="false">No</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Video URL (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.videoUrl}
                                            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Set as Featured Event? (Only 1 active)
                                        </label>
                                        <select
                                            value={formData.isFeatured}
                                            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.value })}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none bg-secondary/5 font-semibold text-secondary-dark"
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes, set as Featured</option>
                                        </select>
                                    </div>
                                </div>

                                <label className="block text-sm font-semibold text-primary-dark mb-2">
                                    Event Image {!selectedEvent && "*"}
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-secondary/30 rounded-lg p-6 text-center hover:bg-secondary/5 transition-colors cursor-pointer bg-background-cream/30 flex flex-col items-center justify-center gap-2"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        // Make required logic manual validation in handleSubmit or rely on state if file is present
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setFormData({ ...formData, file: e.target.files[0] });
                                            }
                                        }}
                                        className="hidden"
                                    />

                                    {formData.file ? (
                                        <div className="text-sm text-secondary-dark font-medium flex flex-col items-center">
                                            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            {formData.file.name}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFormData({ ...formData, file: null });
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                                }}
                                                className="text-xs text-red-500 hover:text-red-700 mt-1 font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-secondary/40" />
                                            <span className="text-sm font-medium text-primary/60">Click to upload image</span>
                                            <span className="text-xs text-primary/40">JPG, PNG (max 5MB)</span>
                                            {selectedEvent && <span className="text-xs text-green-600 mt-1 font-medium">Keep existing to not change</span>}
                                        </>
                                    )}
                                </div>
                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-6 border-t border-secondary/20">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-3 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : selectedEvent ? "Update Event" : "Create Event"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout >
    );
}
