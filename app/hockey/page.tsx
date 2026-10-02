import { Suspense } from "react";
import { connection } from "next/server";
import { getHockey, kyivDate } from "@/lib/hockey";
import { HockeyGames, HockeyStandings } from "@/components/hockey";
import AutoRefresh from "@/components/auto-refresh";
export const metadata = { title: "KHL Hockey | Hotrainer", description: "KHL games, division standings and conference standings." };
async function HockeyContent() {
 await connection();
 const data = await getHockey(kyivDate(new Date()));
 return <main className="home-main"><AutoRefresh/><section className="hero"><div><p className="eyebrow">HOCKEY / KHL</p><h1>On the ice<span>.</span></h1><p className="intro">Games, divisions and conferences. All times in Kyiv.</p></div><div className="season-pill">Season {data.season}/{String(data.season+1).slice(-2)}</div></section><div className="section-heading"><h2>Match centre</h2></div><HockeyGames data={data}/><div className="section-heading"><h2>Division standings</h2></div><HockeyStandings data={data} divisions/><div className="section-heading"><h2>Conference standings</h2></div><HockeyStandings data={data}/><aside className="source-note"><div><h3>From the rink, to your screen.</h3><p>Games and standings supplied by <a href="https://highlightly.net/hockey-api/">Highlightly</a>. Shared data refreshes every two hours. Standings may lag behind final scores.</p><p className="footnote">P: played · W: regulation wins · OTW: overtime/shootout wins · OTL: overtime/shootout losses · L: regulation losses · GF–GA: goals for–against. Points: two per win, one per overtime/shootout loss. Rankings follow the provider’s positions.</p></div></aside></main>;
}
export default function HockeyPage() { return <Suspense fallback={<main><p className="empty">Loading hockey…</p></main>}><HockeyContent/></Suspense>; }
