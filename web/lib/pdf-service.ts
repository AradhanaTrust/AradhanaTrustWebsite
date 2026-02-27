import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptTemplate } from "@/components/PDFs/ReceiptTemplate";
import React from "react";

export async function generateReceiptPDF(data: any) {
    try {
        // We use renderToBuffer to get a Buffer that can be sent via email or as a response
        const buffer = await renderToBuffer(
            React.createElement(ReceiptTemplate, { data }) as any
        );
        return buffer;
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        throw error;
    }
}
