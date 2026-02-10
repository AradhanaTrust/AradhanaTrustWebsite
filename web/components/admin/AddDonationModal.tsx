"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddDonationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    "Annadanam",
    "Temple Events",
    "Education",
    "Cultural Programs",
    "Social Welfare",
    "Gauseva",
    "General"
];

const METHODS = [
    "Cash",
    "Cheque",
    "UPI",
    "Bank Transfer"
];

export default function AddDonationModal({ isOpen, onClose, onSuccess }: AddDonationModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        donorName: "",
        email: "",
        phone: "",
        amount: "",
        category: CATEGORIES[0],
        method: METHODS[0],
        address: "",
        panNumber: "",
        referredBy: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                throw new Error("Failed to create donation");
            }

            setFormData({
                donorName: "",
                email: "",
                phone: "",
                amount: "",
                category: CATEGORIES[0],
                method: METHODS[0],
                address: "",
                panNumber: "",
                referredBy: ""
            });
            onSuccess();
            onClose();
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to add donation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-secondary/20">
                                <div className="flex justify-between items-center mb-4">
                                    <Dialog.Title as="h3" className="text-lg font-cinzel-decorative font-bold text-primary-dark">
                                        Add New Donation
                                    </Dialog.Title>
                                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Donor Name & Referred By */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Donor Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="donorName"
                                                required
                                                value={formData.donorName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                                placeholder="Enter name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Referred By
                                            </label>
                                            <input
                                                type="text"
                                                name="referredBy"
                                                value={formData.referredBy}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                                placeholder="Referred By"
                                            />
                                        </div>
                                    </div>

                                    {/* Amount & Method */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Amount (₹) *
                                            </label>
                                            <input
                                                type="number"
                                                name="amount"
                                                required
                                                min="1"
                                                value={formData.amount}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Payment Method *
                                            </label>
                                            <select
                                                name="method"
                                                value={formData.method}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                            >
                                                {METHODS.map(m => (
                                                    <option key={m} value={m}>{m}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                                placeholder="Optional"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
                                                placeholder="Optional"
                                            />
                                        </div>
                                    </div>

                                    {/* PAN Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            PAN Number
                                        </label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors uppercase"
                                            placeholder="For 80G Tax Exemption"
                                            maxLength={10}
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors resize-none"
                                            placeholder="Optional"
                                        />
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Donation"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
