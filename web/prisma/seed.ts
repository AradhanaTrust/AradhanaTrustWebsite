import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌟 Seeding database...');

    // Hash passwords
    const primaryAdminPassword = await bcrypt.hash('Admin@2026', 10);
    const secondaryAdminPassword = await bcrypt.hash('Events@2026', 10);

    // Create Primary Admin
    const primaryAdmin = await prisma.user.upsert({
        where: { email: 'admin@aradhanatrust.org' },
        update: {},
        create: {
            email: 'admin@aradhanatrust.org',
            name: 'Primary Administrator',
            password: primaryAdminPassword,
            role: 'PRIMARY_ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created Primary Admin:', primaryAdmin.email);

    // Create Secondary Admin
    const secondaryAdmin = await prisma.user.upsert({
        where: { email: 'events@aradhanatrust.org' },
        update: {},
        create: {
            email: 'events@aradhanatrust.org',
            name: 'Events Coordinator',
            password: secondaryAdminPassword,
            role: 'SECONDARY_ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created Secondary Admin:', secondaryAdmin.email);

    // Create sample donation records
    const donations = [
        {
            donorName: 'Ramesh Kumar',
            email: 'ramesh@example.com',
            phone: '+91 98765 43210',
            amount: 5000,
            category: 'Annadanam',
            method: 'UPI',
            receiptNo: 'ADT-2026-001',
            panNumber: 'ABCDE1234F',
        },
        {
            donorName: 'Lakshmi Devi',
            email: 'lakshmi@example.com',
            amount: 10000,
            category: 'Temple',
            method: 'Card',
            receiptNo: 'ADT-2026-002',
            panNumber: 'FGHIJ5678K',
        },
        {
            donorName: 'Venkatesh Bhat',
            phone: '+91 98765 43211',
            amount: 2500,
            category: 'Education',
            method: 'Cash',
            receiptNo: 'ADT-2026-003',
        },
        {
            donorName: 'Ananya Sharma',
            email: 'ananya@example.com',
            amount: 15000,
            category: 'Cultural',
            method: 'UPI',
            receiptNo: 'ADT-2026-004',
            frequency: 'monthly',
            panNumber: 'LMNOP9012Q',
        },
        {
            donorName: 'Krishna Murthy',
            email: 'krishna@example.com',
            phone: '+91 98765 43212',
            amount: 7500,
            category: 'Gauseva',
            method: 'Cheque',
            receiptNo: 'ADT-2026-005',
        },
    ];

    for (const donation of donations) {
        await prisma.donationRecord.create({ data: donation });
    }

    console.log(`✅ Created ${donations.length} sample donation records`);

    // Create sample event registrations
    const registrations = [
        {
            eventId: 'ugadi-2026',
            eventTitle: 'Ugadi - Kannada New Year',
            name: 'Rajesh Rao',
            email: 'rajesh@example.com',
            phone: '+91 98765 43213',
            attendees: 3,
        },
        {
            eventId: 'ugadi-2026',
            eventTitle: 'Ugadi - Kannada New Year',
            name: 'Priya Nair',
            email: 'priya@example.com',
            attendees: 2,
        },
        {
            eventId: 'hanuman-jayanti-2026',
            eventTitle: 'Hanuman Jayanti',
            name: 'Suresh Reddy',
            email: 'suresh@example.com',
            phone: '+91 98765 43214',
            attendees: 1,
            status: 'confirmed',
        },
        {
            eventId: 'ganesh-chaturthi-2026',
            eventTitle: 'Ganesh Chaturthi',
            name: 'Meera Iyer',
            email: 'meera@example.com',
            attendees: 4,
        },
    ];

    for (const registration of registrations) {
        await prisma.eventRegistration.create({ data: registration });
    }

    console.log(`✅ Created ${registrations.length} sample event registrations`);

    // Create sample contact submissions
    const contacts = [
        {
            name: 'Arvind Singh',
            email: 'arvind@example.com',
            phone: '+91 98765 43215',
            subject: 'Puja Booking',
            message: 'I would like to book Ganesh Puja for my new home inauguration.',
        },
        {
            name: 'Divya Patel',
            email: 'divya@example.com',
            subject: 'Donation Query',
            message: 'How can I set up monthly donations? Is 80G certificate automatically generated?',
            status: 'in-progress',
            response: 'Thank you for your interest. You can set up monthly donations through our website. 80G certificates are generated automatically.',
        },
    ];

    for (const contact of contacts) {
        await prisma.contactSubmission.create({ data: contact });
    }

    console.log(`✅ Created ${contacts.length} sample contact submissions`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('Primary Admin: admin@aradhanatrust.org / Admin@2026');
    console.log('Secondary Admin: events@aradhanatrust.org / Events@2026');
    console.log('\n⚠️  IMPORTANT: Change these passwords in production!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
