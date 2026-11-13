import { describe, it, expect } from "vitest";
import { getTodayHours, isOpenNow, getOpenStatusLabel } from "./hours";
import type { ClientConfig } from "../schema";

type Hours = ClientConfig["hours"];

// Nov 9, 2026 = Monday; Nov 10 = Tuesday; Nov 11 = Wednesday (fixed reference week).
const ALL_DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function makeHours(overrides: Partial<Record<(typeof ALL_DAYS)[number], { open: string | null; close: string | null }>>): Hours {
  return ALL_DAYS.map((day) => {
    const override = overrides[day];
    return {
      day,
      open: override ? override.open : "09:00",
      close: override ? override.close : "17:00",
    };
  }) as Hours;
}

describe("getTodayHours", () => {
  it("returns the entry matching now's weekday", () => {
    const hours = makeHours({ mon: { open: "10:00", close: "18:00" } });
    const monday = new Date(2026, 10, 9, 12, 0); // Mon Nov 9 2026, noon
    expect(getTodayHours(hours, monday)).toEqual({ day: "mon", open: "10:00", close: "18:00" });
  });
});

describe("isOpenNow — normal same-day hours", () => {
  const hours = makeHours({ mon: { open: "09:00", close: "17:00" } });

  it("open during business hours", () => {
    const now = new Date(2026, 10, 9, 12, 0); // Mon noon
    expect(isOpenNow(hours, now)).toBe(true);
  });

  it("closed before open time", () => {
    const now = new Date(2026, 10, 9, 8, 0); // Mon 8am
    expect(isOpenNow(hours, now)).toBe(false);
  });

  it("closed after close time", () => {
    const now = new Date(2026, 10, 9, 18, 0); // Mon 6pm
    expect(isOpenNow(hours, now)).toBe(false);
  });
});

describe("isOpenNow — closed day", () => {
  const hours = makeHours({ sun: { open: null, close: null } });

  it("always closed on a null/null day", () => {
    const now = new Date(2026, 10, 8, 12, 0); // Sun Nov 8 2026, noon
    expect(isOpenNow(hours, now)).toBe(false);
  });
});

describe("isOpenNow — overnight span", () => {
  // Monday open 18:00, close 02:00 (next day, Tuesday)
  const hours = makeHours({
    mon: { open: "18:00", close: "02:00" },
    tue: { open: null, close: null }, // Tuesday itself closed, to prove carry-over works independent of today's own hours
  });

  it("open during the carry-over window (Tue 1am, from Monday's overnight span)", () => {
    const now = new Date(2026, 10, 10, 1, 0); // Tue Nov 10 2026, 1am
    expect(isOpenNow(hours, now)).toBe(true);
  });

  it("open during today's own overnight window (Mon 11pm, before midnight)", () => {
    const now = new Date(2026, 10, 9, 23, 0); // Mon Nov 9 2026, 11pm
    expect(isOpenNow(hours, now)).toBe(true);
  });

  it("closed well outside the overnight window (Tue 2pm)", () => {
    const now = new Date(2026, 10, 10, 14, 0); // Tue Nov 10 2026, 2pm
    expect(isOpenNow(hours, now)).toBe(false);
  });
});

describe("isOpenNow — boundaries (half-open interval [open, close))", () => {
  const hours = makeHours({ mon: { open: "09:00", close: "17:00" } });

  it("exactly at open time is open", () => {
    const now = new Date(2026, 10, 9, 9, 0);
    expect(isOpenNow(hours, now)).toBe(true);
  });

  it("exactly at close time is closed", () => {
    const now = new Date(2026, 10, 9, 17, 0);
    expect(isOpenNow(hours, now)).toBe(false);
  });

  it("overnight span: exactly at the carry-over close time is closed", () => {
    const overnight = makeHours({ mon: { open: "18:00", close: "02:00" } });
    const now = new Date(2026, 10, 10, 2, 0); // Tue 2am
    expect(isOpenNow(overnight, now)).toBe(false);
  });
});

describe("getOpenStatusLabel", () => {
  const hours = makeHours({ mon: { open: "09:00", close: "17:00" } });

  it("returns 'Open now' when open", () => {
    expect(getOpenStatusLabel(hours, new Date(2026, 10, 9, 12, 0))).toBe("Open now");
  });

  it("returns 'Closed' when closed", () => {
    expect(getOpenStatusLabel(hours, new Date(2026, 10, 9, 20, 0))).toBe("Closed");
  });
});
