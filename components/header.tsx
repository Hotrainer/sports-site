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
        <nav className="site-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/persha-liga">Persha Liga</a><a href="/druga-liga">Druga Liga</a><a href="/hockey">Hockey</a></nav>
        <span className="country">
          <i aria-hidden="true" />
          Ukraine
        </span>
      </header>
  );
}
