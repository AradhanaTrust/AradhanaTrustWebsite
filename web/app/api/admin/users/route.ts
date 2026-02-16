import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                // Do not select password
            },
            orderBy: {
                createdAt: 'asc',
            }
        });

        // Add mock lastLogin if not tracking (auth usually doesn't track strictly without custom logic)
        // For now, we return data as is.
        return NextResponse.json(users);
    } catch (error) {
        console.error("[USERS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "PRIMARY_ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id, name, email, role, password } = body;

        if (!id) {
            return new NextResponse("User ID required", { status: 400 });
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    email,
                    NOT: {
                        id
                    }
                }
            });

            if (existingUser) {
                return new NextResponse("Email already in use", { status: 400 });
            }
        }

        const updateData: any = {
            name: name || undefined,
            email: email || undefined,
            role: role || undefined,
        };

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[USERS_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
