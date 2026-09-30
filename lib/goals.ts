import { load } from "cheerio";
import type { Goal } from "./schema";
// PFL has no documented events API. Read only its public match timeline.
// Expanded rows contain one event each; ignore the duplicate collapsed icon.
export function parseGoals(html: string): Goal[] {
  const $ = load(html);
  const goals: Goal[] = [];
  $(".timeline .timeline_card").each((_, card) => {
    const side = $(card).attr("style")?.includes("bottom:") ? "home" : "away";
    $(card)
      .find(".expanded > .row")
      .each((_, row) => {
        if (!$(row).find(".icon-ball, .icon-ball-plus").length) return;
        const minute = $(row).children(".col-auto").first().text().trim();
        const player = $(row)
          .children(".col")
          .find(".row")
          .first()
          .text()
          .replace(/\s+/g, " ")
          .trim();
        if (!player || !/^\d+(\+\d+)?$/.test(minute))
          throw new Error("Unrecognized goal markup");
        goals.push({ player, minute, side });
      });
  });
  return goals.sort(
    (a, b) =>
      a.minute
        .split("+")
        .map(Number)
        .reduce((x, y) => x + y, 0) -
      b.minute
        .split("+")
        .map(Number)
        .reduce((x, y) => x + y, 0),
  );
}
export function goalsMatchScore(goals: Goal[], home: number, away: number) {
  return (
    goals.filter((g) => g.side === "home").length === home &&
    goals.filter((g) => g.side === "away").length === away
  );
}
