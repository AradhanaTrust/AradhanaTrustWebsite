"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    HandHeart, // Keep HandHeart for Donations, as Heart is used for Seva Management in the example
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Image as ImageIcon, // Renamed Image to ImageIcon to avoid conflict
    Activity,
    BookOpen, // Added BookOpen for Priest Registrations
    Heart // Added Heart for Ritual Requests
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isPrimaryAdmin = session?.user?.role === "PRIMARY_ADMIN";

    // Updated menuItems to a grouped structure
    const menuSections = [
        {
            name: "Main",
            items: [
                { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, adminOnly: false },
                { name: "Donations", href: "/admin/donations", icon: HandHeart, adminOnly: false },
                { name: "Registrations", href: "/admin/events/registrations", icon: Users, adminOnly: false },
            ]
        },
        {
            name: "Content Management",
            items: [
                { name: "Events", href: "/admin/events", icon: Calendar, adminOnly: false },
                { name: "Activities", href: "/admin/donations/activities", icon: Activity, adminOnly: false },
                { name: "Ritual Requests", href: "/admin/services", icon: Heart, adminOnly: false },
                { name: "Purohit Registrations", href: "/admin/priests", icon: BookOpen, adminOnly: false },
                { name: "Gallery", href: "/admin/gallery", icon: ImageIcon, adminOnly: false },
            ]
        },
        {
            name: "Settings",
            items: [
                { name: "General Settings", href: "/admin/settings", icon: Settings, adminOnly: false },
            ]
        }
    ];

    // Flatten and filter menu items for easier processing in some places
    const allMenuItems = menuSections.flatMap(section => section.items);
    const filteredMenuItems = allMenuItems.filter(
        item => !item.adminOnly || isPrimaryAdmin
    );

    return (
        <div className="min-h-screen bg-background-ivory flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-24 left-4 z-50 p-3 bg-secondary text-surface-white rounded-full shadow-lg"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 h-screen w-64 bg-background-cream border-r-4 border-secondary/30 
          flex flex-col shadow-xl z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b-2 border-secondary/20">
                    <Link href="/" className="flex items-center gap-3">
                        <img
                            src="/assets/Logo_Round.png"
                            alt="Aradhana Trust"
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h2 className="font-cinzel-decorative text-lg font-bold text-primary-dark">
                                Admin Portal
                            </h2>
                            <p className="text-xs text-primary/60">Aradhana Trust</p>
                        </div>
                    </Link>
                </div>

                {/* User Info */}
                <div className="p-4 border-b-2 border-secondary/20 bg-secondary/5">
                    <p className="text-sm font-semibold text-primary-dark truncate">
                        {session?.user?.name}
                    </p>
                    <p className="text-xs text-primary/60 truncate">{session?.user?.email}</p>
                    <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary-dark rounded-full">
                            {session?.user?.role?.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-4 overflow-y-auto"> {/* Changed space-y-2 to space-y-4 for section spacing */}
                    {menuSections.map((section) => {
                        const sectionItems = section.items.filter(item => !item.adminOnly || isPrimaryAdmin);
                        if (sectionItems.length === 0) return null; // Don't render section if no items are visible

                        return (
                            <div key={section.name}>
                                <h3 className="text-xs font-semibold uppercase text-primary/60 mb-2 px-4">
                                    {section.name}
                                </h3>
                                <div className="space-y-2">
                                    {sectionItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                onClick={() => setSidebarOpen(false)}
                                                className={`
                                                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                                                    ${isActive
                                                        ? "bg-secondary text-surface-white shadow-md"
                                                        : "text-primary-dark hover:bg-secondary/10 hover:text-secondary-dark"
                                                    }
                                                `}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t-2 border-secondary/20">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-accent-saffron hover:bg-accent-saffron/10 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-primary/50 backdrop-blur-sm z-30"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <div className="sticky top-0 z-20 bg-background-cream/95 backdrop-blur-md border-b-2 border-secondary/20 px-4 md:px-6 py-3 md:py-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl md:text-2xl font-cinzel-decorative font-bold text-primary-dark">
                                {allMenuItems.find(item => item.href === pathname)?.name || "Dashboard"}
                            </h1>
                            <p className="text-xs md:text-sm text-primary/60">
                                Welcome, {session?.user?.name?.split(' ')[0]}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs text-primary/60">Last Login</p>
                                <p className="text-sm font-semibold text-primary-dark">
                                    {new Date().toLocaleDateString('en-IN')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
