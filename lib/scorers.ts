import { load } from "cheerio";
export type Scorer = { id: string; player: string; team: string; goals: number; group: string };
export function parseScorers(html: string, group: string): Scorer[] {
 const $ = load(html);
 const players: Scorer[] = [];
 $(".row-bombardiers").each((_, row) => {
  const cells = $(row).children("div");
  const player = cells.eq(2).text().replace(/\s+/g, " ").trim();
  const team = cells.eq(4).text().replace(/\s+/g, " ").trim();
  const value = cells.eq(5).text().trim();
  const id = cells.eq(2).find("a").attr("href")?.match(/\/player\/view\/(\d+)/)?.[1];
  if (!id || !player || !team || !/^\d+$/.test(value)) throw Error("Unrecognized scorer row");
  players.push({ id, player, team, goals: Number(value), group });
 });
 if (!players.length) throw Error("Scorer ranking unavailable");
 return players.sort((a,b) => b.goals - a.goals);
}
