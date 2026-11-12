import { describe, it, expect } from "vitest";
import { ClientConfigSchema } from "./schema";

const validConfig = {
  name: "Joe's Diner",
  slug: "joes-diner",
  category: "restaurant",
  tagline: "Comfort food done right.",
  heroImage: { src: "/hero.jpg", alt: "Diner storefront" },
  theme: {
    primary: "#b5431a",
    accent: "#e0a33d",
    background: "#fff8f0",
    text: "#2b1a12",
    fontHeading: "Playfair Display",
    fontBody: "Lato",
  },
  phone: "555-123-4567",
  address: "123 Main St, Springfield",
  mapsUrl: "https://maps.google.com/?q=123+Main+St",
  hours: [
    { day: "mon", open: "08:00", close: "20:00" },
    { day: "tue", open: "08:00", close: "20:00" },
    { day: "wed", open: "08:00", close: "20:00" },
    { day: "thu", open: "08:00", close: "20:00" },
    { day: "fri", open: "08:00", close: "22:00" },
    { day: "sat", open: "18:00", close: "02:00" }, // overnight span, must not be rejected
    { day: "sun", open: null, close: null }, // closed
  ],
  about: "A cozy diner serving the neighborhood since 1990.",
  reviews: [{ author: "Alice", rating: 5, text: "Great food!" }],
  primaryCTA: { label: "Order Now", type: "order" },
};

describe("ClientConfigSchema", () => {
  it("accepts a fully-valid config", () => {
    expect(ClientConfigSchema.safeParse(validConfig).success).toBe(true);
  });

  it("rejects an image missing alt text", () => {
    const bad = { ...validConfig, heroImage: { src: "/hero.jpg" } };
    expect(ClientConfigSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects an invalid category", () => {
    const bad = { ...validConfig, category: "bakery" };
    expect(ClientConfigSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects more than 3 reviews", () => {
    const bad = {
      ...validConfig,
      reviews: [
        { author: "A", rating: 5, text: "x" },
        { author: "B", rating: 4, text: "x" },
        { author: "C", rating: 3, text: "x" },
        { author: "D", rating: 2, text: "x" },
      ],
    };
    expect(ClientConfigSchema.safeParse(bad).success).toBe(false);
  });
});
