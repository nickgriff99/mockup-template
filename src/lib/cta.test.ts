import { describe, it, expect } from "vitest";
import { resolvePrimaryCTAHref } from "./cta";
import { mergeWithPreset, presetsByCategory } from "../presets";
import type { HoursEntry } from "../schema";

const baseHours: HoursEntry[] = [
  { day: "mon", open: "09:00", close: "17:00" },
  { day: "tue", open: "09:00", close: "17:00" },
  { day: "wed", open: "09:00", close: "17:00" },
  { day: "thu", open: "09:00", close: "17:00" },
  { day: "fri", open: "09:00", close: "17:00" },
  { day: "sat", open: null, close: null },
  { day: "sun", open: null, close: null },
];

function configWith(overrides: Record<string, unknown>) {
  return mergeWithPreset(presetsByCategory.salon, {
    name: "Test Salon",
    slug: "test-salon",
    category: "salon",
    phone: "555-123-4567",
    address: "1 Test St",
    heroImage: { src: "/hero.jpg", alt: "Hero" },
    hours: baseHours,
    mapsUrl: "https://maps.example.com/test-salon",
    ...overrides,
  });
}

describe("resolvePrimaryCTAHref", () => {
  it("call always maps to tel:phone", () => {
    const config = configWith({ primaryCTA: { label: "Call", type: "call" } });
    expect(resolvePrimaryCTAHref(config)).toBe("tel:555-123-4567");
  });

  it("directions always maps to mapsUrl", () => {
    const config = configWith({ primaryCTA: { label: "Directions", type: "directions" } });
    expect(resolvePrimaryCTAHref(config)).toBe("https://maps.example.com/test-salon");
  });

  it("book prefers bookingUrl when present", () => {
    const config = configWith({
      primaryCTA: { label: "Book", type: "book" },
      bookingUrl: "https://booking.example.com",
    });
    expect(resolvePrimaryCTAHref(config)).toBe("https://booking.example.com");
  });

  it("book falls back to tel:phone when bookingUrl missing", () => {
    // contractor preset sets no bookingUrl default (unlike salon) — needed to
    // actually exercise the fallback, since deepMerge can't unset a preset value.
    const config = mergeWithPreset(presetsByCategory.contractor, {
      name: "Test Contractor",
      slug: "test-contractor",
      category: "contractor",
      phone: "555-123-4567",
      address: "1 Test St",
      heroImage: { src: "/hero.jpg", alt: "Hero" },
      hours: baseHours,
      mapsUrl: "https://maps.example.com/test-contractor",
      primaryCTA: { label: "Book", type: "book" },
    });
    expect(resolvePrimaryCTAHref(config)).toBe("tel:555-123-4567");
  });

  it("order falls back to tel:phone when bookingUrl missing", () => {
    const config = mergeWithPreset(presetsByCategory.contractor, {
      name: "Test Contractor",
      slug: "test-contractor",
      category: "contractor",
      phone: "555-123-4567",
      address: "1 Test St",
      heroImage: { src: "/hero.jpg", alt: "Hero" },
      hours: baseHours,
      mapsUrl: "https://maps.example.com/test-contractor",
      primaryCTA: { label: "Order", type: "order" },
    });
    expect(resolvePrimaryCTAHref(config)).toBe("tel:555-123-4567");
  });
});
