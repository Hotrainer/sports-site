import { cacheLife } from "next/cache";

export default async function Footer() {
  "use cache";
  cacheLife({ stale: 2592000, revalidate: 2592000, expire: 2678400 });
  return (
      <footer>
        <span className="footer-brand">hotrainer.</span>
        <span>A little closer to Ukrainian football.</span>
        <a href="https://pfl.ua" target="_blank" rel="noreferrer">
          Visit PFL ↗
        </a>
      </footer>
  );
}
