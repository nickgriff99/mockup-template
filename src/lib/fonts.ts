// Builds a Google Fonts css2 URL for a client's heading+body font pairing.
// Dedupes identical family names; display=swap avoids invisible-text flash (FOIT).
export function googleFontsHref(fontHeading: string, fontBody: string): string {
  const families = [...new Set([fontHeading, fontBody])].map(
    (f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@400;700`
  );
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
