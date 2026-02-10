
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
    {
        id: 'ugadi-2026',
        titleKey: 'ugadi2026.title',
        date: new Date('2026-03-19'),
        locationKey: 'locations.mainTemple',
        descriptionKey: 'ugadi2026.description',
        image: '/assets/events/ugadi.png',
    },
    {
        id: 'hanuman-jayanti-2026',
        titleKey: 'hanuman2026.title',
        date: new Date('2026-04-02'),
        locationKey: 'locations.hanumanTemple',
        descriptionKey: 'hanuman2026.description',
        image: '/assets/events/hanuman.png',
    },
    {
        id: 'ganesh-chaturthi-2026',
        titleKey: 'ganesh2026.title',
        date: new Date('2026-09-14'),
        locationKey: 'locations.mainHall',
        descriptionKey: 'ganesh2026.description',
        image: '/assets/events/ganesh.png',
    },
    {
        id: 'dasara-2026',
        titleKey: 'dasara2026.title',
        date: new Date('2026-10-11'),
        locationKey: 'locations.templePremises',
        descriptionKey: 'dasara2026.description',
        image: '/assets/events/dasara.png',
    },
    {
        id: 'deepavali-2026',
        titleKey: 'deepavali2026.title',
        date: new Date('2026-11-08'),
        locationKey: 'locations.templeComplex',
        descriptionKey: 'deepavali2026.description',
        image: '/assets/events/deepavali.png',
    },
    {
        id: 'rama-navami-2025',
        titleKey: 'ramaNavami2025.title',
        date: new Date('2025-04-06'),
        locationKey: 'locations.mainTemple',
        descriptionKey: 'ramaNavami2025.description',
        image: '/assets/events/rama-navami.png',
    },
    {
        id: 'shivaratri-2025',
        titleKey: 'shivaratri2025.title',
        date: new Date('2025-02-26'),
        locationKey: 'locations.shivaMandap',
        descriptionKey: 'shivaratri2025.description',
        image: '/assets/events/shivaratri.png',
    }
];

function formatTitle(key: string) {
    const base = key.split('.')[0];
    // Add spaces before capitals
    const spaced = base.replace(/([A-Z])/g, ' $1').trim();
    // Capitalize first letter
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatLocation(key: string) {
    return key.replace('locations.', '').replace(/([A-Z])/g, ' $1').trim();
}

async function main() {
    console.log("Seeding events...");

    for (const e of events) {
        const title = formatTitle(e.titleKey);
        const location = formatLocation(e.locationKey);

        console.log(`Upserting: ${title}`);

        await prisma.event.upsert({
            where: { id: e.id },
            update: {
                title,
                date: e.date,
                location,
                description: e.descriptionKey, // Using key as desc for now
                imageUrl: e.image
            },
            create: {
                id: e.id,
                title,
                date: e.date,
                location,
                description: e.descriptionKey,
                imageUrl: e.image
            }
        });
    }

    console.log("Seeding complete.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
