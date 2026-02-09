"use client";

import { useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useSession } from "next-auth/react";
import { User, Lock, Edit, Mail, Shield, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
    const { data: session } = useSession();
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Mock users data - will be replaced with API
    const users = [
        {
            id: "1",
            name: "Primary Administrator",
            email: "admin@aradhanadharmikatrust.org",
            role: "PRIMARY_ADMIN",
            createdAt: "2026-01-15",
            lastLogin: "2026-02-09",
        },
        {
            id: "2",
            name: "Events Coordinator",
            email: "events@aradhanadharmikatrust.org",
            role: "SECONDARY_ADMIN",
            createdAt: "2026-01-20",
            lastLogin: "2026-02-08",
        },
    ];

    const handleResetPassword = (user: any) => {
        setSelectedUser(user);
        setShowPasswordModal(true);
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                            User Management
                        </h2>
                        <p className="text-primary/60 mt-1">
                            Manage administrator accounts and permissions
                        </p>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-secondary/5 border-b-2 border-secondary/20">
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-primary-dark">
                                        User
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-primary-dark">
                                        Role
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-primary-dark">
                                        Created
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-primary-dark">
                                        Last Login
                                    </th>
                                    <th className="text-left py-4 px-6 text-sm font-semibold text-primary-dark">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-secondary-dark" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-primary-dark">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-sm text-primary/60">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-secondary" />
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-full font-semibold ${user.role === "PRIMARY_ADMIN"
                                                        ? "bg-secondary text-surface-white"
                                                        : "bg-accent-saffron/20 text-accent-saffron"
                                                        }`}
                                                >
                                                    {user.role.replace("_", " ")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-primary/60">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm">{user.createdAt}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm text-primary/60">
                                                {user.lastLogin}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {/* Edit Button */}
                                                {(user.role === "SECONDARY_ADMIN" ||
                                                    session?.user?.id === user.id) && (
                                                        <button
                                                            onClick={() => handleEditUser(user)}
                                                            className="p-2 hover:bg-secondary/10 rounded-lg transition-colors group"
                                                            title="Edit User"
                                                        >
                                                            <Edit className="w-4 h-4 text-secondary-dark group-hover:text-secondary" />
                                                        </button>
                                                    )}

                                                {/* Reset Password Button */}
                                                <button
                                                    onClick={() => handleResetPassword(user)}
                                                    className="p-2 hover:bg-accent-saffron/10 rounded-lg transition-colors group"
                                                    title="Reset Password"
                                                >
                                                    <Lock className="w-4 h-4 text-accent-saffron/80 group-hover:text-accent-saffron" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-secondary/5 border-l-4 border-secondary p-6 rounded-lg">
                    <h3 className="font-semibold text-primary-dark mb-2">
                        User Management Permissions
                    </h3>
                    <ul className="space-y-1 text-sm text-primary/70">
                        <li>✓ Primary Admin can manage all users</li>
                        <li>✓ Edit email, role, and account settings for Secondary Admins</li>
                        <li>✓ Reset passwords for all managed users</li>
                        <li>✓ View login history and account activity</li>
                    </ul>
                </div>
            </div>

            {/* Password Reset Modal */}
            <AnimatePresence>
                {showPasswordModal && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPasswordModal(false)}
                            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface-white rounded-xl max-w-md w-full p-6 shadow-2xl z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-cinzel-decorative font-bold text-primary-dark mb-4">
                                Reset Password
                            </h3>
                            <p className="text-primary/70 mb-6">
                                Reset password for <strong>{selectedUser.name}</strong>
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors">
                                    Reset Password
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowEditModal(false)}
                            className="fixed inset-0 bg-primary/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface-white rounded-xl max-w-md w-full p-6 shadow-2xl z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-cinzel-decorative font-bold text-primary-dark mb-4">
                                Edit User
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={selectedUser.name}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        defaultValue={selectedUser.email}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                    />
                                </div>
                                {selectedUser.role === "SECONDARY_ADMIN" && session?.user?.role === "PRIMARY_ADMIN" && (
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Role
                                        </label>
                                        <select
                                            defaultValue={selectedUser.role}
                                            className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        >
                                            <option value="SECONDARY_ADMIN">Secondary Admin</option>
                                            <option value="PRIMARY_ADMIN">Primary Admin</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="flex-1 px-4 py-2 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
