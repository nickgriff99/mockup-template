import type { ClientConfig } from "../schema";

// Deep-partial of the full config: presets only set defaults for a subset of fields.
export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export type ClientConfigPreset = DeepPartial<ClientConfig>;
