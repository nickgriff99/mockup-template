import type { ClientConfigPreset } from "./types";

export const fitnessPreset: ClientConfigPreset = {
  tagline: "Stronger every day.",
  theme: {
    primary: "#101820",
    accent: "#d4ff3f",
    background: "#ffffff",
    text: "#101820",
    fontHeading: "Montserrat",
    fontBody: "Inter",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Fitness studio hero image" },
  offerings: [
    { name: "Sample Class", description: "A placeholder class", price: "$20/class" },
  ],
  about: "A high-energy studio built to help you reach your goals.",
  reviews: [],
  primaryCTA: { label: "Book a Class", type: "book" },
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
