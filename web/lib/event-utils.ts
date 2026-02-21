import type { Event } from "@/lib/events-data";

type Language = 'en' | 'kn';

export function getCategoryName(category: string, language: Language): string {
    const categoryTranslations = {
        en: {
            festival: 'Festival',
            discourse: 'Discourse',
            community: 'Community',
            cultural: 'Cultural',
            educational: 'Educational'
        },
        kn: {
            festival: 'ಹಬ್ಬ',
            discourse: 'ಪ್ರವಚನ',
            community: 'ಸಮುದಾಯ',
            cultural: 'ಸಾಂಸ್ಕೃತಿಕ',
            educational: 'ಶೈಕ್ಷಣಿಕ'
        }
    };

    const dict = categoryTranslations[language];
    return (dict && dict[category as keyof typeof dict]) ? dict[category as keyof typeof dict] : category;
}

export function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        festival: '#D4AF37', // Gold
        discourse: '#8B5E3C', // Brown
        community: '#4A6B53', // Green
        cultural: '#8C3A3A',  // Red/Maroon
        educational: '#4A5B7A' // Blue
    };
    return colors[category] || '#D4AF37';
}

export function getEventTranslation(event: Event, language: Language) {
    const title = language === 'kn' ? (event.titleKn || event.title || "") : (event.title || "");
    const location = language === 'kn' ? (event.locationKn || event.location || "") : (event.location || "");
    const description = language === 'kn' ? (event.descriptionKn || event.description || "") : (event.description || "");

    return {
        title,
        location,
        description,
        longDescription: undefined,
        speaker: undefined,
        agenda: undefined
    };
}
