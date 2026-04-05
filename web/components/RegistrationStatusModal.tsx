"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Download, X } from "lucide-react";

interface RegistrationStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    status: 'success' | 'error' | null;
    title?: string;
    message?: string;
    registrationNo?: string;
    receiptUrl?: string;
}

export default function RegistrationStatusModal({
    isOpen,
    onClose,
    status,
    title,
    message,
    registrationNo,
    receiptUrl
}: RegistrationStatusModalProps) {
    if (!isOpen || !status) return null;

    const isSuccess = status === 'success';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative w-full max-w-xl bg-[#FDFBF7] rounded-3xl shadow-2xl border-[4px] border-double border-[#D4AF37]/40 z-10 max-h-[90vh] flex flex-col overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/assets/mandala-bg.svg')] bg-[length:300px_300px] bg-center opacity-[0.03] pointer-events-none mix-blend-multiply" />
                    
                    {/* Inner gold stroke */}
                    <div className="absolute inset-2 rounded-[1.25rem] border-2 border-[#D4AF37]/50 pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full text-[#8D6E63] hover:text-[#5D4037] hover:bg-[#F3E5C5] transition-all hover:scale-105 shadow-sm border border-[#D4AF37]/20"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10 overflow-y-auto custom-scrollbar">
                        {/* Status Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                            className="mb-4 mt-2 relative"
                        >
                            {/* Glow element */}
                            <div className={`absolute inset-0 blur-xl rounded-full opacity-30 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`} />
                            
                            {isSuccess ? (
                                <CheckCircle2 className="w-24 h-24 text-[#D4AF37] relative z-10 drop-shadow-lg" />
                            ) : (
                                <XCircle className="w-24 h-24 text-red-500 relative z-10 drop-shadow-lg" />
                            )}
                        </motion.div>

                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4 w-full"
                        >
                            <h2 className="font-cinzel-decorative font-bold text-3xl sm:text-4xl text-[#5D4037]">
                                {title || (isSuccess ? "Success" : "Failed")}
                            </h2>
                            
                            <p className="text-lg text-[#8D6E63] font-serif leading-relaxed px-4">
                                {message}
                            </p>

                            {/* Registration Number Highlight */}
                            {registrationNo && isSuccess && (
                                <div className="mt-6 mb-4 p-4 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent border-y border-[#D4AF37]/20">
                                    <p className="text-xs text-[#8D6E63] uppercase tracking-widest font-bold mb-1">Registration Number</p>
                                    <p className="text-xl sm:text-2xl font-mono font-bold text-[#5D4037] tracking-wider">{registrationNo}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4 space-y-3 flex flex-col items-center">
                                {receiptUrl && isSuccess && (
                                    <a
                                        href={receiptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-3/4 h-12 px-6 bg-gradient-to-b from-[#F2C96D] to-[#9E731C] text-white font-medium text-lg rounded-xl border border-[#CFA14E] shadow-[inset_0_0_0_2px_#DFA848,inset_0_0_0_3px_#FFF5D1,0_4px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_15px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 drop-shadow-md mx-auto"
                                        onClick={onClose}
                                    >
                                        <Download size={20} className="animate-bounce" />
                                        Download Receipt
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
