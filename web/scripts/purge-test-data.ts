import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Purging test data...')

    // Delete in order of dependency
    const deletedDonationRecords = await prisma.donationRecord.deleteMany({})
    console.log(`Deleted ${deletedDonationRecords.count} donation records.`)

    const deletedRegistrations = await prisma.eventRegistration.deleteMany({})
    console.log(`Deleted ${deletedRegistrations.count} event registrations.`)

    const deletedDonations = await prisma.donation.deleteMany({})
    console.log(`Deleted ${deletedDonations.count} general donations.`)

    console.log('Purge complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
