import { z } from "zod";

// Image sub-schema: alt is ALWAYS required, no silent missing-alt images.
export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
});
export type Image = z.infer<typeof ImageSchema>;

export const CategorySchema = z.enum([
  "restaurant",
  "salon",
  "contractor",
  "auto-shop",
  "fitness",
  "retail",
  "dental",
]);
export type Category = z.infer<typeof CategorySchema>;

export const ThemeSchema = z.object({
  primary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  fontHeading: z.string(),
  fontBody: z.string(),
});
export type Theme = z.infer<typeof ThemeSchema>;

const timeString = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM");

export const DaySchema = z.enum([
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]);

// Overnight spans (close < open) are valid shapes here; "open now" logic is a later stage's job.
export const HoursEntrySchema = z.object({
  day: DaySchema,
  open: timeString.nullable(),
  close: timeString.nullable(),
});
export type HoursEntry = z.infer<typeof HoursEntrySchema>;

// One entry per day of the week, no dupes/missing days.
export const HoursSchema = z
  .array(HoursEntrySchema)
  .length(7)
  .refine(
    (entries) => new Set(entries.map((e) => e.day)).size === 7,
    "hours must cover each day exactly once"
  );

// Single shape covers both "menu" (restaurant) and "services" (salon/contractor/etc).
export const OfferingSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
});
export type Offering = z.infer<typeof OfferingSchema>;

export const ReviewSchema = z.object({
  author: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const CTATypeSchema = z.enum(["call", "book", "directions", "order"]);

export const PrimaryCTASchema = z.object({
  label: z.string(),
  type: CTATypeSchema,
});

export const SocialsSchema = z
  .object({
    instagram: z.string().url().optional(),
    facebook: z.string().url().optional(),
    tiktok: z.string().url().optional(),
  })
  .optional();

export const ClientConfigSchema = z.object({
  name: z.string(),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be url-safe (lowercase, hyphenated)"),
  category: CategorySchema,
  tagline: z.string(),

  logo: ImageSchema.optional(),
  heroImage: ImageSchema,

  theme: ThemeSchema,

  phone: z.string(),
  email: z.string().email().optional(),
  address: z.string(),
  mapsUrl: z.string().url(),

  hours: HoursSchema,

  offerings: z.array(OfferingSchema).optional(),

  about: z.string(),
  aboutImage: ImageSchema.optional(),

  reviews: z.array(ReviewSchema).max(3),

  gallery: z.array(ImageSchema).optional(),

  primaryCTA: PrimaryCTASchema,
  bookingUrl: z.string().url().optional(),

  socials: SocialsSchema,

  // Which sections to render, in order. Presets set a sensible default; client can reorder/omit.
  sectionOrder: z.array(z.string()).optional(),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
