import type { ClientConfig } from "../schema";

type Hours = ClientConfig["hours"];
type HoursEntry = Hours[number];

// Exported: JS Date.getDay() index -> schema day enum. Reuse this for any
// "what day is it" mapping instead of re-deriving the Sunday-is-0 math.
export const DAY_ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function entryForDay(hours: Hours, dayIndex: number): HoursEntry {
  const day = DAY_ORDER[((dayIndex % 7) + 7) % 7];
  // schema guarantees exactly one entry per day
  return hours.find((e) => e.day === day)!;
}

/** Today's hours entry (does NOT factor in an overnight span carried over from yesterday — see isOpenNow for that). */
export function getTodayHours(hours: Hours, now: Date = new Date()): HoursEntry {
  return entryForDay(hours, now.getDay());
}

// Half-open interval convention: [open, close) — exactly at open time counts as open,
// exactly at close time counts as closed (matches "closes at 5" meaning 4:59 is the last open minute).
export function isOpenNow(hours: Hours, now: Date = new Date()): boolean {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = entryForDay(hours, now.getDay());
  const yesterday = entryForDay(hours, now.getDay() - 1);

  if (today.open !== null && today.close !== null) {
    const openMin = toMinutes(today.open);
    const closeMin = toMinutes(today.close);
    if (closeMin > openMin) {
      // same-day span
      if (nowMin >= openMin && nowMin < closeMin) return true;
    } else {
      // overnight span starting today (close <= open): open from openMin through midnight
      if (nowMin >= openMin) return true;
    }
  }

  if (yesterday.open !== null && yesterday.close !== null) {
    const yOpenMin = toMinutes(yesterday.open);
    const yCloseMin = toMinutes(yesterday.close);
    if (yCloseMin <= yOpenMin) {
      // yesterday's overnight span carries into today until yCloseMin
      if (nowMin < yCloseMin) return true;
    }
  }

  return false;
}

export function getOpenStatusLabel(hours: Hours, now: Date = new Date()): string {
  return isOpenNow(hours, now) ? "Open now" : "Closed";
}
