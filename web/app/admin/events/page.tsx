"use client";

import { useState } from "react";
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
    Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { events } from "@/lib/events-data";

export default function EventsPage() {
    const { data: session } = useSession();
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

    const upcomingEvents = events.filter(e => e.isUpcoming);
    const pastEvents = events.filter(e => !e.isUpcoming);

    const displayEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

    const getCategoryColor = (category: string) => {
        const colors = {
            festival: "bg-accent-saffron/20 text-accent-saffron",
            discourse: "bg-secondary/20 text-secondary-dark",
            community: "bg-primary/20 text-primary-dark",
            cultural: "bg-secondary-light/20 text-secondary-light",
            educational: "bg-primary/10 text-primary",
        };
        return colors[category as keyof typeof colors] || colors.community;
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
                        onClick={() => setShowAddModal(true)}
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
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary/60">Total Registrations</p>
                                <p className="text-2xl font-bold text-primary-dark mt-1">
                                    {events.reduce((sum, e) => sum + (e.attendees || 0), 0)}
                                </p>
                            </div>
                            <Users className="w-10 h-10 text-accent-saffron/30" />
                        </div>
                    </div>
                    <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary/60">Avg. Attendance</p>
                                <p className="text-2xl font-bold text-primary-dark mt-1">
                                    {Math.round(events.reduce((sum, e) => sum + (e.attendees || 0), 0) / events.length)}
                                </p>
                            </div>
                            <Users className="w-10 h-10 text-secondary/30" />
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {displayEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                        >
                            {/* Event Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.titleKey}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute top-3 left-3">
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getCategoryColor(event.category)}`}>
                                        {event.category.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Event Details */}
                            <div className="p-5">
                                <h3 className="font-cinzel-decorative text-lg font-bold text-primary-dark mb-3">
                                    {event.titleKey.split('.')[0].replace(/([A-Z])/g, ' $1').trim()}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-primary/70">
                                        <CalendarIcon className="w-4 h-4 text-secondary" />
                                        <span>{event.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-primary/70">
                                        <Clock className="w-4 h-4 text-secondary" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-primary/70">
                                        <MapPin className="w-4 h-4 text-secondary" />
                                        <span>{event.locationKey}</span>
                                    </div>
                                    {event.capacity && (
                                        <div className="flex items-center gap-2 text-sm text-primary/70">
                                            <Users className="w-4 h-4 text-secondary" />
                                            <span>
                                                {event.attendees || 0} / {event.capacity} registered
                                            </span>
                                            <div className="ml-2 flex-1 h-2 bg-secondary/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-secondary rounded-full"
                                                    style={{ width: `${((event.attendees || 0) / event.capacity) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-secondary/20">
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="flex-1 px-4 py-2 border-2 border-secondary/30 text-secondary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button className="px-4 py-2 border-2 border-accent-saffron/30 text-accent-saffron rounded-lg hover:bg-accent-saffron/5 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {displayEvents.length === 0 && (
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
                {(showAddModal || selectedEvent) && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setShowAddModal(false);
                                setSelectedEvent(null);
                            }}
                            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                                    {selectedEvent ? "Edit Event" : "Add New Event"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedEvent(null);
                                    }}
                                    className="p-2 rounded-full hover:bg-secondary/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Event Title (English)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="Ugadi Festival 2026"
                                            defaultValue={selectedEvent?.titleKey}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Event Title (Telugu - తెలుగు)
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="ఉగాది పండుగ 2026"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Category
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        defaultValue={selectedEvent?.category}
                                    >
                                        <option value="festival">Festival</option>
                                        <option value="discourse">Discourse</option>
                                        <option value="community">Community Service</option>
                                        <option value="cultural">Cultural</option>
                                        <option value="educational">Educational</option>
                                    </select>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            defaultValue={selectedEvent?.date.toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Time
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="6:00 AM - 12:00 PM"
                                            defaultValue={selectedEvent?.time}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Main Temple Hall"
                                        defaultValue={selectedEvent?.locationKey}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Description (English)
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Enter event description..."
                                        defaultValue={selectedEvent?.descriptionKey}
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Capacity
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            placeholder="300"
                                            defaultValue={selectedEvent?.capacity}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Registration Open
                                        </label>
                                        <select
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                            defaultValue={selectedEvent?.registrationOpen ? "yes" : "no"}
                                        >
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Event Image URL
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="/assets/events/ugadi.png"
                                        defaultValue={selectedEvent?.image}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6 pt-6 border-t border-secondary/20">
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedEvent(null);
                                    }}
                                    className="flex-1 px-6 py-3 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors font-semibold flex items-center justify-center gap-2">
                                    <Save className="w-5 h-5" />
                                    {selectedEvent ? "Update Event" : "Create Event"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
