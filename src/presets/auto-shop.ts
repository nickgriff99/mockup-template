import type { ClientConfigPreset } from "./types";

export const autoShopPreset: ClientConfigPreset = {
  tagline: "Honest repairs, done right.",
  theme: {
    primary: "#c62828",
    accent: "#37474f",
    background: "#f4f4f4",
    text: "#1a1a1a",
    fontHeading: "Rajdhani",
    fontBody: "Roboto",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Auto shop hero image" },
  offerings: [
    { name: "Sample Service", description: "A placeholder service", price: "$39" },
  ],
  about: "A dependable auto shop keeping your vehicle running safely.",
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
