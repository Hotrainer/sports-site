import type { LeagueKey } from "@/lib/provider";
import { connection } from "next/server";
import { footballProvider } from "@/lib/provider";

export default async function Overview({ league = "1", title = "Persha Liga" }: { league?: LeagueKey; title?: string }) {
  await connection();
  const data = await footballProvider.getLeague(league);
  const tours = data.calendar?.tours ?? [];
  const completed = tours
    .flatMap((t) => t.matches)
    .filter((m) => m.score?.finished);
  const goals = completed.reduce(
    (sum, m) => sum + (m.score?.home ?? 0) + (m.score?.away ?? 0),
    0,
  );
  return <>
        <section className="hero">
          <div>
            <p className="eyebrow">FOOTBALL / UKRAINE</p>
            <h1>
              {title}<span>.</span>
            </h1>
            <p className="intro">
              Every result. Every point. Follow the season.
            </p>
          </div>
          <div className="season-pill">
            <span className="pulse" />
            Season {data.calendar?.season ?? "unavailable"}
          </div>
        </section>
        <section className="overview" aria-label="Season overview">
          <div>
            <span>THE COMPETITION</span>
            <strong>
              {data.standings.length || "—"} <small>clubs</small>
            </strong>
          </div>
          <div>
            <span>MATCHES COMPLETED</span>
            <strong>{data.calendar ? completed.length : "—"}</strong>
          </div>
          <div>
            <span>GOALS SCORED</span>
            <strong>{data.calendar ? goals : "—"}</strong>
          </div>
          <div className="source-stat">
            <span>STRAIGHT FROM THE SOURCE</span>
            <strong>
              Official PFL <span className="verified">↗</span>
            </strong>
            <small>Public data · checked every 5 minutes</small>
          </div>
        </section>
  </>;
}
