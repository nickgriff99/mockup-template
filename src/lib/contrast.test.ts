import { describe, expect, it } from "vitest";
import { getContrastRatio, meetsWCAG_AA } from "./contrast";
import { restaurantPreset } from "../presets/restaurant";
import { dentalPreset } from "../presets/dental";
import { contractorPreset } from "../presets/contractor";
import { fitnessPreset } from "../presets/fitness";
import { salonPreset } from "../presets/salon";
import { retailPreset } from "../presets/retail";
import { autoShopPreset } from "../presets/auto-shop";

describe("getContrastRatio", () => {
  it("black on white is ~21:1", () => {
    expect(getContrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("is symmetric regardless of argument order", () => {
    const a = getContrastRatio("#2563eb", "#ffffff");
    const b = getContrastRatio("#ffffff", "#2563eb");
    expect(a).toBeCloseTo(b, 5);
  });

  it("mid-gray on white fails AA normal text (realistic fail case)", () => {
    // #949494 on #ffffff is ~2.8:1 — a classic "looks fine, fails AA" gray.
    const ratio = getContrastRatio("#949494", "#ffffff");
    expect(ratio).toBeLessThan(4.5);
    expect(meetsWCAG_AA(ratio)).toBe(false);
  });
});

describe("meetsWCAG_AA", () => {
  it("passes normal text at >=4.5:1", () => {
    expect(meetsWCAG_AA(4.5)).toBe(true);
    expect(meetsWCAG_AA(4.49)).toBe(false);
  });

  it("passes large text at >=3:1", () => {
    expect(meetsWCAG_AA(3, true)).toBe(true);
    expect(meetsWCAG_AA(2.99, true)).toBe(false);
  });
});

describe("preset theme contrast", () => {
  const presets = {
    restaurant: restaurantPreset,
    dental: dentalPreset,
    contractor: contractorPreset,
    fitness: fitnessPreset,
    salon: salonPreset,
    retail: retailPreset,
    "auto-shop": autoShopPreset,
  };

  it.each(Object.entries(presets))(
    "%s preset text/background passes WCAG AA",
    (_name, preset) => {
      const { text, background } = preset.theme!;
      const ratio = getContrastRatio(text!, background!);
      expect(meetsWCAG_AA(ratio)).toBe(true);
    }
  );
});
