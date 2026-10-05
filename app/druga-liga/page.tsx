import FootballLoading from "@/components/football-loading";
import { Suspense } from "react";
import Dashboard from "@/components/dashboard";
import Matches from "@/components/matches";
import Standings from "@/components/standings";
import Overview from "@/components/overview";
import SourceNote from "@/components/source-note";
import type { LeagueKey } from "@/lib/provider";
function League({ league, title }: { league: LeagueKey; title: string }) { return <><Suspense fallback={<FootballLoading/>}><Overview league={league} title={title}/></Suspense><Dashboard league={league} matches={<Suspense fallback={<FootballLoading/>}><Matches league={league}/></Suspense>} standings={<Suspense fallback={<FootballLoading/>}><Standings league={league} title={title}/></Suspense>}/><SourceNote/></>; }
export default function DrugaLiga() { return <main className="druga-main"><nav className="group-nav"><a href="#group-a">Group A ↓</a><a href="#group-b">Group B ↓</a></nav><section id="group-a"><League league="2a" title="Druga Liga · Group A"/></section><section id="group-b"><League league="2b" title="Druga Liga · Group B"/></section></main>; }
