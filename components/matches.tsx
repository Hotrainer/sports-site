import { connection } from "next/server";
import { footballProvider } from "@/lib/provider";
import MatchesClient from "./matches-client";

export default async function Matches() {
  await connection();
  const calendar = await footballProvider.getCalendar().catch(() => null);
  if (!calendar) return <p className="notice" role="alert">Match data is temporarily unavailable.</p>;
  return <MatchesClient calendar={calendar} />;
}
