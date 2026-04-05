import { prisma } from "@/lib/prisma";

export async function generateStandardId(prefix: 'REG' | 'RCT'): Promise<string> {
    const date = new Date();
    // Get date string (e.g. 20260405)
    const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    
    // Determine the boundaries of today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

    let count = 0;
    
    // Count existing records created today for the corresponding prefix
    if (prefix === 'REG') {
        count = await prisma.eventRegistration.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    } else if (prefix === 'RCT') {
        count = await prisma.donationRecord.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }

    // Sequence starting from 1 (e.g. 0 records -> 1)
    const sequenceNumber = count + 1;
    
    // Pad to 4 digits (0001), but it naturally scales beyond 9999 to 10000+
    const formattedSequence = sequenceNumber.toString().padStart(4, '0');

    return `${prefix}-${dateStr}-${formattedSequence}`;
}
