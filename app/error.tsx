"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main>
      <h1>Unable to load the league</h1>
      <p>Please try again in a moment.</p>
      <button onClick={reset}>Try again</button>
    </main>
  );
}
