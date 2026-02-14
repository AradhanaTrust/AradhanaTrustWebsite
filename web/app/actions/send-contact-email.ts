"use server";

import { z } from "zod";
import nodemailer from "nodemailer";

const contactFormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(2),
    message: z.string().min(1),
});

export async function sendContactEmail(formData: FormData) {
    try {
        const rawData = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        const validatedData = contactFormSchema.parse(rawData);

        // Map subject values to readable labels
        const subjectMap: Record<string, string> = {
            "general": "General Inquiry",
            "puja": "Puja Booking Inquiry",
            "donation": "Donation Inquiry",
            "event": "Event Related Inquiry",
            "volunteer": "Volunteer Interest",
            "other": "Other Inquiry"
        };

        const readableSubject = subjectMap[validatedData.subject] || validatedData.subject;

        console.log("--- SMTP DEBUG ---");
        console.log("SMTP_HOST:", process.env.SMTP_HOST ? `"${process.env.SMTP_HOST}"` : "UNDEFINED");
        console.log("SMTP_PORT:", process.env.SMTP_PORT);
        console.log("SMTP_USER:", process.env.SMTP_USER);
        console.log("SMTP_PASS:", process.env.SMTP_PASS ? "******" : "UNDEFINED");
        console.log("------------------");

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: process.env.CONTACT_EMAIL || "support@aradhanadharmikatrust.org",
            subject: `New Contact Form Submission: ${readableSubject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #D4AF37;">New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${validatedData.name}</p>
                    <p><strong>Email:</strong> ${validatedData.email}</p>
                    <p><strong>Phone:</strong> ${validatedData.phone || "N/A"}</p>
                    <p><strong>Subject:</strong> ${readableSubject}</p>
                    <hr style="border: 1px solid #eee;" />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${validatedData.message}</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: "Email sent successfully!" };
    } catch (error: any) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send email. Please try again later." };
    }
}
