
import { prisma } from '../lib/prisma';
import { put } from '../lib/storage';
import { join } from 'path';
import { writeFile } from 'fs/promises';

async function migrateImages() {
    const isDryRun = process.argv.includes('--dry-run');
    if (isDryRun) {
        console.log('DRY RUN: No database changes will be made.');
    }

    console.log('Starting image migration from Vercel Blob to local storage...');

    const models = [
        { name: 'galleryImage', field: 'imageUrl' },
        { name: 'event', field: 'imageUrl' },
        { name: 'donationActivity', field: 'imageUrl' }
    ];

    for (const model of models) {
        console.log(`Processing model: ${model.name}`);
        const records = await (prisma as any)[model.name].findMany({
            where: {
                [model.field]: {
                    contains: 'public.blob.vercel-storage.com'
                }
            }
        });

        console.log(`Found ${records.length} records to migrate for ${model.name}`);

        for (const record of records) {
            const remoteUrl = record[model.field];
            try {
                const response = await fetch(remoteUrl);
                if (!response.ok) throw new Error(`Failed to fetch ${remoteUrl}`);

                const buffer = Buffer.from(await response.arrayBuffer());
                const filename = remoteUrl.split('/').pop()?.split('?')[0] || `image-${Date.now()}.jpg`;

                // Store locally using our storage utility
                let result = { url: remoteUrl };
                if (!isDryRun) {
                    result = await put(filename, buffer);
                } else {
                    console.log(`[DRY RUN] Would save: ${filename}`);
                }

                // Update database with local relative path
                if (!isDryRun) {
                    await (prisma as any)[model.name].update({
                        where: { id: record.id },
                        data: { [model.field]: result.url }
                    });
                    console.log(`✓ Migrated: ${filename}`);
                } else {
                    console.log(`[DRY RUN] Would update ${model.name} record ${record.id} with ${result.url}`);
                }
            } catch (error: any) {
                console.error(`✗ Failed to migrate ${remoteUrl}:`, error.message);
            }
        }
    }

    console.log('Image migration complete.');
}

migrateImages()
    .catch(err => {
        console.error('Migration failed:', err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
