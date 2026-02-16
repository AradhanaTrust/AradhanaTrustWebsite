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

    const title = event.titleKey ? (getNestedValue(t, event.titleKey) || event.titleKey) : (language === 'kn' ? event.titleKn || event.title : event.title);
    const location = event.locationKey ? (getNestedValue(t, event.locationKey) || event.locationKey) : (language === 'kn' ? event.locationKn || event.location : event.location);
    const description = event.descriptionKey ? (getNestedValue(t, event.descriptionKey) || event.descriptionKey) : (language === 'kn' ? event.descriptionKn || event.description : event.description);

    return {
        title,
        location,
        description,
        longDescription: event.longDescriptionKey ? getNestedValue(t, event.longDescriptionKey) : undefined,
        speaker: event.speakerKey ? getNestedValue(t, event.speakerKey) : undefined,
        agenda: event.agendaKey ? getNestedValue(t, event.agendaKey) : undefined
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
