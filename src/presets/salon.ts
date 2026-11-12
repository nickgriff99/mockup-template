import type { ClientConfigPreset } from "./types";

export const salonPreset: ClientConfigPreset = {
  tagline: "Look good, feel good.",
  theme: {
    primary: "#b08968",
    accent: "#e8c4c4",
    background: "#fdfaf7",
    text: "#2e2a28",
    fontHeading: "Cormorant Garamond",
    fontBody: "Nunito Sans",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Salon hero image" },
  offerings: [
    { name: "Sample Service", description: "A placeholder service", price: "$45" },
  ],
  about: "A clean, elegant salon focused on making you feel your best.",
  reviews: [],
  primaryCTA: { label: "Book Now", type: "book" },
  bookingUrl: "https://example.com/book",
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
