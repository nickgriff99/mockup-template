import { describe, it, expect } from "vitest";
import { getSlugFromPathname, buildThemeStyle } from "./Router";
import { mergeWithPreset, presetsByCategory } from "./presets";
import type { HoursEntry } from "./schema";

describe("getSlugFromPathname", () => {
  it("strips leading slash", () => {
    expect(getSlugFromPathname("/acme-bistro")).toBe("acme-bistro");
  });

  it("returns empty string for root", () => {
    expect(getSlugFromPathname("/")).toBe("");
  });

  it("strips trailing slash", () => {
    expect(getSlugFromPathname("/acme-bistro/")).toBe("acme-bistro");
  });
});

function clientWithTheme(category: "restaurant" | "salon", overrides: object) {
  const hours: HoursEntry[] = [
    { day: "mon", open: "09:00", close: "17:00" },
    { day: "tue", open: "09:00", close: "17:00" },
    { day: "wed", open: "09:00", close: "17:00" },
    { day: "thu", open: "09:00", close: "17:00" },
    { day: "fri", open: "09:00", close: "17:00" },
    { day: "sat", open: null, close: null },
    { day: "sun", open: null, close: null },
  ];
  return mergeWithPreset(presetsByCategory[category], {
    name: "Test Business",
    slug: "test-business",
    category,
    phone: "555-000-0000",
    address: "1 Test St",
    heroImage: { src: "/hero.jpg", alt: "Hero" },
    hours,
    theme: overrides,
  });
}

describe("buildThemeStyle", () => {
  it("maps a client's config.theme colors/fonts into CSS custom properties", () => {
    const config = clientWithTheme("restaurant", {
      primary: "#ff0000",
      accent: "#00ff00",
      background: "#0000ff",
      text: "#111111",
      fontHeading: "Playfair Display",
      fontBody: "Lato",
    });
    const style = buildThemeStyle(config) as Record<string, string>;
    expect(style["--color-primary"]).toBe("#ff0000");
    expect(style["--color-accent"]).toBe("#00ff00");
    expect(style["--color-background"]).toBe("#0000ff");
    expect(style["--color-text"]).toBe("#111111");
    expect(style["--font-heading"]).toContain("Playfair Display");
    expect(style["--font-body"]).toContain("Lato");
  });

  it("produces DIFFERENT CSS custom properties for two clients with distinct theme values", () => {
    const cafe = clientWithTheme("restaurant", {
      primary: "#ff0000",
      accent: "#00ff00",
      background: "#ffffff",
      text: "#111111",
      fontHeading: "Playfair Display",
      fontBody: "Lato",
    });
    const salon = clientWithTheme("salon", {
      primary: "#a0522d",
      accent: "#f5deb3",
      background: "#fffaf0",
      text: "#2b1b12",
      fontHeading: "Cormorant Garamond",
      fontBody: "Nunito Sans",
    });

    const cafeStyle = buildThemeStyle(cafe) as Record<string, string>;
    const salonStyle = buildThemeStyle(salon) as Record<string, string>;

    expect(cafeStyle["--color-primary"]).not.toBe(salonStyle["--color-primary"]);
    expect(cafeStyle["--color-background"]).not.toBe(salonStyle["--color-background"]);
    expect(cafeStyle["--font-heading"]).not.toBe(salonStyle["--font-heading"]);
  });
});
