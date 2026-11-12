import type { ClientConfigPreset } from "./types";

export const restaurantPreset: ClientConfigPreset = {
  tagline: "Fresh food, made with care.",
  theme: {
    primary: "#b5431a",
    accent: "#e0a33d",
    background: "#fff8f0",
    text: "#2b1a12",
    fontHeading: "Playfair Display",
    fontBody: "Lato",
  },
  heroImage: { src: "/placeholder-hero.jpg", alt: "Restaurant hero image" },
  offerings: [
    { name: "Sample Dish", description: "A tasty placeholder item", price: "$12" },
  ],
  about: "A warm, welcoming spot serving great food made fresh daily.",
  reviews: [],
  primaryCTA: { label: "Order Now", type: "order" },
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
