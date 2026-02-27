"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useSession } from "next-auth/react";
import {
    Plus,
    Edit,
    Trash2,
    X,
    Save,
    Image as ImageIcon,
    Loader2,
    Video,
    Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Match Prisma Schema
interface DonationActivity {
    id: string;
    title: string;
    titleKn: string | null;
    description: string;
    descriptionKn: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export default function DonationActivitiesPage() {
    const { data: session } = useSession();

    // State
    const [activities, setActivities] = useState<DonationActivity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<DonationActivity | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        titleKn: "",
        description: "",
        descriptionKn: "",
        videoUrl: "",
        isActive: "true",
        order: "0",
        file: null as File | null,
        imageUrl: "" // for keeping track of existing image
    });

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await fetch("/api/admin/donation-activities");
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to fetch activities", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (activity: DonationActivity) => {
        setSelectedActivity(activity);
        setFormData({
            title: activity.title,
            titleKn: activity.titleKn || "",
            description: activity.description,
            descriptionKn: activity.descriptionKn || "",
            videoUrl: activity.videoUrl || "",
            isActive: activity.isActive ? "true" : "false",
            order: activity.order.toString(),
            imageUrl: activity.imageUrl || "",
            file: null
        });
        setShowAddModal(true);
    };

    const handleAddNewClick = () => {
        setSelectedActivity(null);
        setFormData({
            title: "",
            titleKn: "",
            description: "",
            descriptionKn: "",
            videoUrl: "",
            isActive: "true",
            order: "0",
            imageUrl: "",
            file: null
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this activity?")) return;

        try {
            const res = await fetch(`/api/admin/donation-activities/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchActivities();
            } else {
                alert("Failed to delete activity.");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting activity");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append("title", formData.title);
            if (formData.titleKn) submitData.append("titleKn", formData.titleKn);
            submitData.append("description", formData.description);
            if (formData.descriptionKn) submitData.append("descriptionKn", formData.descriptionKn);
            if (formData.videoUrl) submitData.append("videoUrl", formData.videoUrl);
            submitData.append("isActive", formData.isActive);
            submitData.append("order", formData.order);
            if (formData.imageUrl) submitData.append("imageUrl", formData.imageUrl);

            if (formData.file) {
                submitData.append("file", formData.file);
            }

            const url = selectedActivity
                ? `/api/admin/donation-activities/${selectedActivity.id}`
                : "/api/admin/donation-activities";

            const method = selectedActivity ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                body: submitData
            });

            if (res.ok) {
                setShowAddModal(false);
                fetchActivities();
            } else {
                throw new Error("Save failed");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save activity.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                            Donation Activities
                        </h2>
                        <p className="text-primary/60 mt-1">
                            Manage important temple activities driven by donations
                        </p>
                    </div>
                    <button
                        onClick={handleAddNewClick}
                        className="w-fit mx-auto sm:mx-0 flex items-center gap-2 px-6 py-2.5 bg-secondary text-surface-white font-bold rounded-lg hover:bg-secondary-dark transition-all transform hover:-translate-y-0.5 shadow-md shadow-secondary/20 text-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Activities
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden min-h-[400px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64">
                            <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
                            <p className="text-primary/60">Loading activities...</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64 text-center">
                            <p className="text-primary/60 text-lg mb-2">No activities found</p>
                            <p className="text-sm text-primary/40">Click "Add New Activity" to create one</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/5 border-b-2 border-secondary/20">
                                    <tr>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Image / Media</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Title</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Order</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap">Status</th>
                                        <th className="p-4 font-semibold text-primary-dark whitespace-nowrap text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary/10">
                                    {activities.map((activity) => (
                                        <tr key={activity.id} className="hover:bg-secondary/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-secondary/20 bg-background-cream flex items-center justify-center">
                                                    {activity.imageUrl ? (
                                                        <Image src={activity.imageUrl} alt={activity.title} fill className="object-cover" />
                                                    ) : activity.videoUrl ? (
                                                        <Video className="w-6 h-6 text-secondary/50" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-secondary/30" />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-semibold text-primary-dark">{activity.title}</div>
                                                <div className="text-sm text-primary/60 max-w-xs truncate">{activity.description}</div>
                                            </td>
                                            <td className="p-4 text-sm font-medium text-primary/80">{activity.order}</td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${activity.isActive
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                    }`}>
                                                    {activity.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditClick(activity)}
                                                        className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(activity.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                            onClick={() => !isSubmitting && setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-surface-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b-2 border-secondary/10 flex-shrink-0">
                                <h3 className="text-xl font-cinzel-decorative font-bold text-primary-dark">
                                    {selectedActivity ? "Edit Activity" : "Add New Activity"}
                                </h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    disabled={isSubmitting}
                                    className="p-2 text-primary/40 hover:text-primary-dark hover:bg-secondary/10 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body (Scrollable) */}
                            <div className="p-6 overflow-y-auto">
                                <form id="activityForm" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        {/* Title Grid */}
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">Activity Title (English) *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-4 py-2 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors"
                                                    placeholder="e.g. Temple Construction"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">Activity Title (Kannada)</label>
                                                <input
                                                    type="text"
                                                    value={formData.titleKn}
                                                    onChange={(e) => setFormData({ ...formData, titleKn: e.target.value })}
                                                    className="w-full px-4 py-2 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors font-kannada"
                                                    placeholder="ಉದಾ. ದೇವಾಲಯ ನಿರ್ಮಾಣ"
                                                />
                                            </div>
                                        </div>

                                        {/* Image Upload */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-primary-dark">Cover Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                                                className="hidden"
                                            />
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-32 border-2 border-dashed border-secondary/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all relative overflow-hidden group"
                                            >
                                                {formData.file ? (
                                                    // Show newly selected file preview
                                                    <Image src={URL.createObjectURL(formData.file)} alt="Preview" fill className="object-cover" />
                                                ) : formData.imageUrl ? (
                                                    // Show existing image
                                                    <Image src={formData.imageUrl} alt="Current" fill className="object-cover" />
                                                ) : (
                                                    <>
                                                        <Upload className="w-6 h-6 text-secondary/50 mb-2 group-hover:text-secondary" />
                                                        <span className="text-sm text-primary/60 group-hover:text-primary-dark text-center px-4">
                                                            Click to upload image
                                                        </span>
                                                    </>
                                                )}
                                                {(formData.file || formData.imageUrl) && (
                                                    <div className="absolute inset-0 bg-primary/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white text-sm font-medium">Change Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Video URL */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">YouTube Video URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.videoUrl}
                                                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                    className="w-full px-4 py-2 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors text-sm"
                                                    placeholder="https://youtube.com/watch?v=..."
                                                />
                                            </div>

                                            {/* Order */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={formData.order}
                                                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                                    className="w-full px-4 py-2 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors"
                                                />
                                            </div>

                                            {/* Status */}
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">Status</label>
                                                <select
                                                    value={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value })}
                                                    className="w-full px-4 py-2 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors"
                                                >
                                                    <option value="true">Active (Visible)</option>
                                                    <option value="false">Inactive (Hidden)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">Full Description (English) *</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full px-4 py-3 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors resize-y text-sm leading-relaxed"
                                                    placeholder="Write the detailed description of the activity..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-primary-dark">Full Description (Kannada)</label>
                                                <textarea
                                                    rows={5}
                                                    value={formData.descriptionKn}
                                                    onChange={(e) => setFormData({ ...formData, descriptionKn: e.target.value })}
                                                    className="w-full px-4 py-3 bg-background-cream border-2 border-secondary/20 rounded-xl focus:border-secondary focus:ring-0 transition-colors resize-y text-sm leading-relaxed font-kannada"
                                                    placeholder="ಚಟುವಟಿಕೆಯ ವಿವರವಾದ ವಿವರಣೆಯನ್ನು ಬರೆಯಿರಿ..."
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t-2 border-secondary/10 bg-background-cream/50 flex justify-end gap-3 flex-shrink-0 rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 text-primary-dark font-medium hover:bg-secondary/10 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="activityForm"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-surface-white font-medium rounded-lg hover:bg-secondary-dark transition-all shadow-md disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {selectedActivity ? "Update Activity" : "Save Activity"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
