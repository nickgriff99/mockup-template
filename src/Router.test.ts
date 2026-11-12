import { describe, it, expect } from "vitest";
import { getSlugFromPathname } from "./Router";

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
