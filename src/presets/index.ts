import type { Category } from "../schema";
import type { ClientConfigPreset } from "./types";
import { restaurantPreset } from "./restaurant";
import { salonPreset } from "./salon";
import { contractorPreset } from "./contractor";
import { autoShopPreset } from "./auto-shop";
import { fitnessPreset } from "./fitness";
import { retailPreset } from "./retail";
import { dentalPreset } from "./dental";

export const presetsByCategory: Record<Category, ClientConfigPreset> = {
  restaurant: restaurantPreset,
  salon: salonPreset,
  contractor: contractorPreset,
  "auto-shop": autoShopPreset,
  fitness: fitnessPreset,
  retail: retailPreset,
  dental: dentalPreset,
};

export { mergeWithPreset } from "./merge";
export type { ClientConfigPreset } from "./types";
