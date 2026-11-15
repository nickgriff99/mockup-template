// WCAG 2.x contrast math (relative luminance -> contrast ratio). No dependency —
// this is fixed, well-known math, not worth pulling in a package for.
// Spec: https://www.w3.org/TR/WCAG21/#contrast-minimum

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function channelLuminance(c: number): number {
  const srgb = c / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

// Ratio is symmetric and always expressed as the >=1 value (lighter over darker).
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// AA thresholds: 4.5:1 normal text, 3:1 large text (>=18pt, or >=14pt bold).
export function meetsWCAG_AA(ratio: number, isLargeText = false): boolean {
  return ratio >= (isLargeText ? 3 : 4.5);
}

// Dev-only: warns once per mount if a client's theme text/background fails AA.
// Caller must gate with `if (import.meta.env.DEV)` so prod bundles skip the call
// entirely (not just the warn) — keeps this a true no-op in production.
export function warnIfThemeContrastFails(
  slug: string,
  text: string,
  background: string
): void {
  const ratio = getContrastRatio(text, background);
  if (!meetsWCAG_AA(ratio)) {
    console.warn(
      `[contrast] Client "${slug}": theme text/background contrast is ${ratio.toFixed(
        2
      )}:1, fails WCAG AA (needs >=4.5:1 for normal text, >=3:1 for large text). text=${text} background=${background}`
    );
  }
}
