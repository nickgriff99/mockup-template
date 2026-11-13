import { SectionWrapper } from "../components/SectionWrapper";
import type { ClientConfig } from "../schema";

// Renders whichever socials are present; nothing for absent ones — no placeholder icons.
const SOCIAL_LABELS = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
} as const;

export function Footer({ config }: { config: ClientConfig }) {
  const socials = config.socials
    ? (Object.entries(config.socials).filter(([, url]) => url) as [
        keyof typeof SOCIAL_LABELS,
        string,
      ][])
    : [];

  return (
    <SectionWrapper as="footer" className="flex flex-col items-center gap-3 text-center">
      {socials.length > 0 && (
        <div className="flex gap-4">
          {socials.map(([key, url]) => (
            <a
              key={key}
              href={url}
              className="transition-brand text-brand-text/80 hover-hover:text-brand-primary"
            >
              {SOCIAL_LABELS[key]}
            </a>
          ))}
        </div>
      )}
      <p className="text-brand-text/80">{config.address}</p>
      <p className="text-sm text-brand-text/50">
        Concept mockup by Nicholas Griffiths · nickhgriffiths.com
      </p>
    </SectionWrapper>
  );
}
