"use client";

import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useSession } from "next-auth/react";
import { CreditCard, QrCode, Upload, Save, Loader2, Info } from "lucide-react";
import { donationConfig } from "@/lib/donation-config";

export default function PaymentSettingsPage() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [paymentSettings, setPaymentSettings] = useState({
        upiId: donationConfig.upiId as string,
        upiQrCodeImage: donationConfig.qrCodeImage as string
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const res = await fetch("/api/admin/settings");
                if (res.ok) {
                    const data = await res.json();
                    setPaymentSettings({
                        upiId: data.upiId || donationConfig.upiId,
                        upiQrCodeImage: data.upiQrCodeImage || donationConfig.qrCodeImage
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
                setError("Failed to load current payment configurations.");
            } finally {
                setIsLoading(false);
            }
        };

        if (session) {
            fetchSettings();
        }
    }, [session]);

    const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Upload using the existing profile image upload API as it routes to absolute persistent upload path correctly!
            const res = await fetch("/api/admin/profile/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to upload QR Code image.");
            }

            const data = await res.json();
            setPaymentSettings(prev => ({ ...prev, upiQrCodeImage: data.url }));
            setSuccess("QR Code image uploaded successfully. Click Save Changes to apply it to the live website.");
        } catch (err: any) {
            setError(err.message || "Failed to upload QR Code image.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveChanges = async () => {
        setError("");
        setSuccess("");
        setIsSaving(true);

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    upiId: paymentSettings.upiId,
                    upiQrCodeImage: paymentSettings.upiQrCodeImage
                })
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg);
            }

            setSuccess("UPI Gateway configuration updated successfully and is now live across the website!");
        } catch (err: any) {
            setError(err.message || "Failed to save payment settings.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-cinzel-decorative font-bold text-primary-dark">
                        Payment & Gateway Settings
                    </h2>
                    <p className="text-primary/60 mt-1">
                        Configure payment artifacts, UPI details, and dynamic QR Code assets used across the website.
                    </p>
                </div>

                {/* Status Messages */}
                {error && (
                    <div className="p-4 bg-accent-saffron/10 border border-accent-saffron/30 rounded-lg text-accent-saffron text-sm font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-700 text-sm font-medium">
                        {success}
                    </div>
                )}

                {/* UPI Settings Card */}
                <div className="bg-surface-white border-2 border-secondary/20 rounded-xl p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-secondary/10">
                        <div className="w-10 h-10 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-cinzel-decorative font-bold text-primary-dark">
                                UPI QR & Gateway Settings
                            </h3>
                            <p className="text-xs text-primary/60">
                                Controls the UPI payment details printed on the homepage and donation hero cards.
                            </p>
                        </div>
                    </div>

                    {isLoading && !isSaving ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                            <p className="text-sm text-primary/60">Loading payment configurations...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8">
                            {/* Form Input fields */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-primary-dark mb-2">
                                        UPI Merchant ID
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentSettings.upiId}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-secondary/20 rounded-lg focus:border-secondary focus:outline-none font-mono text-sm font-bold text-[#4A3225]"
                                        placeholder="e.g. ppr.04789.19022024.00513152@cnrb"
                                    />
                                    <p className="text-xs text-primary/50 mt-1">
                                        This identifier is copied automatically when a user clicks the UPI Copy button.
                                    </p>
                                </div>

                                <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10 flex gap-3">
                                    <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                                    <div className="text-xs text-primary/70 leading-relaxed">
                                        <strong>Live Updates:</strong> Modifying these settings will instantly update both the main landing page and the dedicated donation page hero banners. Please ensure the QR code matches the UPI ID specified above to prevent payment mismatched records.
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="pt-4">
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={isSaving || !paymentSettings.upiId}
                                        className="px-6 py-3 bg-secondary text-surface-white rounded-lg hover:bg-secondary-dark transition-colors font-semibold flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code Upload Section */}
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-sm font-semibold text-primary-dark self-start md:self-center">
                                    UPI QR Code Image
                                </span>

                                <div className="w-52 h-52 bg-background-ivory rounded-xl border-4 border-double border-secondary/30 flex items-center justify-center overflow-hidden p-2 relative group shadow-inner">
                                    <img
                                        src={paymentSettings.upiQrCodeImage}
                                        alt="UPI QR Code Preview"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = donationConfig.qrCodeImage;
                                        }}
                                    />
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleQrUpload}
                                    accept="image/*"
                                    className="hidden"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-2.5 border-2 border-secondary/30 text-secondary-dark rounded-lg hover:bg-secondary/5 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-4 h-4" /> Browse QR Image
                                </button>
                                <p className="text-[10px] text-primary/50 text-center">
                                    Supported formats: JPG, PNG, WEBP. Max size 2MB.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
