import { cache } from "react";
import { z } from "zod";
import { adjacentDate, kyivDate } from "./dates";

const team = z.object({ id: z.number(), name: z.string() });
const match = z.object({ id: z.number(), date: z.string().datetime(), homeTeam: team, awayTeam: team, state: z.object({ description: z.string(), score: z.object({ current: z.string().nullable() }) }) });
const row = z.object({ team, position: z.number(), gamesPlayed: z.number(), wins: z.number(), loses: z.number(), winsOvertime: z.number(), losesOvertime: z.number(), scoredGoals: z.number(), receivedGoals: z.number() });
const groupsSchema = z.object({ groups: z.array(z.object({ name: z.string(), standings: z.array(row) })) });
export type HockeyMatch = z.infer<typeof match>;
export type HockeyGroup = z.infer<typeof groupsSchema>["groups"][number];
export function hockeySeason(date: string) { const [year, month] = date.split("-").map(Number); return month >= 7 ? year : year - 1; }
export function hockeyPoints(r: z.infer<typeof row>) { return 2 * (r.wins + r.winsOvertime) + r.losesOvertime; }

async function snapshot(path: string) {
 // Explicit fetch caching uses the shared, persistent Vercel Data Cache.
 const key = process.env.HIGHLIGHTLY_API_KEY;
 if (!key) throw new Error("Hockey API key is not configured");
 const response = await fetch(`https://hockey.highlightly.net/${path}`, { headers: { "x-rapidapi-key": key }, signal: AbortSignal.timeout(15000), cache: "force-cache", next: { revalidate: 7200 } });
 if (!response.ok) throw new Error(`Hockey API status ${response.status}`);
 return { payload: await response.json() as unknown, updatedAt: response.headers.get("date") ? new Date(response.headers.get("date")!).toISOString() : new Date().toISOString() };
}
async function games(date: string, season: number) {
 try { const result = await snapshot(`matches?leagueId=30569&season=${season}&date=${date}&timezone=Europe%2FKyiv&limit=100`); return { date, matches: z.object({ data: z.array(match) }).parse(result.payload).data, updatedAt: result.updatedAt, unavailable: false }; }
 catch { return { date, matches: [] as HockeyMatch[], updatedAt: null, unavailable: true }; }
}
export const getHockey = cache(async (today: string) => {
 const season = hockeySeason(today);
 const [days, standings] = await Promise.all([
  Promise.all([-1, 0, 1].map(offset => games(adjacentDate(today, offset), season))),
  (async () => { try { const result = await snapshot(`standings?leagueId=30569&season=${season}`); return { groups: groupsSchema.parse(result.payload).groups, updatedAt: result.updatedAt, unavailable: false }; } catch { return { groups: [] as HockeyGroup[], updatedAt: null, unavailable: true }; } })()
 ]);
 return { days, standings, season };
});
export type HockeyData = Awaited<ReturnType<typeof getHockey>>;
export { kyivDate };
