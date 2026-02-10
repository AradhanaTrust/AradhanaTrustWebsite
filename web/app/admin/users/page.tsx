"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useSession } from "next-auth/react";
import { User, Lock, Edit, Mail, Shield, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl overflow-hidden min-h-[300px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 h-64">
                            <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
                            <p className="text-primary/60">Loading users...</p>
                        </div>
                    ) : (
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
                                                    <span className="text-sm">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
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
                    )}
                </div>
            </div>

            {/* Password Reset Modal - Placeholder for now */}
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
                                        value={selectedUser.name}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={selectedUser.email}
                                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                        className="w-full px-4 py-2 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                    />
                                </div>
                                {session?.user?.role === "PRIMARY_ADMIN" && (
                                    <div>
                                        <label className="block text-sm font-semibold text-primary-dark mb-2">
                                            Role
                                        </label>
                                        <select
                                            value={selectedUser.role}
                                            onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
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
                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch("/api/admin/users", {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    id: selectedUser.id,
                                                    name: selectedUser.name,
                                                    email: selectedUser.email,
                                                    role: selectedUser.role,
                                                }),
                                            });

                                            if (res.ok) {
                                                fetchUsers();
                                                setShowEditModal(false);
                                            } else {
                                                const msg = await res.text();
                                                alert("Failed to update user: " + msg);
                                            }
                                        } catch (error) {
                                            console.error("Failed to update user", error);
                                            alert("Failed to update user");
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors"
                                >
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
