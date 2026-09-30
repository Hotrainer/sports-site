"use client";
import { useEffect, useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard({ matches, standings }: { matches: ReactNode; standings: ReactNode }) {
  const [tab, setTab] = useState<"matches" | "standings">("matches");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    const refresh = () => startTransition(() => router.refresh());
    const timer = window.setInterval(refresh, 300_000);
    return () => window.clearInterval(timer);
  }, [router]);
  return (
    <>
      <div className="tabs" role="tablist" aria-label="League views">
        {(["matches", "standings"] as const).map(view => (
          <button key={view} role="tab" aria-selected={tab === view}
            aria-controls={view + "-panel"} id={view + "-tab"}
            onClick={() => setTab(view)}>
            {view === "matches" ? "Matches" : "Standings"}
          </button>
        ))}
      </div>
      <section id="matches-panel" role="tabpanel" aria-labelledby="matches-tab" hidden={tab !== "matches"} aria-busy={pending}>
        {matches}
      </section>
      <section id="standings-panel" role="tabpanel" aria-labelledby="standings-tab" hidden={tab !== "standings"} aria-busy={pending}>
        {standings}
      </section>
    </>
  );
}
