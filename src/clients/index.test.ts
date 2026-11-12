import { describe, it, expect } from "vitest";
import { loadClientRegistry } from "./index";

describe("loadClientRegistry", () => {
  it("returns an empty registry when src/clients has no client files yet", async () => {
    const { clients, errors } = await loadClientRegistry();
    expect(clients.size).toBe(0);
    expect(errors).toEqual([]);
  });
});
