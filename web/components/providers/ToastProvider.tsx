"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 5000,
                style: {
                    background: '#fff',
                    color: '#5D4037',
                    border: '1px solid #D4AF374d',
                    padding: '16px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
                },
                success: {
                    iconTheme: {
                        primary: '#D4AF37',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}
