import { cache } from "react";
import { calendarSchema, standingsSchema, type LeagueData } from "./schema";
import { parseGoals, goalsMatchScore } from "./goals";
const BASE = "https://pfl.ua";
async function get(path: string) {
  const response = await fetch(`${BASE}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`PFL returned ${response.status}`);
  return response;
}
// Deduplicate shared feed reads within a render without caching between requests.
const getCalendar = cache(async () => calendarSchema.parse(await (await get("/calendar-json/1")).json()));
const getStandings = cache(async () => standingsSchema.parse(await (await get("/standing-json-tv/1")).json()));
// Replace this adapter to move to a different provider; the UI uses normalized types only.
export const footballProvider = {
  getCalendar,
  getStandings,
  async getLeague(): Promise<LeagueData> {
    const [calendar, standings] = await Promise.allSettled([
      getCalendar(),
      getStandings(),
    ]);
    return {
      calendar: calendar.status === "fulfilled" ? calendar.value : null,
      standings: standings.status === "fulfilled" ? standings.value : [],
      fetchedAt: new Date().toISOString(),
      errors: [
        ...(calendar.status === "rejected"
          ? ["Match data is temporarily unavailable."]
          : []),
        ...(standings.status === "rejected"
          ? ["Standings are temporarily unavailable."]
          : []),
      ],
    };
  },
  async getGoals(id: number) {
    const calendar = calendarSchema.parse(
      await (await get("/calendar-json/1")).json(),
    );
    const match = calendar.tours
      .flatMap((t) => t.matches)
      .find((m) => m.matchId === id);
    if (!match) return { status: "not-found" as const, goals: [] };
    if (!match.score?.finished)
      return { status: "pending" as const, goals: [] };
    if (match.score.home === 0 && match.score.away === 0)
      return { status: "complete" as const, goals: [] };
    const goals = parseGoals(await (await get(`/game/index/${id}`)).text());
    const complete =
      match.score.home !== null &&
      match.score.away !== null &&
      goalsMatchScore(goals, match.score.home, match.score.away);
    return {
      status: complete ? ("complete" as const) : ("unavailable" as const),
      goals: complete ? goals : [],
    };
  },
};
