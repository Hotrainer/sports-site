export default function SourceNote() {
 return (
        <aside className="source-note">
          <span className="source-symbol" aria-hidden="true">
            ↗
          </span>
          <div>
            <h3>From the league, to your screen.</h3>
            <p>
              Scores and standings come from{" "}
              <a
                href="https://pfl.ua/custom/6"
                target="_blank"
                rel="noreferrer"
              >
                PFL’s public feeds
              </a>
              . Scorers are read from official match reports and shown only when
              they match the published score.
            </p>
            <small>Data refreshes automatically every 5 minutes. Source updates may be delayed.</small>
          </div>
        </aside>
 );
}
