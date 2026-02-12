
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const events = [
    {
        id: 'ugadi-2026',
        title: 'Ugadi Festival 2026',
        titleKn: 'ಯುಗಾದಿ ಹಬ್ಬ 2026',
        date: new Date('2026-03-19'),
        time: '6:00 AM - 12:00 PM',
        location: 'Main Temple Hall',
        locationKn: 'ಮುಖ್ಯ ದೇವಾಲಯ ಸಭಾಂಗಣ',
        description: 'Join us for the auspicious Ugadi celebration, marking the beginning of the new year.',
        imageUrl: '/assets/events/ugadi.png',
        category: 'festival',
        capacity: 300,
        registrationOpen: true
    },
    {
        id: 'hanuman-jayanti-2026',
        title: 'Hanuman Jayanti 2026',
        titleKn: 'ಹನುಮಾನ್ ಜಯಂತಿ 2026',
        date: new Date('2026-04-02'),
        time: '5:00 AM - 9:00 PM',
        location: 'Hanuman Temple',
        locationKn: 'ಹನುಮಾನ್ ದೇವಾಲಯ',
        description: 'Celebrate the birth of Lord Hanuman with special poojas and chantings.',
        imageUrl: '/assets/events/hanuman.png',
        category: 'festival',
        capacity: 400,
        registrationOpen: true
    },
    {
        id: 'ganesh-chaturthi-2026',
        title: 'Ganesh Chaturthi 2026',
        titleKn: 'ಗಣೇಶ ಚತುರ್ಥಿ 2026',
        date: new Date('2026-09-14'),
        time: '7:00 AM - 10:00 PM',
        location: 'Main Hall',
        locationKn: 'ಮುಖ್ಯ ಸಭಾಂಗಣ',
        description: 'Grand celebration of Ganesha Chaturthi with clay idol installation.',
        imageUrl: '/assets/events/ganesh.png',
        category: 'festival',
        capacity: 600,
        registrationOpen: true
    },
    {
        id: 'dasara-2026',
        title: 'Dasara 2026',
        titleKn: 'ದಸರಾ 2026',
        date: new Date('2026-10-11'),
        time: '6:00 AM - 9:00 PM (Daily)',
        location: 'Temple Premises',
        locationKn: 'ದೇವಾಲಯದ ಆವರಣ',
        description: 'Ten days of Navaratri celebrations culminating in Vijayadashami.',
        imageUrl: '/assets/events/dasara.png',
        category: 'festival',
        capacity: 800,
        registrationOpen: true
    },
    {
        id: 'deepavali-2026',
        title: 'Deepavali 2026',
        titleKn: 'ದೀಪಾವಳಿ 2026',
        date: new Date('2026-11-08'),
        time: '4:00 AM - 10:00 PM',
        location: 'Temple Complex',
        locationKn: 'ದೇವಾಲಯ ಸಮುಚ್ಛಯ',
        description: 'The festival of lights, celebrated with thousands of lamps.',
        imageUrl: '/assets/events/deepavali.png',
        category: 'festival',
        capacity: 700,
        registrationOpen: true
    },
    {
        id: 'rama-navami-2025',
        title: 'Rama Navami 2025',
        titleKn: 'ರಾಮ ನವಮಿ 2025',
        date: new Date('2025-04-06'),
        time: '6:00 AM - 8:00 PM',
        location: 'Main Temple',
        locationKn: 'ಮುಖ್ಯ ದೇವಾಲಯ',
        description: 'Sri Rama Navami celebrations with Sita Rama Kalyanam.',
        imageUrl: '/assets/events/rama-navami.png',
        category: 'festival',
        capacity: 500,
        registrationOpen: false
    },
    {
        id: 'shivaratri-2025',
        title: 'Maha Shivaratri 2025',
        titleKn: 'ಮಹಾ ಶಿವರಾತ್ರಿ 2025',
        date: new Date('2025-02-26'),
        time: '6:00 PM - 6:00 AM',
        location: 'Shiva Mandap',
        locationKn: 'ಶಿವ ಮಂಟಪ',
        description: 'Night-long vigil and worship of Lord Shiva.',
        imageUrl: '/assets/events/shivaratri.png',
        category: 'festival',
        capacity: 600,
        registrationOpen: false
    }
];

async function main() {
    console.log("Seeding events...");

    for (const e of events) {
        console.log(`Upserting: ${e.title}`);

        await prisma.event.upsert({
            where: { id: e.id },
            update: {
                title: e.title,
                titleKn: e.titleKn,
                date: e.date,
                time: e.time,
                location: e.location,
                locationKn: e.locationKn,
                description: e.description,
                imageUrl: e.imageUrl,
                category: e.category,
                capacity: e.capacity,
                registrationOpen: e.registrationOpen
            },
            create: {
                id: e.id,
                title: e.title,
                titleKn: e.titleKn,
                date: e.date,
                time: e.time,
                location: e.location,
                locationKn: e.locationKn,
                description: e.description,
                imageUrl: e.imageUrl,
                category: e.category,
                capacity: e.capacity,
                registrationOpen: e.registrationOpen
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
