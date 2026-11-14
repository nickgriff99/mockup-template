import { Button } from "../components/Button";
import { SectionWrapper } from "../components/SectionWrapper";
import { useReveal } from "../hooks/useReveal";
import { DAY_ORDER } from "../lib/hours";
import type { ClientConfig } from "../schema";

const DAY_LABEL: Record<(typeof DAY_ORDER)[number], string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

// Display order mon-sun (fixed, not day-math) — distinct from DAY_ORDER's
// JS-Date-index-based sun-first order used only to find "today".
const DISPLAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function HoursLocation({ config }: { config: ClientConfig }) {
  const ref = useReveal<HTMLElement>();
  const todayKey = DAY_ORDER[new Date().getDay()];

  return (
    <SectionWrapper ref={ref}>
      <h2 className="mb-6 text-2xl font-bold text-brand-text">Hours & location</h2>
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <table className="w-full max-w-sm text-base">
          <tbody>
            {DISPLAY_ORDER.map((day) => {
              const entry = config.hours.find((e) => e.day === day)!;
              const isToday = day === todayKey;
              const rangeText =
                entry.open && entry.close ? `${entry.open}–${entry.close}` : "Closed";
              return (
                <tr
                  key={day}
                  className={isToday ? "bg-brand-primary/10 font-bold" : undefined}
                >
                  <td className="py-1 pr-4">{DAY_LABEL[day]}</td>
                  <td className="py-1">{rangeText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-col gap-3">
          <p className="text-brand-text">{config.address}</p>
          <Button href={config.mapsUrl} className="self-start">
            Get Directions
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}
