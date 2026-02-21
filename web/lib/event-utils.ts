import { Event } from './events-data';
import { translations } from './translations';

type Language = 'en' | 'kn';

/**
 * Helper to access nested object properties via dot notation
 * e.g., getNestedValue(obj, 'ugadi2026.title')
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => current?.[part], obj);
}

/**
 * Get translated content for an event based on current language
 */
export function getEventTranslation(event: Event, language: Language) {
    const t = translations[language].eventContent;

    const title = language === 'kn' ? (event.titleKn || event.title || "") : (event.title || "");
    const location = language === 'kn' ? (event.locationKn || event.location || "") : (event.location || "");
    const description = language === 'kn' ? (event.descriptionKn || event.description || "") : (event.description || "");

    // For static seeded events, we still want to grab their localized strings if the DB doesn't have them
    // However, we just merged these to the DB via migration, so the DB fields SHOULD be populated.
    // As a strict fallback, we can still resolve keys just in case.
    const resolvedTitle = title || (event.titleKey ? getNestedValue(t, event.titleKey) : "");
    const resolvedLocation = location || (event.locationKey ? getNestedValue(t, event.locationKey) : "");
    const resolvedDesc = description || (event.descriptionKey ? getNestedValue(t, event.descriptionKey) : "");

    return {
        title: resolvedTitle,
        location: resolvedLocation,
        description: resolvedDesc,
        longDescription: undefined,
        speaker: undefined,
        agenda: undefined
    };
}

/**
 * Get category display name in current language
 */
export function getCategoryName(category: string, language: Language): string {
    const categoryTranslations = {
        en: {
            festival: 'Festival',
            discourse: 'Discourse',
            community: 'Community Service',
            cultural: 'Cultural',
            educational: 'Educational'
        },
        kn: {
            festival: 'ಹಬ್ಬ',
            discourse: 'ಪ್ರವಚನ',
            community: 'ಸಮುದಾಯ ಸೇವೆ',
            cultural: 'ಸಾಂಸ್ಕೃತಿಕ',
            educational: 'ಶೈಕ್ಷಣಿಕ'
        }
    };

    return categoryTranslations[language]?.[category as keyof typeof categoryTranslations['en']] || category;
}

/**
 * Get category color for styling
 */
export function getCategoryColor(category: string): string {
    const colors = {
        festival: '#FF6B35',
        discourse: '#4ECDC4',
        community: '#95E1D3',
        cultural: '#F38181',
        educational: '#AA96DA'
    };
    return colors[category as keyof typeof colors] || '#CFA14E';
}
