import type { ClientConfigPreset } from "./types";

export const contractorPreset: ClientConfigPreset = {
  tagline: "Built right, on time.",
  theme: {
    primary: "#1f3a5f",
    accent: "#e8a33d",
    background: "#f5f6f7",
    text: "#1a1a1a",
    fontHeading: "Oswald",
    fontBody: "Source Sans Pro",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Contractor hero image" },
  offerings: [
    { name: "Sample Service", description: "A placeholder service", price: "Free estimate" },
  ],
  about: "A trusted local contractor delivering solid, reliable work.",
  reviews: [],
  primaryCTA: { label: "Call Now", type: "call" },
  mapsUrl: "https://maps.google.com",
  sectionOrder: [
    "header",
    "hero",
    "quickInfo",
    "offerings",
    "about",
    "reviews",
    "hoursLocation",
    "finalCTA",
    "footer",
  ],
};
