# Caption Club

**One picture. A hundred possible stories.**

Write a caption for the daily illustration, vote for your favorites, and turn any caption into a downloadable card.

![Caption Club: actual running application with English interface and light theme](assets/preview.jpg)

*Actual browser capture of the application, using local example data. Votes and completion counts shown are demonstration interactions, not audience statistics.*

### Try the flow

Write “The meeting could have been a nap.” → publish → vote → download the card.

English, Español, and Русский are selected from browser preferences, with a manual language selector. Light, dark, and system themes are available in every app. Native HTML, CSS, and JavaScript; no third-party browser libraries, external fonts, trackers, or CDN requests.

## Quick start

Requires Node.js 24+. No install or build step.

```sh
npm start
```

Open http://localhost:3000. The root opens this application; unrelated app routes and APIs are disabled. Data persists in `data/minute.sqlite`.

```sh
npm test
npm run check
```

## Deploy

Set `PUBLIC_ORIGIN` to the exact HTTPS origin, give the process a persistent `DATA_DIR`, and put an HTTPS reverse proxy in front. Example Dockerfile, Caddy config, environment file, and systemd unit are included. Each independent project needs its own port and data directory. `.env` is not loaded automatically: use exported variables or `node --env-file=.env server/index.mjs`. See [OPERATIONS.md](OPERATIONS.md) for backups, moderation, identity limitations, and storage details.

Daily scenes rotate through five original vectors. Visitors can submit three captions per browser per day, vote, see yesterday’s winner, export cards, and share permalinks. Expand the scene pool in `server/content.mjs`.

## Develop with TypeScript

Generated JavaScript is committed, so production needs no TypeScript compiler. Development uses pinned tools:

```sh
npm ci
npm run typecheck
npm run build
npm run check:generated
npm test
npm run check
```

`src/preferences*.ts` is the source for language negotiation and the early theme bootstrap. Server projects also compile `src/validation.mts` into `server/validation.mjs`. `src/contracts.ts` describes shared data shapes. The compiler uses strict mode, checked indexed access, and exact optional properties; errors block emission. Edit these TypeScript sources, then rebuild. Other existing application modules are still JavaScript: this is an incremental migration, not a claim of complete TypeScript coverage.

The build emits ordinary ES2022 JavaScript, then compiles the three locale variants. No compiler or framework is shipped to visitors. CI checks types, generated output, behavior, and the asset budget.
