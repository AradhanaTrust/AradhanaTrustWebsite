import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validating required fields
        if (!data.fullName || !data.phoneNumber) {
            return NextResponse.json(
                { error: "Full Name and Phone Number are strictly required." },
                { status: 400 }
            );
        }

        // Creating the PriestRegistration record explicitly mapped from the payload
        const priestRegistration = await prisma.priestRegistration.create({
            data: {
                fullName: data.fullName,
                email: data.email || null,
                phoneNumber: data.phoneNumber,
                whatsappNumber: data.whatsappNumber || null,
                gothram: data.gothram || null,
                vedicTradition: data.vedicTradition || null,
                experienceYears: data.experienceYears ? parseInt(data.experienceYears) : null,
                currentTemple: data.currentTemple || null,
                specialization: data.specialization || null,
                address: data.address || null,
                status: "CANDIDATE", // Always default to candidate on public submission
            },
        });

        return NextResponse.json(priestRegistration, { status: 201 });
    } catch (error) {
        console.error("Error creating Priest Registration:", error);
        return NextResponse.json(
            { error: "Failed to submit Priest Registration application." },
            { status: 500 }
        );
    }
}
