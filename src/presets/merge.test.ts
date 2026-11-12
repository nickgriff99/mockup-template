import { describe, it, expect } from "vitest";
import { mergeWithPreset } from "./merge";
import { presetsByCategory } from "./index";
import type { Category, HoursEntry } from "../schema";

const categories = Object.keys(presetsByCategory) as Category[];

function minimalOverride(category: Category) {
  return {
    name: "Test Business",
    slug: "test-business",
    category,
    phone: "555-000-0000",
    address: "1 Test St",
    heroImage: { src: "/hero.jpg", alt: "Hero" },
    hours: [
      { day: "mon", open: "09:00", close: "17:00" },
      { day: "tue", open: "09:00", close: "17:00" },
      { day: "wed", open: "09:00", close: "17:00" },
      { day: "thu", open: "09:00", close: "17:00" },
      { day: "fri", open: "09:00", close: "17:00" },
      { day: "sat", open: null, close: null },
      { day: "sun", open: null, close: null },
    ] satisfies HoursEntry[],
  };
}

describe("mergeWithPreset", () => {
  it("client overrides win over preset defaults", () => {
    const merged = mergeWithPreset(presetsByCategory.restaurant, {
      ...minimalOverride("restaurant"),
      tagline: "Custom tagline",
    });
    expect(merged.tagline).toBe("Custom tagline");
  });

  it("an empty override on top of each preset still fails required-field validation (name/slug/etc not defaulted)", () => {
    for (const category of categories) {
      expect(() => mergeWithPreset(presetsByCategory[category], {})).toThrow();
    }
  });

  it.each(categories)(
    "minimal client override + %s preset produces a schema-valid full config",
    (category) => {
      const merged = mergeWithPreset(presetsByCategory[category], minimalOverride(category));
      expect(merged.category).toBe(category);
      expect(merged.theme.primary).toBeTruthy();
      expect(merged.primaryCTA.type).toBeTruthy();
    }
  );
});
