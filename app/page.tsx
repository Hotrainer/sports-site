import { getHockey } from "@/lib/hockey";
import { HockeyGames, HockeyStandings } from "@/components/hockey";
import { getLeague, getScorers } from "@/lib/provider";
import { kyivDate, adjacentDate } from "@/lib/dates";
import { MatchCard } from "@/components/matches-client";
import { StandingPreview, ScorerPreview } from "@/components/previews";
import { Suspense } from "react";
import { connection } from "next/server";
import AutoRefresh from "@/components/auto-refresh";

async function HomeContent() {
 await connection();
 const keys = ["1", "2a", "2b"] as const;
 const [leagues, scorers] = await Promise.all([Promise.all(keys.map(getLeague)), Promise.all(keys.map(getScorers))]);
 const today = kyivDate(new Date());
 const hockey = await getHockey(today);
 const names = ["Persha Liga", "Druga Liga · Group A", "Druga Liga · Group B"];
 const season = [...new Set(leagues.flatMap(l=>l.calendar ? [l.calendar.season] : []))].join(" / ");
 return <><AutoRefresh/><main className="home-main"><section className="hero"><div><p className="eyebrow">FOOTBALL & HOCKEY</p><h1>The game, day by day<span>.</span></h1><p className="intro">Persha Liga, Druga Liga & KHL. Every result, every point, every game.</p></div><div className="season-pill">Season {season || "unavailable"}</div></section>
 <div className="section-heading"><div><h2>Match centre</h2><p>Three days of Ukrainian football · all times in Kyiv.</p></div></div>
 <section className="daily-grid" aria-label="Yesterday, today and tomorrow matches">{[-1,0,1].map((offset,i)=>{const date=adjacentDate(today,offset); return <section className={`day-column ${offset===0 ? "today" : ""}`} key={date}><div className="day-heading"><h3>{["Yesterday","Today","Tomorrow"][i]}</h3><time dateTime={date}>{new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",timeZone:"UTC"}).format(new Date(`${date}T12:00:00Z`))}</time></div>{leagues.map((l,index)=>{const matches=(l.calendar?.tours.flatMap(t=>t.matches)??[]).filter(m=>m.date===date).sort((a,b)=>(a.time??"99:99").localeCompare(b.time??"99:99"));return <div className="day-league" key={keys[index]}><h4><a href={index===0 ? "/persha-liga" : `/druga-liga#group-${index===1?"a":"b"}`}>{names[index]}</a></h4>{!l.calendar ? <p className="day-empty">Match data is temporarily unavailable.</p> : matches.length ? matches.map(m=><MatchCard key={m.matchId} match={m} league={keys[index]}/>) : <p className="day-empty">No games scheduled.</p>}</div>})}</section>})}</section>
 <div className="section-heading"><div><h2>The race for the top</h2><p>First five clubs in each competition.</p></div></div><section className="summary-grid" aria-label="Standings previews"><article className="summary-card"><div className="card-heading"><h2>Persha Liga</h2><a href="/persha-liga">Full league →</a></div><StandingPreview rows={leagues[0].standings} title="League standings"/></article><article className="summary-card"><div className="card-heading"><h2>Druga Liga</h2><a href="/druga-liga">Full league →</a></div><StandingPreview rows={leagues[1].standings} title="Group A"/><StandingPreview rows={leagues[2].standings} title="Group B"/></article></section>
 <div className="section-heading"><div><h2>Leading the scoresheet</h2><p>The season’s best scorers.</p></div></div><section className="summary-grid" aria-label="Top scorers"><article className="summary-card"><div className="card-heading"><h2>Persha Liga</h2><span>Top scorers</span></div><ScorerPreview {...scorers[0]}/></article><article className="summary-card"><div className="card-heading"><h2>Druga Liga</h2><span>Groups A + B</span></div><ScorerPreview players={[...scorers[1].players,...scorers[2].players]} unavailable={scorers[1].unavailable || scorers[2].unavailable} druga/></article></section>
 <div className="section-heading"><div><h2>On the ice · KHL</h2><p>Yesterday, today and tomorrow · all times in Kyiv.</p></div><a href="/hockey">Hockey page →</a></div><HockeyGames data={hockey}/><div className="section-heading"><div><h2>The conference leaders</h2><p>First five teams in each KHL conference.</p></div></div><HockeyStandings data={hockey} preview/>
 <aside className="source-note"><div><h3>From the league, to your screen.</h3><p>Fixtures and standings from <a href="https://pfl.ua/custom/6">PFL’s public feeds</a>. Scorer rankings from official standings pages. Data refreshes automatically every five minutes. Match details are shown only when scorers reconcile with the published score.</p><small>Page generated {new Intl.DateTimeFormat("en-GB",{dateStyle:"medium",timeStyle:"short",timeZone:"Europe/Kyiv"}).format(new Date())} (Kyiv).</small></div></aside></main></>;
}

export default function Home() { return <Suspense fallback={<main><p className="empty">Loading sports…</p></main>}><HomeContent/></Suspense>; }
