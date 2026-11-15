# freelance

Config-driven homepage mockup generator for pitching local small-business
website concepts. Built to go from "new client" to a shareable, on-brand
homepage mockup in under 30 minutes. React + TypeScript + Vite + Tailwind
CSS v4, no backend — every client is a validated TypeScript config object,
checked against a Zod schema at load time.

## Setup

```bash
npm install
npm run dev
```

- `/` — owner-only listing of every registered client (dev convenience, not
  for client eyes — `index.html` ships `<meta name="robots" content="noindex">`).
- `/<slug>` — a specific client's mockup homepage, e.g. `/sunrise-cafe`.

Routing is plain client-side (`window.location.pathname`, see
`src/Router.tsx`) — no router library, no server-side routes.

## New-client workflow (the 30-minute promise)

```bash
npm run new-client -- <slug> --preset <category>
```

This runs `scripts/new-client.mjs`, which:

1. Validates `<slug>` is url-safe (lowercase, hyphenated — same regex the
   schema enforces).
2. Validates `--preset <category>` is one of the 7 valid categories.
3. Refuses to overwrite `src/clients/<slug>.ts` if it already exists.
4. Writes `src/clients/<slug>.ts`, exporting
   `mergeWithPreset(presetsByCategory["<category>"], { ... })` — the
   category preset's defaults merged with your overrides.

The file auto-registers — `src/clients/index.ts` globs every `*.ts` file in
that folder, so just dropping the file in is enough; no manual wiring.

**Valid `--preset` categories** (from `src/presets/index.ts`):
`restaurant`, `salon`, `contractor`, `auto-shop`, `fitness`, `retail`, `dental`

**What you must fill in** — the generated file marks these `REQUIRED — no
preset default, must fill in for real` and fills them with `TODO: ...`
placeholders. The mockup is not meeting-ready until every one is real:
`name`, `phone`, `address`, `heroImage.src`/`heroImage.alt`, and all 7
`hours` entries (`open`/`close`, or `null` for a closed day).

**What's optional** — commented out in the generated file, each marked
`OPTIONAL — preset already supplies a default`. Uncomment and edit only if
this client needs something different from the category default:
`tagline`, `about`, `aboutImage`, `offerings`, `reviews`, `gallery`,
`socials`, `bookingUrl`, `logo`. `theme`, `mapsUrl`, and `primaryCTA` also
come from the preset and can be overridden the same way even though the
script doesn't scaffold a commented block for them — just add the key.

`src/schema.ts` (`ClientConfigSchema`) is the single source of truth for
every field, its type, and what's required. If this README and the schema
ever disagree, trust the schema and flag it.

## Key config fields (`ClientConfig`, from `src/schema.ts`)

| Field | Required? | Notes |
| --- | --- | --- |
| `name` | required | business display name |
| `slug` | required | url-safe, lowercase-hyphenated — must match the route |
| `category` | required | one of the 7 categories, drives preset + theme defaults |
| `tagline` | required | short line under the business name |
| `logo` | optional | `Image` — omit to fall back to a text logo |
| `heroImage` | required | `Image` — also the LCP element, preloaded per-client |
| `theme` | required | colors + fonts, see "Theme/colors" below |
| `phone` | required | free-text string |
| `email` | optional | validated as an email string |
| `address` | required | free-text street address |
| `mapsUrl` | required | must be a valid URL |
| `hours` | required | **exactly 7 entries, one per day, no dupes/missing days** (schema-enforced). `open`/`close` are `"HH:MM"` or `null` (closed). Overnight spans where `close` < `open` are a valid shape (e.g. bar open 18:00–02:00) — "is it open now" logic is intentionally out of scope. |
| `offerings` | optional | one shape covers both menu items (restaurant) and services (salon/contractor/etc) — `name` + optional `description`/`price` |
| `about` | required | paragraph of body text |
| `aboutImage` | optional | `Image` |
| `reviews` | required | array, **max 3** (schema-enforced `.max(3)`) — pick the best 3 |
| `gallery` | optional | array of `Image` |
| `primaryCTA` | required | `{ label, type }`, `type` is one of `call` \| `book` \| `directions` \| `order` |
| `bookingUrl` | optional | must be a valid URL, used when `primaryCTA.type` needs a link |
| `socials` | optional | `instagram`/`facebook`/`tiktok`, each optional, each must be a valid URL if present |
| `sectionOrder` | optional | array of section names controlling render order; preset sets a sensible default, override to reorder/omit sections |

`Image` (used by `logo`, `heroImage`, `aboutImage`, `gallery` entries) is
always `{ src: string; alt: string }` — **`alt` is always required, never
optional, schema-enforced.** No silently missing alt text.

## Swapping images

Every `Image.src` is just a URL string — there's no bundled-asset pipeline
by default. The 3 example clients (`sunrise-cafe`, `ironclad-contracting`,
`bella-salon`) use `picsum.photos`/`placehold.co` placeholder URLs for exactly
this reason: they're disposable stand-ins, swap them for the real thing.

For a real client mockup, two options:

**(a) Use a real hosted URL (fastest)** — if the client/owner already has
images hosted somewhere (their current site, Google Business Profile,
Instagram CDN link, etc.), just paste that URL straight into `src`:

```ts
heroImage: {
  src: "https://clientswebsite.com/images/storefront.jpg",
  alt: "Storefront of Joe's Hardware with the red awning and open sign lit",
},
```

**(b) Drop a local file into `public/`** — this project has a Vite
`public/` folder (already serving `favicon.svg`, `icons.svg`). Anything in
`public/` is served as-is from the site root, no import needed. Put client
images under a per-slug folder and reference the absolute path:

```
public/clients/sunrise-cafe/hero.jpg
```

```ts
heroImage: {
  src: "/clients/sunrise-cafe/hero.jpg",
  alt: "Warm interior of Sunrise Café with wooden tables and morning light",
},
```

Either way, write real, descriptive `alt` text — the schema will reject a
missing `alt`, but it can't catch a lazy one, so don't leave it generic.

## Theme/colors

Each category preset (`src/presets/<category>.ts`) ships a default `theme`
— `primary`/`accent`/`background`/`text` colors and `fontHeading`/`fontBody`
font names. If a client's real brand colors or fonts differ from their
category's default, override `theme` (or individual keys) in the client
config the same way as any other field:

```ts
theme: {
  ...someBaseTheme, // or just hand-write all 6 keys
  primary: "#0a4d2e",
  fontHeading: "Playfair Display",
},
```

These values are applied as real runtime CSS custom properties per client
(`buildThemeStyle` in `src/Router.tsx`) — colors and fonts genuinely change
per client at runtime, not just in theory. A dev-only WCAG AA contrast
checker (`src/lib/contrast.ts`) warns in the console if a theme's
text/background pairing fails accessibility contrast — stripped from prod.

## Deploying to Vercel

This is a single-page app with client-side-only routing (`window.location`,
no history API usage beyond reading the path) — Vercel needs to be told to
serve `index.html` for every path so refreshing `/<slug>` doesn't 404.
There's no `vercel.json` in this repo yet — add one:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**All clients live in one deployed app, under one Vercel project.** Slugs
are just paths — `yourapp.vercel.app/sunrise-cafe`,
`yourapp.vercel.app/bella-salon`, etc. — not separate deployments. This
matches how the app is actually built: one client registry, many clients,
one build. This is the recommended default.

If a specific client ever needs their own standalone URL/domain (e.g. for a
pitch that shouldn't reveal the app's other clients), Vercel's
preview-deployment-per-branch, or a second Vercel project pointed at the
same repo with a custom domain, are both options — but treat that as the
exception, not the default.

## CI

`.github/workflows/ci.yml` runs on every push/PR: `npm ci` →
`npx tsc --noEmit` → `npx vitest run` → `npm run build`.
