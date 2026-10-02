import type { LeagueKey } from "@/lib/provider";
import { connection } from "next/server";
import { footballProvider } from "@/lib/provider";
import MatchesClient from "./matches-client";

export default async function Matches({ league = "1", title = "Persha Liga" }: { league?: LeagueKey; title?: string }) {
  await connection();
  const calendar = await footballProvider.getCalendar(league).catch(() => null);
  if (!calendar) return <p className="notice" role="alert">Match data is temporarily unavailable.</p>;
  return <MatchesClient calendar={calendar} league={league} />;
}
