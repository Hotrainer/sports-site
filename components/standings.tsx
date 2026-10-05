import type { LeagueKey } from "@/lib/provider";
import { footballProvider } from "@/lib/provider";
import { connection } from "next/server";

export default async function Standings({ league = "1", title = "Persha Liga" }: { league?: LeagueKey; title?: string }) {
  await connection();
  const standings = await footballProvider.getStandings(league).catch(() => []);
  return (
    <>
      <div className="section-heading">
        <div>
          <h2>League standings</h2>
          <p>The full picture. Every club, every point.</p>
        </div>
        <span className="table-hint">Scroll table horizontally on small screens →</span>
      </div>
      <div className="table-wrap full-standings" tabIndex={0} aria-label="Full standings table">
        <table style={{ "--stat-count": 8 } as import("react").CSSProperties}>
          <colgroup>
            <col className="standings-position" />
            <col className="standings-club" />
            {Array.from({ length: 8 }, (_, i) => <col className="standings-stat" key={i} />)}
          </colgroup>
          <caption className="sr-only">{title} standings</caption>
          <thead>
            <tr>
              {["Pos", "Club", "P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map(h => (
                <th key={h} scope="col">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map(t => (
              <tr key={t.teamId}>
                <td>{t.position}</td>
                <th scope="row" lang="uk">{t.team}</th>
                <td>{t.matches}</td>
                <td>{t.wins}</td>
                <td>{t.draws}</td>
                <td>{t.losses}</td>
                <td>{t.goalsFor}</td>
                <td>{t.goalsAgainst}</td>
                <td>{t.goalDiff > 0 ? "+" : ""}{t.goalDiff}</td>
                <td className="points">{t.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!standings.length && <p className="empty" role="alert">Standings are currently unavailable.</p>}
      <p className="footnote">
        P: played · W: won · D: drawn · L: lost · GF/GA: goals for/against ·
        GD: goal difference · Pts: points. Ranking follows PFL, including its tie-break rules.
      </p>
    </>
  );
}
