# Double O — Date Night

A static James Bond watchlist, published at https://asankov.dev/007/.

## Update watched movies

Edit [`dist/watched.json`](dist/watched.json) and change a movie’s value to `true` (watched) or `false` (not watched):

```json
"1962-Dr. No": true
```

Keep the movie keys unchanged. The year distinguishes the two Casino Royale films. Commit and push to `main`; GitHub Actions publishes `dist/` to Pages automatically. Reload the site after deployment to see the updated status.

This file is the only source of watched status. Browser local storage is no longer used. Existing browser-only progress is not uploaded; enter your watched movies in the JSON file. All entries initially default to `false` because browser history is not available in the repository.

Movie statuses are read-only on the website. Search, actor/status filters, progress counts, and the random unwatched-movie picker use the JSON data.

## Local preview

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173 (use a web server rather than opening the HTML file directly, so the JSON file can load).
