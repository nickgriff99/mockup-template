import type { ClientConfigPreset } from "./types";

export const retailPreset: ClientConfigPreset = {
  tagline: "Shop local, shop good.",
  theme: {
    primary: "#4a2c2a",
    accent: "#d9b98b",
    background: "#faf6f1",
    text: "#2a1f1c",
    fontHeading: "Libre Baskerville",
    fontBody: "Work Sans",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Retail store hero image" },
  offerings: [
    { name: "Sample Product", description: "A placeholder product", price: "$25" },
  ],
  about: "A local shop stocked with goods picked with care.",
  reviews: [],
  primaryCTA: { label: "Get Directions", type: "directions" },
  mapsUrl: "https://maps.google.com",
  sectionOrder: [
    "header",
    "hero",
    "quickInfo",
    "offerings",
    "about",
    "reviews",
    "gallery",
    "hoursLocation",
    "finalCTA",
    "footer",
  ],
};
