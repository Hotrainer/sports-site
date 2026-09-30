# Touchline — Persha Liga

A responsive Next.js App Router / TypeScript site for Ukrainian second-tier football. It includes every round, a club filter, match scores, expandable goal scorers and the complete official standings (P/W/D/L/GF/GA/GD/Pts). Calm green/stone colours and system fonts; no font-service dependency.

## Run

Requires Node.js 20.9+ (verified on Node 24).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Production: `npm run build && npm start`. No API key or environment variables are required.

## Data research — 30 September 2026

| Source                                                                   | Free access                                             | Decision                                                                                         |
| ------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [Official PFL API](https://pfl.ua/custom/6)                              | Public GET endpoints, no authentication or API key      | Selected. Verified current 2026/27 calendar and all 16 standings rows.                           |
| [API-Football](https://www.api-football.com/pricing)                     | $0 tier, 100 requests/day; available seasons restricted | Not selected: current Persha Liga season/event coverage under the free account was not verified. |
| [AnySport Persha Liga](https://anysport.io/leagues/ukraine-persha-liga/) | Advertises a free trial                                 | Not a verified permanently free option.                                                          |

The official feed is genuinely accessible without payment or registration, not a trial. The documentation does not publish an SLA, explicit rate limit, or a broad redistribution licence. Free technical access is not a claim that all associated material is openly licensed. The UI attributes and links to PFL. No team logos or photographs are copied into the app.

### Endpoints and limitations

- `https://pfl.ua/calendar-json/1`: current season, all rounds, fixture dates, scores and completion flags.
- `https://pfl.ua/standing-json-tv/1`: full official standings. Preserve the provider's ranking instead of guessing tie-breaks.
- `https://pfl.ua/game/index/{id}`: public match report, used on demand for scorers. PFL does not document an events API; this is HTML parsing and can break when their markup changes. Current normal and penalty goal icons are parsed; unrecognized events (including unsupported own-goal markup) produce an unavailable state if the totals do not reconcile. Goal types are not labelled. A report link remains available.
- Scorer lists are displayed only when home and away goal counts agree with the published finished score. Unfinished matches do not claim confirmed events. Zero-zero results need no report fetch. Penalty shootouts are not represented in this league UI.
- Time/stadium values may be null under PFL publication rules. The app does not infer withheld times. Dates and kick-offs are presented as supplied, labelled Kyiv time.
- Current season only; no archive selector, automatic group discovery, push updates or guaranteed live minute/status. Unfinished games are labelled scheduled/unconfirmed because the feed does not expose a reliable live status here.
- Matches and standings stream independently through Suspense and fetch fresh data per request. Open pages refresh every five minutes while preserving tabs and filters. Shared feed reads are deduplicated within each render. Header and footer use Cache Components with 30-day revalidation (31-day hard expiry).
- Calendar and standings fail independently with explicit messages. No fabricated or sample fallback data appears in production. Network requests have a 12-second timeout. Match IDs must belong to the current official calendar.

## Swap the data provider

`lib/schema.ts` defines the normalized UI types. Replace `footballProvider.getCalendar()`, `.getStandings()`, `.getLeague()` and `.getGoals(id)` in `lib/provider.ts` to switch providers; UI components and the match API route consume only these methods. `lib/goals.ts` isolates the fragile HTML parser. All upstream requests happen on the server.

## Verification

```sh
npm test
npm run typecheck
npm run build
```

Seven tests cover independent fresh feed loading, feed failure isolation, nullable fixture data, full-table arithmetic, a 0–1 scorer report, a 4–4 report (including penalty goal icons), and incomplete markup detection. Recorded PFL responses in `tests/fixtures` are test-only evidence, never app fallback data. Local production build passed; browser verified standings, mobile rendering and real match scorer expansion (Інгулець 2–1 Прикарпаття-Благо).

## Vercel

Deploy this folder with the Next.js preset. No environment variables are needed.

```sh
vercel login
vercel --prod
```

Deployment was attempted on 30 September 2026. The saved Vercel OAuth session could not refresh; the CLI also could not persist its auth configuration within the session sandbox. No deployment or public URL was produced. Reauthenticate before retrying. No paid plan was purchased.
# sports-site
