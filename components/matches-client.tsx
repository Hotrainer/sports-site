"use client";
import { useState } from "react";
import FootballLoading from "@/components/football-loading";
import type { Calendar, Match, Goal } from "@/lib/schema";
function dateLabel(date: string | null) {
  return date
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${date}T12:00:00Z`))
    : "Date to be confirmed";
}
export function MatchCard({ match, league = "1" }: { match: Match; league?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    goals: Goal[];
  } | null>(null);
  async function toggle() {
    setOpen(!open);
    if (open || result || loading) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/matches/${match.matchId}?league=${league}`);
      if (!r.ok) throw Error();
      setResult(await r.json());
    } catch {
      setResult({ status: "unavailable", goals: [] });
    } finally {
      setLoading(false);
    }
  }
  const finished = match.score?.finished;
  const scored = match.score?.home != null && match.score?.away != null;
  return (
    <article className="match">
      <div className="match-meta">
        <span>
          {dateLabel(match.date)}
          {match.time ? ` · ${match.time}` : ""}
        </span>
        <span className={finished ? "status" : "status scheduled"}>
          {finished ? "Full time" : "Scheduled / unconfirmed"}
        </span>
      </div>
      <div className="teams">
        <div>
          <span className="team-mark">{match.home.name.slice(0, 1)}</span>
          <span lang="uk">{match.home.name}</span>
          <strong>{scored ? match.score!.home : "–"}</strong>
        </div>
        <div>
          <span className="team-mark away">{match.away.name.slice(0, 1)}</span>
          <span lang="uk">{match.away.name}</span>
          <strong>{scored ? match.score!.away : "–"}</strong>
        </div>
      </div>
      <button
        className="details-button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`goals-${match.matchId}`}
      >
        {open ? "Hide match details" : "Goal scorers & match details"}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div
          className="goal-details"
          id={`goals-${match.matchId}`}
          aria-live="polite"
        >
          {loading ? (
            <FootballLoading />
          ) : result?.status === "complete" ? (
            result.goals.length ? (
              <ul>
                {result.goals.map((g, i) => (
                  <li key={i}>
                    <span className="minute">{g.minute}′</span>
                    <span lang="uk">
                      {g.player}
                      <small>
                        {g.side === "home" ? match.home.name : match.away.name}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No goals in this match.</p>
            )
          ) : (
            <p>
              {result?.status === "pending"
                ? "Scorers will be available after the official result is confirmed."
                : "Scorers are unavailable or could not be verified against the score."}
            </p>
          )}
          <a
            href={`https://pfl.ua/game/index/${match.matchId}`}
            target="_blank"
            rel="noreferrer"
          >
            Official match report ↗
          </a>
        </div>
      )}
    </article>
  );
}
export default function MatchesClient({ calendar, league = "1" }: { calendar: Calendar; league?: string }) {
  const tours = calendar?.tours ?? [];
  const initial =
    [...tours].reverse().find((t) => t.matches.some((m) => m.score?.finished))
      ?.tour ??
    tours[0]?.tour ??
    1;
  const [round, setRound] = useState(initial);
  const [team, setTeam] = useState("all");
  const current = tours.find((t) => t.tour === round);
  const matches = (current?.matches ?? []).filter(
    (m) =>
      team === "all" ||
      m.home.teamId === Number(team) ||
      m.away.teamId === Number(team),
  );
  const clubs = [...new Map(tours.flatMap(t => t.matches.flatMap(m => [m.home, m.away])).map(t => [t.teamId, t])).values()];
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>Match centre</h2>
          <p>Results and fixtures, round by round.</p>
        </div>
        <div className="filters">
          <label>
            Round
            <select
              value={round}
              onChange={(e) => setRound(Number(e.target.value))}
            >
              {tours.map((t) => (
                <option key={t.tour} value={t.tour}>
                  Round {t.tour}
                </option>
              ))}
            </select>
          </label>
          <label>
            Club
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            >
              <option value="all">All clubs</option>
              {clubs.map((t) => (
                <option key={t.teamId} value={t.teamId}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="round-title">
        <span>ROUND {round}</span>
        <small>{matches.length} matches · Times in Kyiv</small>
      </div>
      <div className="match-grid">
        {matches.map((m) => (
          <MatchCard key={m.matchId} match={m} league={league} />
        ))}
      </div>
      {!matches.length && (
        <div className="empty">
          No matches available for this selection.
        </div>
      )}
      <p className="footnote">
        Kick-off times may be withheld by PFL. Results are periodically
        refreshed, not a live commentary feed.
      </p>
    </>
  );
}
