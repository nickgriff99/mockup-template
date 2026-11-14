import { describe, it, expect } from "vitest";
import { loadClientRegistry } from "./index";

describe("loadClientRegistry", () => {
  it("loads every known example client with zero errors", async () => {
    const { clients, errors } = await loadClientRegistry();

    const expected: Record<string, string> = {
      "sunrise-cafe": "restaurant",
      "ironclad-contracting": "contractor",
      "bella-salon": "salon",
    };

    for (const [slug, category] of Object.entries(expected)) {
      expect(errors.find((e) => e.slug === slug)).toBeUndefined();
      const client = clients.get(slug);
      expect(client).toBeDefined();
      expect(client?.category).toBe(category);
    }
  });

  it("every registered client satisfies the general ClientConfig contract", async () => {
    const { clients, errors } = await loadClientRegistry();

    // Catches a client file that imports/parses fine but exports garbage.
    expect(errors).toEqual([]);
    expect(clients.size).toBeGreaterThan(0);

    for (const [slug, client] of clients) {
      expect(client.slug).toBe(slug);
      expect(client.name.length).toBeGreaterThan(0);
      expect(client.heroImage.src.length).toBeGreaterThan(0);
      expect(client.heroImage.alt.length).toBeGreaterThan(0);
      expect(client.hours).toHaveLength(7);
      expect(client.reviews.length).toBeLessThanOrEqual(3);
      expect(client.primaryCTA.label.length).toBeGreaterThan(0);
    }
  });
});
