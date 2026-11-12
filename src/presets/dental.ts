import type { ClientConfigPreset } from "./types";

export const dentalPreset: ClientConfigPreset = {
  tagline: "Gentle care for a healthy smile.",
  theme: {
    primary: "#2a6f77",
    accent: "#bfe3e0",
    background: "#f7fbfb",
    text: "#1e2b2c",
    fontHeading: "Poppins",
    fontBody: "Open Sans",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Dental office hero image" },
  offerings: [
    { name: "Sample Service", description: "A placeholder service", price: "Call for pricing" },
  ],
  about: "A calm, clinical practice focused on gentle, modern dental care.",
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
