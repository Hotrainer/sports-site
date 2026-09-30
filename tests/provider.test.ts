import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseGoals, goalsMatchScore } from "../lib/goals";
import { calendarSchema, standingsSchema } from "../lib/schema";
const fixture = (name: string) =>
  readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8");
test("official calendar accepts unpublished dates and scores", () => {
  const c = calendarSchema.parse(JSON.parse(fixture("calendar.json")));
  assert.ok(c.tours.length > 0);
  assert.ok(c.tours.flatMap((t) => t.matches).some((m) => m.score === null));
});
test("full standings have internally consistent records", () => {
  const s = standingsSchema.parse(JSON.parse(fixture("standings.json")));
  assert.equal(s.length, 16);
  for (const r of s) {
    assert.equal(r.matches, r.wins + r.draws + r.losses);
    assert.equal(r.goalDiff, r.goalsFor - r.goalsAgainst);
  }
});
test("goal extraction excludes duplicate icons and cards", () => {
  const g = parseGoals(fixture("match-16123.html"));
  assert.deepEqual(g, [{ player: "Бойко Максим", minute: "82", side: "away" }]);
  assert.ok(goalsMatchScore(g, 0, 1));
});
test("multiple scorers and both timeline sides match official 4–4 score", () => {
  const g = parseGoals(fixture("match-16131.html"));
  assert.equal(g.length, 8);
  assert.ok(goalsMatchScore(g, 4, 4));
});
test("missing or changed markup cannot claim complete scoring data", () => {
  assert.equal(goalsMatchScore(parseGoals("<html></html>"), 2, 1), false);
});

test("calendar and standings loaders request only their own fresh feed", async (t) => {
  const { footballProvider } = await import("../lib/provider");
  const requests: string[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, options: RequestInit) => {
    requests.push(url);
    assert.equal(options.cache, "no-store");
    return new Response(fixture(url.includes("calendar") ? "calendar.json" : "standings.json"));
  });
  await footballProvider.getCalendar();
  assert.deepEqual(requests, ["https://pfl.ua/calendar-json/1"]);
  requests.length = 0;
  await footballProvider.getStandings();
  assert.deepEqual(requests, ["https://pfl.ua/standing-json-tv/1"]);
});

test("a failed feed leaves the other feed available", async (t) => {
  const { footballProvider } = await import("../lib/provider");
  for (const failedFeed of ["calendar", "standing"]) {
    const fetchMock = t.mock.method(globalThis, "fetch", async (url: string) => {
      if (url.includes(failedFeed)) return new Response("", { status: 503 });
      return new Response(fixture(url.includes("calendar") ? "calendar.json" : "standings.json"));
    });
    const data = await footballProvider.getLeague();
    assert.equal(data.errors.length, 1);
    assert.equal(data.calendar === null, failedFeed === "calendar");
    assert.equal(data.standings.length === 0, failedFeed === "standing");
    fetchMock.mock.restore();
  }
});
