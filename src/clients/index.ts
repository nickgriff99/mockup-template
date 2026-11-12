import { ZodError } from "zod";
import type { ClientConfig } from "../schema";

// Each future `src/clients/<slug>.ts` must `export default` a full ClientConfig
// built via `mergeWithPreset(presetsByCategory[category], overrides)`. Drop the file
// in and it auto-registers here — no manual wiring. index.ts itself is excluded.
const clientModules = import.meta.glob<{ default: ClientConfig }>([
  "./*.ts",
  "!./index.ts",
  "!./*.test.ts",
]);

export interface ClientLoadError {
  slug: string;
  // Usually a ZodError from mergeWithPreset's schema.parse, but kept as unknown
  // in case a client file throws something else (bad import, runtime error, etc).
  error: unknown;
}

export interface ClientRegistry {
  clients: Map<string, ClientConfig>;
  errors: ClientLoadError[];
}

function slugFromPath(path: string): string {
  return path.replace(/^\.\//, "").replace(/\.ts$/, "");
}

// Loads every client module, isolating failures per-slug: one broken client config
// must never take down the registry or the other clients. Dynamic import (via the
// lazy glob) is required here, not eager — a throwing top-level `export default
// mergeWithPreset(...)` rejects only its own import() promise, not the module graph.
export async function loadClientRegistry(): Promise<ClientRegistry> {
  const clients = new Map<string, ClientConfig>();
  const errors: ClientLoadError[] = [];

  await Promise.all(
    Object.entries(clientModules).map(async ([path, loadModule]) => {
      const slug = slugFromPath(path);
      try {
        const mod = await loadModule();
        clients.set(slug, mod.default);
      } catch (error) {
        errors.push({ slug, error });
      }
    })
  );

  return { clients, errors };
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
