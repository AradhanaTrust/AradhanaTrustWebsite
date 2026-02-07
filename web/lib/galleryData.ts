export const galleryCategories = [
    "All",
    "Temple Events",
    "Deity Darshan",
    "Annadanam",
    "Cultural Programs",
    "Social Welfare"
] as const;

export type GalleryCategory = typeof galleryCategories[number];

export interface GalleryImage {
    id: number;
    src: string;
    category: Exclude<GalleryCategory, "All">;
    alt: string;
    titleKey: string;
}

export const galleryImages: GalleryImage[] = [
    {
        id: 1,
        src: "/assets/gallery-1.png",
        category: "Temple Events",
        alt: "Temple Celebration Event",
        titleKey: "templeCeremony"
    },
    {
        id: 2,
        src: "/assets/gallery-2.png",
        category: "Deity Darshan",
        alt: "Sacred Deity Darshan",
        titleKey: "divineDarshan"
    },
    {
        id: 3,
        src: "/assets/gallery-3.png",
        category: "Annadanam",
        alt: "Annadanam Seva",
        titleKey: "foodDistribution"
    },
    {
        id: 4,
        src: "/assets/gallery-4.png",
        category: "Cultural Programs",
        alt: "Cultural Program",
        titleKey: "culturalEvent"
    },
    {
        id: 5,
        src: "/assets/gallery-5.png",
        category: "Social Welfare",
        alt: "Social Welfare Activity",
        titleKey: "communityService"
    },
    {
        id: 6,
        src: "/assets/event-ganesh.png",
        category: "Temple Events",
        alt: "Ganesh Puja Celebration",
        titleKey: "ganeshPuja"
    },
    {
        id: 7,
        src: "/assets/event-annadanam.png",
        category: "Annadanam",
        alt: "Annadanam Community Service",
        titleKey: "communityAnnadanam"
    },
    {
        id: 8,
        src: "/assets/event-homa.png",
        category: "Cultural Programs",
        alt: "Homa Ceremony",
        titleKey: "sacredHoma"
    }
];
