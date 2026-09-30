import { z } from "zod";
const number = z.coerce.number().int();
const team = z.object({ teamId: number, name: z.string() });
export const matchSchema = z.object({
  matchId: number,
  date: z.string().nullable(),
  time: z.string().nullable(),
  home: team,
  away: team,
  score: z
    .object({
      home: number.nullable(),
      away: number.nullable(),
      finished: z.boolean(),
    })
    .nullable(),
});
export const calendarSchema = z.object({
  season: z.string(),
  tournamentId: number,
  tours: z.array(z.object({ tour: number, matches: z.array(matchSchema) })),
});
export const standingsSchema = z
  .array(
    z.object({
      teamId: number,
      position: number,
      team: z.string(),
      matches: number,
      wins: number,
      draws: number,
      losses: number,
      goalsFor: number,
      goalsAgainst: number,
      goalDiff: number,
      points: number,
    }),
  )
  .min(1);
export type Match = z.infer<typeof matchSchema>;
export type Calendar = z.infer<typeof calendarSchema>;
export type Standing = z.infer<typeof standingsSchema>[number];
export type Goal = { player: string; minute: string; side: "home" | "away" };
export type LeagueData = {
  calendar: Calendar | null;
  standings: Standing[];
  fetchedAt: string;
  errors: string[];
};
