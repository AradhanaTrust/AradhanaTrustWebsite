import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const data = await req.json();
        const { name, email, phone, photo, currentPassword, newPassword } = data;

        // update basic profile
        if (name || email || phone || photo) {

            // Check if email is being changed and if it's already taken
            if (email && email !== session.user.email) {
                const existingUser = await prisma.user.findUnique({
                    where: { email },
                });
                if (existingUser) {
                    return new NextResponse("Email already in use", { status: 400 });
                }
            }

            await prisma.user.update({
                where: { email: session.user.email },
                data: {
                    name: name || undefined,
                    email: email || undefined,
                    phone: phone || undefined,
                    image: photo || undefined,
                },
            });
        }

        // Update password if provided
        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            if (!user || !user.password) {
                return new NextResponse("User not found", { status: 404 });
            }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return new NextResponse("Invalid current password", { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { email: session.user.email },
                data: {
                    password: hashedPassword,
                },
            });
        }

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("[PROFILE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
