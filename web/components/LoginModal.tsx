"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, X, Eye, EyeOff, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else if (result?.ok) {
                onClose();
                router.push("/admin/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-primary/60 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="texture-parchment rounded-2xl shadow-2xl border-4 border-double border-secondary/60 overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface-white/80 hover:bg-surface-white transition-colors shadow-sm"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5 text-primary" />
                            </button>

                            {/* Header */}
                            <div className="relative px-8 pt-12 pb-6 text-center">
                                {/* Logo */}
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src="/assets/Logo_Round.png"
                                        alt="Aradhana Trust Logo"
                                        className="w-20 h-20 object-contain drop-shadow-lg"
                                    />
                                </div>

                                {/* Title */}
                                <h2 className="font-cinzel-decorative text-3xl font-bold text-primary-dark mb-2">
                                    Admin Login
                                </h2>
                                <p className="font-serif text-sm text-primary/70 tracking-wide">
                                    Aradhana Dharmika Trust
                                </p>

                                {/* Decorative Line */}
                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <div className="h-[2px] w-16 bg-gradient-to-r from-transparent to-secondary" />
                                    <div className="w-2 h-2 rotate-45 bg-secondary" />
                                    <div className="h-[2px] w-16 bg-gradient-to-l from-transparent to-secondary" />
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-accent-saffron/10 border border-accent-saffron/30 rounded-lg"
                                    >
                                        <p className="text-sm text-accent-saffron font-medium text-center">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-semibold text-primary-dark"
                                    >
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-4 py-3 bg-background-cream border-2 border-secondary/20 rounded-lg
                               focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20
                               text-primary-dark placeholder:text-primary/40 transition-all"
                                            placeholder="admin@aradhanadharmikatrust.org"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-primary-dark"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/60" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full pl-12 pr-14 py-3 bg-background-cream border-2 border-secondary/20 rounded-lg
                               focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20
                               text-primary-dark placeholder:text-primary/40 transition-all"
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/10 rounded transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-secondary/60" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-secondary/60" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-6 bg-gradient-to-r from-secondary-dark to-secondary
                           hover:from-secondary to-secondary-light
                           text-surface-white font-semibold text-base rounded-lg
                           shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                           flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Authenticating...</span>
                                        </>
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </button>
                            </form>

                            {/* Footer - Lotus Flower Top View */}
                            <div className="px-8 pb-6">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    {/* Left Line */}
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary" />

                                    {/* Lotus Flower Top View SVG */}
                                    <svg
                                        width="32"
                                        height="32"
                                        viewBox="0 0 32 32"
                                        className="text-secondary"
                                        fill="currentColor"
                                    >
                                        {/* Center circle */}
                                        <circle cx="16" cy="16" r="3" fill="#D4AF37" />

                                        {/* 8 petals arranged in circle */}
                                        <path d="M16 8 C14 8, 13 10, 13 12 C13 10, 14 8, 16 8 Z" fill="#D4AF37" opacity="0.9" />
                                        <path d="M16 8 C18 8, 19 10, 19 12 C19 10, 18 8, 16 8 Z" fill="#D4AF37" opacity="0.9" />

                                        <path d="M24 16 C24 14, 22 13, 20 13 C22 13, 24 14, 24 16 Z" fill="#D4AF37" opacity="0.85" />
                                        <path d="M24 16 C24 18, 22 19, 20 19 C22 19, 24 18, 24 16 Z" fill="#D4AF37" opacity="0.85" />

                                        <path d="M16 24 C18 24, 19 22, 19 20 C19 22, 18 24, 16 24 Z" fill="#D4AF37" opacity="0.8" />
                                        <path d="M16 24 C14 24, 13 22, 13 20 C13 22, 14 24, 16 24 Z" fill="#D4AF37" opacity="0.8" />

                                        <path d="M8 16 C8 18, 10 19, 12 19 C10 19, 8 18, 8 16 Z" fill="#D4AF37" opacity="0.75" />
                                        <path d="M8 16 C8 14, 10 13, 12 13 C10 13, 8 14, 8 16 Z" fill="#D4AF37" opacity="0.75" />
                                    </svg>

                                    {/* Right Line */}
                                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary" />
                                </div>
                                <p className="text-xs text-primary/50 font-serif text-center">
                                    Protected Admin Access
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
