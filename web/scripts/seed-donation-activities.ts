import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Donation Activities...");

    const activity = await prisma.donationActivity.create({
        data: {
            title: "Sri Krishna Temple Construction",
            titleKn: "ಶ್ರೀ ಕೃಷ್ಣ ದೇವಾಲಯ ನಿರ್ಮಾಣ",
            description: "Join us in the divine endeavor of constructing a magnificent new Sri Krishna Temple. This architectural marvel will serve as a spiritual oasis, offering a serene atmosphere for devotion, meditation, and cultural gatherings. Your generous contributions will directly fund the intricately carved stone pillars, the majestic garbhagriha (sanctum sanctorum), and the expansive satsang hall designed to accommodate thousands of devotees. Every brick laid is a step towards preserving our rich heritage for generations to come. Be a part of this historic legacy.",
            descriptionKn: "ಒಂದು ಭವ್ಯವಾದ ಹೊಸ ಶ್ರೀ ಕೃಷ್ಣ ದೇವಾಲಯವನ್ನು ನಿರ್ಮಿಸುವ ದೈವಿಕ ಪ್ರಯತ್ನದಲ್ಲಿ ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ. ಈ ವಾಸ್ತುಶಿಲ್ಪದ ಅದ್ಭುತವು ಭಕ್ತಿ, ಧ್ಯಾನ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳಿಗೆ ಪ್ರಶಾಂತ ವಾತಾವರಣವನ್ನು ನೀಡುವ ಆಧ್ಯಾತ್ಮಿಕ ತಾಣವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ನಿಮ್ಮ ಉದಾರ ದೇಣಿಗೆಗಳು ಸಂಕೀರ್ಣವಾಗಿ ಕೆತ್ತಿದ ಕಲ್ಲಿನ ಕಂಬಗಳು, ಭವ್ಯವಾದ ಗರ್ಭಗುಡಿ ಮತ್ತು ಸಾವಿರಾರು ಭಕ್ತರಿಗೆ ಅವಕಾಶ ಕಲ್ಪಿಸಲು ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ವಿಸ್ತಾರವಾದ ಸತ್ಸಂಗ ಭವನಕ್ಕೆ ನೇರವಾಗಿ ನಿಧಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ. ಹಾಕಿದ ಪ್ರತಿಯೊಂದು ಇಟ್ಟಿಗೆಯೂ ಮುಂದಿನ ಪೀಳಿಗೆಗೆ ನಮ್ಮ ಶ್ರೀಮಂತ ಪರಂಪರೆಯನ್ನು ಸಂರಕ್ಷಿಸುವತ್ತ ಒಂದು ಹೆಜ್ಜೆಯಾಗಿದೆ. ಈ ಐತಿಹಾಸಿಕ ಪರಂಪರೆಯ ಭಾಗವಾಗಿರಿ.",
            videoUrl: "https://www.youtube.com/watch?v=1F3hm6MfR1k", // Example beautiful temple video
            imageUrl: "",
            isActive: true,
            order: 1
        }
    });

    console.log(`Created Activity: ${activity.title} with ID: ${activity.id}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
