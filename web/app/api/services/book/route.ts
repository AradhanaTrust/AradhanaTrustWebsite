import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validating required fields
        if (!data.fullName || !data.phoneNumber || !data.ritualType) {
            return NextResponse.json(
                { error: "Full Name, Phone Number, and Ritual Type are required." },
                { status: 400 }
            );
        }

        // Creating the ServiceRequest record
        const serviceRequest = await prisma.serviceRequest.create({
            data: {
                fullName: data.fullName,
                email: data.email || null,
                phoneNumber: data.phoneNumber,
                ritualType: data.ritualType,
                preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
                additionalInfo: data.additionalInfo || null,
                status: "PENDING",
            },
        });
        
        // Send acknowledgment email if email is provided
        if (serviceRequest.email) {
            try {
                await sendEmail({
                    to: serviceRequest.email,
                    subject: "Ritual Booking Request Received - Aradhana Trust",
                    html: `
                        <div style="font-family: serif; padding: 20px; color: #5D4037;">
                            <h2 style="color: #D4AF37;">Namaskaram ${serviceRequest.fullName},</h2>
                            <p>We have received your request for <strong>${serviceRequest.ritualType}</strong>.</p>
                            <p>Our temple office will review the details and contact you within 24 hours to confirm the availability and discuss further details.</p>
                            <hr style="border: 0; border-top: 1px solid #CFA14E; margin: 20px 0;" />
                            <p style="font-size: 0.9em; font-style: italic;">"Nurturing our heritage, promoting spiritual values."</p>
                            <p><strong>Aradhana Dharmika Trust</strong></p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Failed to send acknowledgment email:", emailError);
            }
        }

        return NextResponse.json(serviceRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating Service Request:", error);
        return NextResponse.json(
            { error: "Failed to submit booking request." },
            { status: 500 }
        );
    }
}
