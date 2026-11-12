import { ClientConfigSchema, type ClientConfig } from "../schema";
import type { ClientConfigPreset } from "./types";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Deep-merge: override wins at every key; arrays/primitives replace wholesale (no element-wise merge).
function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override === undefined ? base : (override as T));
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const overrideVal = (override as Record<string, unknown>)[key];
    if (overrideVal === undefined) continue;
    result[key] = deepMerge(result[key], overrideVal);
  }
  return result as T;
}

// Client overrides win; result must validate against the full ClientConfigSchema — this is
// the one place merge logic lives, no duplicating it elsewhere.
export function mergeWithPreset(
  preset: ClientConfigPreset,
  clientOverrides: ClientConfigPreset
): ClientConfig {
  const merged = deepMerge(preset, clientOverrides);
  return ClientConfigSchema.parse(merged);
}
