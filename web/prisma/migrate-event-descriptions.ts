import { PrismaClient } from '@prisma/client';
import { translations } from '../lib/translations';

const prisma = new PrismaClient();

function getNestedValue(obj: any, path: string): any {
    if (!path) return undefined;
    return path.split('.').reduce((current, part) => current?.[part], obj);
}

const eventMapping: Record<string, string> = {
    'ugadi-2026': 'ugadi2026',
    'hanuman-jayanti-2026': 'hanuman2026',
    'ganesh-chaturthi-2026': 'ganesh2026',
    'dasara-2026': 'dasara2026',
};

async function main() {
    const events = await prisma.event.findMany();

    for (const e of events) {
        let baseId = eventMapping[e.id];
        if (!baseId) continue;

        // Build English Description
        const enT = (translations.en as any).eventContent;
        const enDesc = e.description || getNestedValue(enT, `${baseId}.description`);
        const enLongDesc = getNestedValue(enT, `${baseId}.longDescription`);

        // Look up speaker by following the key in speakers object if applicable
        const enSpeakerRaw = getNestedValue(enT, `${baseId}.speaker`);
        const enSpeaker = enSpeakerRaw ? (getNestedValue(enT, `speakers.${enSpeakerRaw.split('.').pop()}`) || enSpeakerRaw) : null;

        const enAgenda = getNestedValue(enT, `${baseId}.agenda`);

        let finalEnDesc = enDesc;
        if (enLongDesc) finalEnDesc += `\n\n${enLongDesc}`;
        if (enSpeaker) finalEnDesc += `\n\n🎤 Speaker: ${enSpeaker}`;
        if (enAgenda && Array.isArray(enAgenda)) {
            finalEnDesc += `\n\n📅 Event Schedule:\n` + enAgenda.map((item: any) => `• ${item.time} - ${item.activity}`).join('\n');
        }

        // Build Kannada Description
        const knT = (translations.kn as any).eventContent;
        const knDesc = e.descriptionKn || getNestedValue(knT, `${baseId}.description`) || enDesc;
        const knLongDesc = getNestedValue(knT, `${baseId}.longDescription`);

        const knSpeakerRaw = getNestedValue(knT, `${baseId}.speaker`);
        const knSpeaker = knSpeakerRaw ? (getNestedValue(knT, `speakers.${knSpeakerRaw.split('.').pop()}`) || knSpeakerRaw) : null;

        const knAgenda = getNestedValue(knT, `${baseId}.agenda`);

        let finalKnDesc = knDesc;
        if (knLongDesc) finalKnDesc += `\n\n${knLongDesc}`;
        if (knSpeaker) finalKnDesc += `\n\n🎤 ಭಾಷಣಕಾರರು: ${knSpeaker}`;
        if (knAgenda && Array.isArray(knAgenda)) {
            finalKnDesc += `\n\n📅 ಕಾರ್ಯಕ್ರಮದ ವೇಳಾಪಟ್ಟಿ:\n` + knAgenda.map((item: any) => `• ${item.time} - ${item.activity}`).join('\n');
        }

        await prisma.event.update({
            where: { id: e.id },
            data: {
                description: finalEnDesc,
                descriptionKn: finalKnDesc
            }
        });

        console.log(`Updated event: ${e.id}`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
