export interface Event {
    id: string;
    // Static Data Keys
    titleKey?: string;
    locationKey?: string;
    descriptionKey?: string;
    longDescriptionKey?: string;
    speakerKey?: string;
    agendaKey?: string;

    // Dynamic Data Fields
    title?: string;
    titleKn?: string;
    location?: string;
    locationKn?: string;
    description?: string;
    descriptionKn?: string;
    imageUrl?: string; // DB uses imageUrl, static uses image. We can normalise this.

    category: 'festival' | 'discourse' | 'community' | 'cultural' | 'educational';
    date: Date | string; // DB returns ISO string
    endDate?: Date | string;
    time: string;
    image: string; // We will ensure this is populated
    gallery?: string[];
    registrationOpen: boolean;
    capacity?: number;
    attendees?: number;
    isUpcoming: boolean;
}

export const events: Event[] = [
    // Upcoming Events (2026) - Ordered from nearest to farthest
    {
        id: 'ugadi-2026',
        titleKey: 'ugadi2026.title',
        category: 'festival',
        date: new Date('2026-03-19'),
        time: '6:00 AM - 12:00 PM',
        locationKey: 'locations.mainTemple',
        descriptionKey: 'ugadi2026.description',
        longDescriptionKey: 'ugadi2026.longDescription',
        image: '/assets/events/ugadi.png',
        speakerKey: 'speakers.panditVenkatesh',
        agendaKey: 'ugadi2026.agenda',
        registrationOpen: true,
        capacity: 300,
        attendees: 142,
        isUpcoming: true
    },
    {
        id: 'hanuman-jayanti-2026',
        titleKey: 'hanuman2026.title',
        category: 'festival',
        date: new Date('2026-04-02'),
        time: '5:00 AM - 9:00 PM',
        locationKey: 'locations.hanumanTemple',
        descriptionKey: 'hanuman2026.description',
        longDescriptionKey: 'hanuman2026.longDescription',
        image: '/assets/events/hanuman.png',
        speakerKey: 'speakers.anjaneya',
        agendaKey: 'hanuman2026.agenda',
        registrationOpen: true,
        capacity: 400,
        attendees: 187,
        isUpcoming: true
    },
    {
        id: 'ganesh-chaturthi-2026',
        titleKey: 'ganesh2026.title',
        category: 'festival',
        date: new Date('2026-09-14'),
        time: '7:00 AM - 10:00 PM',
        locationKey: 'locations.mainHall',
        descriptionKey: 'ganesh2026.description',
        longDescriptionKey: 'ganesh2026.longDescription',
        image: '/assets/events/ganesh.png',
        speakerKey: 'speakers.ganapatiSharma',
        agendaKey: 'ganesh2026.agenda',
        registrationOpen: true,
        capacity: 600,
        attendees: 324,
        isUpcoming: true
    },
    {
        id: 'dasara-2026',
        titleKey: 'dasara2026.title',
        category: 'festival',
        date: new Date('2026-10-11'),
        endDate: new Date('2026-10-20'),
        time: '6:00 AM - 9:00 PM (Daily)',
        locationKey: 'locations.templePremises',
        descriptionKey: 'dasara2026.description',
        longDescriptionKey: 'dasara2026.longDescription',
        image: '/assets/events/dasara.png',
        speakerKey: 'speakers.multiple',
        agendaKey: 'dasara2026.agenda',
        registrationOpen: true,
        capacity: 800,
        attendees: 456,
        isUpcoming: true
    },
    {
        id: 'deepavali-2026',
        titleKey: 'deepavali2026.title',
        category: 'festival',
        date: new Date('2026-11-08'),
        time: '4:00 AM - 10:00 PM',
        locationKey: 'locations.templeComplex',
        descriptionKey: 'deepavali2026.description',
        longDescriptionKey: 'deepavali2026.longDescription',
        image: '/assets/events/deepavali.png',
        speakerKey: 'speakers.lakshmiPrasad',
        agendaKey: 'deepavali2026.agenda',
        registrationOpen: true,
        capacity: 700,
        attendees: 521,
        isUpcoming: true
    },

    // Past Events (2025)
    {
        id: 'rama-navami-2025',
        titleKey: 'ramaNavami2025.title',
        category: 'festival',
        date: new Date('2025-04-06'),
        time: '6:00 AM - 8:00 PM',
        locationKey: 'locations.mainTemple',
        descriptionKey: 'ramaNavami2025.description',
        longDescriptionKey: 'ramaNavami2025.longDescription',
        image: '/assets/events/rama-navami.png',
        speakerKey: 'speakers.raghavendra',
        agendaKey: 'ramaNavami2025.agenda',
        registrationOpen: false,
        capacity: 500,
        attendees: 478,
        isUpcoming: false
    },
    {
        id: 'shivaratri-2025',
        titleKey: 'shivaratri2025.title',
        category: 'festival',
        date: new Date('2025-02-26'),
        time: '6:00 PM - 6:00 AM',
        locationKey: 'locations.shivaMandap',
        descriptionKey: 'shivaratri2025.description',
        longDescriptionKey: 'shivaratri2025.longDescription',
        image: '/assets/events/shivaratri.png',
        speakerKey: 'speakers.shivacharya',
        agendaKey: 'shivaratri2025.agenda',
        registrationOpen: false,
        capacity: 600,
        attendees: 589,
        isUpcoming: false
    }
];
