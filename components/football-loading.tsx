export default function FootballLoading() {
  return (
    <div className="football-loading" role="status" aria-label="Loading">
      <svg className="football-loading-ball" viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="29" fill="var(--paper)" stroke="currentColor" strokeWidth="2" />
        <g fill="currentColor">
          <path d="M32 21 43 29 39 42H25L21 29Z" />
          <path d="M22 5 32 11 42 5 32 3Z M59 22 50 23 47 12 54 16Z M51 54 47 44 58 39 57 48Z M13 54 17 44 6 39 7 48Z M5 22 14 23 17 12 10 16Z" />
        </g>
        <path d="M32 11V21M50 23 43 29M47 44 39 42M17 44 25 42M14 23 21 29" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}
