import { cacheLife } from "next/cache";

export default async function Header() {
  "use cache";
  cacheLife({ stale: 2592000, revalidate: 2592000, expire: 2678400 });
  return (
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Touchline home">
          <span className="brand-icon" aria-hidden="true">
            H
          </span>
          hotrainer<span className="brand-dot">.</span>
        </a>
        <span className="header-note">A niched sports</span>
        <span className="country">
          <i aria-hidden="true" />
          Ukraine
        </span>
      </header>
  );
}
