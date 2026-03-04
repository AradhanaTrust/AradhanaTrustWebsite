
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
    const report: any = {
        timestamp: new Date().toISOString(),
        status: "UP",
        checks: {}
    };

    // 1. Check Database
    try {
        await prisma.$queryRaw`SELECT 1`;
        report.checks.database = "CONNECTED";
    } catch (error: any) {
        report.status = "DOWN"; // Database is critical
        report.checks.database = `ERROR: ${error.message}`;
    }

    // 2. Check Storage Permissions
    try {
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        report.checks.storage_dir = uploadDir;
        report.checks.storage_exists = existsSync(uploadDir);
    } catch (error: any) {
        report.checks.storage = `ERROR: ${error.message}`;
    }

    // 3. Check Environment Variables (subset)
    report.checks.env_vars = {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "SET" : "MISSING",
        DATABASE_URL: process.env.DATABASE_URL ? "SET" : "MISSING",
        NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? "SET" : "MISSING",
    };

    return NextResponse.json(report, { status: report.status === "UP" ? 200 : 500 });
}
