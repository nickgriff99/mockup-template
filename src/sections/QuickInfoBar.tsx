import { SectionWrapper } from "../components/SectionWrapper";
import { getOpenStatusLabel, getTodayHours } from "../lib/hours";
import type { ClientConfig } from "../schema";

export function QuickInfoBar({ config }: { config: ClientConfig }) {
  const isOpen = getOpenStatusLabel(config.hours) === "Open now";
  const today = getTodayHours(config.hours);
  const hoursText =
    today.open && today.close ? `${today.open}–${today.close}` : "Closed today";

  return (
    <SectionWrapper className="border-b border-brand-text/10">
      <div className="flex flex-col gap-3 text-base md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span
            className={
              "inline-flex min-h-11 items-center rounded-full px-3 font-medium " +
              (isOpen
                ? "bg-brand-accent text-white"
                : "bg-brand-text/10 text-brand-text")
            }
          >
            {isOpen ? "Open now" : "Closed"}
          </span>
          <span className="text-brand-text/80">{hoursText}</span>
        </div>
        <a
          href={config.mapsUrl}
          className="transition-brand inline-flex min-h-11 items-center text-brand-primary hover-hover:underline"
        >
          {config.address}
        </a>
        <a
          href={`tel:${config.phone}`}
          className="transition-brand inline-flex min-h-11 items-center text-brand-primary hover-hover:underline"
        >
          {config.phone}
        </a>
      </div>
    </SectionWrapper>
  );
}
