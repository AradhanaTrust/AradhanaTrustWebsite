"use client";

import { useState } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useSession } from "next-auth/react";
import { User, Mail, Phone, Lock, Camera, Save } from "lucide-react";

export default function SettingsPage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    // Mock user data - will be replaced with API
    const [userData, setUserData] = useState({
        name: session?.user?.name || "Administrator",
        email: session?.user?.email || "",
        phone: "+91 98765 43210",
        photo: "/assets/Logo_Round.png",
        role: session?.user?.role || "PRIMARY_ADMIN",
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                        Account Settings
                    </h2>
                    <p className="text-primary/60 mt-1">
                        Manage your profile information and security settings
                    </p>
                </div>

                {/* Profile Information Section */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-cinzel-decorative font-bold text-primary-dark">
                            Profile Information
                        </h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 border-2 border-secondary/30 text-secondary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                        >
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Photo */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-secondary/30">
                                    <img
                                        src={userData.photo}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-2 bg-secondary text-surface-white rounded-full hover:bg-secondary-dark transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-primary-dark">Profile Photo</p>
                                <p className="text-sm text-primary/60 mt-1">
                                    PNG, JPG up to 5MB
                                </p>
                                {isEditing && (
                                    <button className="text-sm text-secondary-dark hover:text-secondary mt-2 font-medium">
                                        Upload new photo
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Name Field */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                    <input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) =>
                                            setUserData({ ...userData, name: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none disabled:bg-background-cream/50 disabled:cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                    <input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) =>
                                            setUserData({ ...userData, email: e.target.value })
                                        }
                                        disabled={!isEditing}
                                        className="w-full pl-11 pr-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none disabled:bg-background-cream/50 disabled:cursor-not-allowed transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Phone Number
                            </label>
                            <div className="relative max-w-md">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                <input
                                    type="tel"
                                    value={userData.phone}
                                    onChange={(e) =>
                                        setUserData({ ...userData, phone: e.target.value })
                                    }
                                    disabled={!isEditing}
                                    className="w-full pl-11 pr-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none disabled:bg-background-cream/50 disabled:cursor-not-allowed transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        {/* Role Display */}
                        <div>
                            <label className="block text-sm font-semibold text-primary-dark mb-2">
                                Account Role
                            </label>
                            <div className="inline-block px-4 py-2 bg-secondary/10 text-secondary-dark rounded-lg font-semibold">
                                {userData.role.replace("_", " ")}
                            </div>
                        </div>

                        {/* Save Button */}
                        {isEditing && (
                            <div className="flex gap-3 pt-4 border-t border-secondary/20">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors font-semibold flex items-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                                >
                                    Discard
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-cinzel-decorative font-bold text-primary-dark">
                                Password & Security
                            </h3>
                            <p className="text-sm text-primary/60 mt-1">
                                Update your password to keep your account secure
                            </p>
                        </div>
                        <button
                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                            className="px-4 py-2 border-2 border-secondary/30 text-secondary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                        >
                            {showPasswordSection ? "Cancel" : "Change Password"}
                        </button>
                    </div>

                    {showPasswordSection && (
                        <div className="space-y-4 pt-4 border-t border-secondary/20">
                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                currentPassword: e.target.value,
                                            })
                                        }
                                        className="w-full pl-11 pr-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Enter current password"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value,
                                            })
                                        }
                                        className="w-full pl-11 pr-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <p className="text-xs text-primary/50 mt-1">
                                    Must be at least 8 characters with mix of letters and numbers
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary-dark mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        className="w-full pl-11 pr-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button className="px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors font-semibold">
                                    Update Password
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordSection(false);
                                        setPasswordData({
                                            currentPassword: "",
                                            newPassword: "",
                                            confirmPassword: "",
                                        });
                                    }}
                                    className="px-6 py-3 border-2 border-secondary/30 text-primary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {!showPasswordSection && (
                        <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-lg">
                            <Lock className="w-5 h-5 text-secondary" />
                            <p className="text-sm text-primary/70">
                                Your password was last changed on{" "}
                                <strong>January 15, 2026</strong>
                            </p>
                        </div>
                    )}
                </div>

                {/* Security Info */}
                <div className="bg-accent-saffron/5 border-l-4 border-accent-saffron p-6 rounded-lg">
                    <h4 className="font-semibold text-primary-dark mb-2">
                        Security Tips
                    </h4>
                    <ul className="space-y-1 text-sm text-primary/70">
                        <li>✓ Use a strong, unique password for your admin account</li>
                        <li>✓ Change your password regularly (every 3-6 months)</li>
                        <li>✓ Never share your login credentials with anyone</li>
                        <li>✓ Log out when accessing from shared devices</li>
                    </ul>
                </div>
            </div>
        </DashboardLayout>
    );
}
