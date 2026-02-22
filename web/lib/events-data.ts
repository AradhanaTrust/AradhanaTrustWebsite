export interface Event {
    id: string;

    title: string;
    titleKn?: string;
    location: string;
    locationKn?: string;
    description: string;
    descriptionKn?: string;
    imageUrl?: string;
    videoUrl?: string;
    isFeatured?: boolean;

    category: 'festival' | 'discourse' | 'community' | 'cultural' | 'educational';
    date: Date | string;
    endDate?: Date | string;
    time: string;
    image: string;
    gallery?: string[];
    registrationOpen: boolean;
    capacity?: number;
    price?: number;
    attendees?: number;
    isUpcoming: boolean;
}

export const events: Event[] = [];
