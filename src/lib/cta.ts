import type { ClientConfig } from "../schema";

// `phone` and `mapsUrl` are required ClientConfigSchema fields, so "call" and
// "directions" always resolve. "book"/"order" prefer bookingUrl but fall back
// to tel:phone (calling to book/order is always a reasonable action) rather
// than ever rendering a dead-link button.
export function resolvePrimaryCTAHref(config: ClientConfig): string {
  switch (config.primaryCTA.type) {
    case "call":
      return `tel:${config.phone}`;
    case "directions":
      return config.mapsUrl;
    case "book":
    case "order":
      return config.bookingUrl ?? `tel:${config.phone}`;
  }
}
