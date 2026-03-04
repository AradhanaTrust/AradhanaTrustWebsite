
import { prisma } from './lib/prisma';
import * as fs from 'fs';

async function checkImageUrls() {
    try {
        const report = {
            gallery: await prisma.galleryImage.findMany({ select: { id: true, title: true, imageUrl: true } }),
            events: await prisma.event.findMany({ select: { id: true, title: true, imageUrl: true } }),
            activities: await prisma.donationActivity.findMany({ select: { id: true, title: true, imageUrl: true } })
        };
        fs.writeFileSync('image-report.json', JSON.stringify(report, null, 2));
        console.log('Report written to image-report.json');
    } catch (error) {
        console.error('Error checking images:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkImageUrls();
