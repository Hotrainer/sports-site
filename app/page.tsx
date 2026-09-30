import { Suspense } from "react";
import Dashboard from "@/components/dashboard";
import Matches from "@/components/matches";
import Standings from "@/components/standings";
import Overview from "@/components/overview";
import SourceNote from "@/components/source-note";

function Loading({ label }: { label: string }) {
  return <p className="empty" role="status">Loading {label}…</p>;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<Loading label="season overview" />}><Overview /></Suspense>
      <Dashboard
        matches={<Suspense fallback={<Loading label="matches" />}><Matches /></Suspense>}
        standings={<Suspense fallback={<Loading label="standings" />}><Standings /></Suspense>}
      />
      <SourceNote />
    </main>
  );
}
