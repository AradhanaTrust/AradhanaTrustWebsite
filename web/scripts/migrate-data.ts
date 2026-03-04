import { PrismaClient as PrismaClientMySQL } from "@prisma/client";
import { PrismaClient as PrismaClientPostgres } from "../prisma/postgres/client";
import "dotenv/config";

async function main() {
    console.log("🚀 Starting Data Migration: PostgreSQL -> MySQL");

    // Explicitly check for ENV variables if not set via $env:
    const sourceUrl = process.env.SOURCE_DATABASE_URL;
    const targetUrl = process.env.TARGET_DATABASE_URL;

    if (!sourceUrl || !targetUrl) {
        console.error("❌ Error: SOURCE_DATABASE_URL or TARGET_DATABASE_URL is missing in environment.");
        process.exit(1);
    }

    console.log("Source:", sourceUrl.split('@')[1] || "Postgres");
    console.log("Target:", targetUrl.split('@')[1] || "MySQL");

    const postgres = new PrismaClientPostgres({
        datasources: { db: { url: sourceUrl } },
    });

    const mysql = new PrismaClientMySQL({
        datasources: { db: { url: targetUrl } },
    });

    try {
        console.log("🔌 Testing source connection...");
        const userCount = await postgres.user.count();
        console.log(`✅ Source connected. Found ${userCount} users.`);

        console.log("🔌 Testing target connection...");
        await mysql.$connect();
        console.log("✅ Target connected.");

        // Priority order to respect FKs
        const models = [
            { name: "User", client: postgres.user, target: mysql.user },
            { name: "Account", client: postgres.account, target: mysql.account },
            { name: "Event", client: postgres.event, target: mysql.event },
            { name: "GalleryImage", client: postgres.galleryImage, target: mysql.galleryImage },
            { name: "DonationActivity", client: postgres.donationActivity, target: mysql.donationActivity },
            { name: "ContactSubmission", client: postgres.contactSubmission, target: mysql.contactSubmission },
            { name: "EventRegistration", client: postgres.eventRegistration, target: mysql.eventRegistration },
            { name: "DonationRecord", client: postgres.donationRecord, target: mysql.donationRecord },
            { name: "PriestRegistration", client: postgres.priestRegistration, target: mysql.priestRegistration }
        ];

        for (const model of models) {
            console.log(`📦 Migrating ${model.name}...`);
            const data = await (model.client as any).findMany();
            if (data.length > 0) {
                // MySQL createMany is efficient
                const result = await (model.target as any).createMany({
                    data: data,
                    skipDuplicates: true
                });
                console.log(`✅ ${model.name}: Migrated ${result.count} rows.`);
            } else {
                console.log(`ℹ️ ${model.name}: No data found.`);
            }
        }

        console.log("\n🎉 Migration completed successfully!");
    } catch (error: any) {
        console.error("❌ Migration failed!");
        console.error(error);
        if (error.code) console.error("Error Code:", error.code);
        if (error.meta) console.error("Error Meta:", error.meta);
    } finally {
        await postgres.$disconnect();
        await mysql.$disconnect();
    }
}

main();
