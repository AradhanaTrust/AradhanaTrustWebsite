import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface MailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: {
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }[];
}

export async function sendEmail({ to, subject, html, attachments }: MailOptions) {
    try {
        const mailOptions = {
            from: `"Aradhana Trust" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            attachments,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}

export const getRegistrationEmailTemplate = (name: string, eventTitle: string, registrationNo: string) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-top: 5px solid #D4AF37;">
        <div style="padding: 30px; background-color: #ffffff;">
            <h1 style="color: #D4AF37; margin-bottom: 20px; font-size: 24px; text-align: center;">Registration Confirmed</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for registering for <strong>${eventTitle}</strong>. Your registration has been successfully received.
            </p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;">Registration Number:</p>
                <p style="margin: 5px 0 0 0; color: #D4AF37; font-size: 20px; font-weight: bold;">${registrationNo}</p>
            </div>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Please find your registration receipt attached to this email. You can present this receipt at the venue for check-in.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.5;">
                This is an automated message. Please do not reply to this email.<br/>
                &copy; Aradhana Trust. All rights reserved.
            </p>
        </div>
    </div>
`;

export const getDonationEmailTemplate = (name: string, amount: number, receiptNo: string) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-top: 5px solid #D4AF37;">
        <div style="padding: 30px; background-color: #ffffff;">
            <h1 style="color: #D4AF37; margin-bottom: 20px; font-size: 24px; text-align: center;">Thank You for Your Donation</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We are deeply grateful for your generous donation of <strong>₹${amount}</strong> to Aradhana Trust. Your support helps us continue our divine initiatives.
            </p>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;">Receipt Number:</p>
                <p style="margin: 5px 0 0 0; color: #D4AF37; font-size: 20px; font-weight: bold;">${receiptNo}</p>
            </div>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Please find your official donation receipt attached to this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.5;">
                This is an automated message. Please do not reply to this email.<br/>
                &copy; Aradhana Trust. All rights reserved.
            </p>
        </div>
    </div>
`;
