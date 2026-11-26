# Double O — Date Night

An Astro static site at https://asankov.dev/007/.

## Update watched movies

Edit [`src/data/watched.json`](src/data/watched.json). Set a movie’s value to `true` for watched or `false` for not watched, keeping the existing keys:

```json
"1962-Dr. No": true
```

Commit and push to `main`. GitHub Actions builds and deploys the site automatically. The build validates every movie’s status and rejects missing, misspelled, or non-boolean entries.

Watched status is read-only on the website and comes exclusively from this file. No browser storage is used. The year distinguishes the two Casino Royale films. This file replaces the previous `dist/watched.json`; `dist/` is now generated build output.

## Development

Use Node.js 24 or newer.

```sh
npm ci
npm run dev
```

Open the local URL printed by Astro, including `/007/`.

```sh
npm run check
npm test
npm run build
npm run preview
npm run format
```

## Source structure

- `src/pages/index.astro` assembles the page.
- `src/layouts/` contains the document shell.
- `src/components/` contains the hero, progress, actor sections, film cards, and picker dialog.
- `src/data/movies.json` contains the catalog; `watched.json` holds the manually edited statuses.
- `src/data/catalog.ts` validates and groups data at build time.
- `src/scripts/watchlist.ts` handles filters and random picks by updating existing elements.
- `src/styles/global.css` preserves the black-and-red design.

All movie cards and progress counts are rendered as HTML at build time. Only filters and the picker need browser JavaScript. The existing GitHub Pages workflow publishes from `main`; no deployment branch is used.
