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

export const getPriestRegistrationSubmitTemplate = (name: string) => `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-top: 5px solid #1B4332;">
        <div style="padding: 30px; background-color: #ffffff;">
            <h1 style="color: #1B4332; margin-bottom: 20px; font-size: 24px; text-align: center;">Registration Received</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Namaskaram <strong>Sri ${name}</strong>,</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for expressing your interest in offering divine services at Aradhana Trust. Your registration details have been successfully received and are currently under review by our temple trust committee.
            </p>
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #1B4332;">
                <p style="margin: 0; color: #1B4332; font-size: 15px; font-weight: 500;">
                    Our team will contact you soon for further discussions regarding your application. 
                </p>
            </div>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                We appreciate your devotion and willingness to serve.
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.5;">
                This is an automated message. Please do not reply to this email.<br/>
                &copy; Aradhana Trust. All rights reserved.
            </p>
        </div>
    </div>
`;

export const getPriestRegistrationUpdateTemplate = (name: string, status: string) => {
    const isSelected = status === "SELECTED";
    const statusText = isSelected ? "successfully selected" : "not processed further at this time";
    const color = isSelected ? "#1B4332" : "#991B1B";
    const bgColor = isSelected ? "#f0fdf4" : "#fef2f2";

    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-top: 5px solid ${color};">
        <div style="padding: 30px; background-color: #ffffff;">
            <h1 style="color: ${color}; margin-bottom: 20px; font-size: 24px; text-align: center;">Application Status Update</h1>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">Namaskaram <strong>Sri ${name}</strong>,</p>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                This is regarding your application for offering divine services at Aradhana Trust.
            </p>
            <div style="background-color: ${bgColor}; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${color};">
                <p style="margin: 0; color: ${color}; font-size: 16px; font-weight: bold;">
                    Your application has been ${statusText}.
                </p>
            </div>
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
                ${isSelected 
                    ? "Our committee will reach out to you shortly with the next steps and traditional guidelines."
                    : "We thank you for your interest and wish you the very best in your spiritual journey."}
            </p>
            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
            <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.5;">
                This is an automated message. Please do not reply to this email.<br/>
                &copy; Aradhana Trust. All rights reserved.
            </p>
        </div>
    </div>
    `;
};
