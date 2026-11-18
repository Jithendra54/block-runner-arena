# Block Runner Arena

A free, installable browser game. It uses React, TypeScript, Vite and Canvas. It has no account service, database, ad network, analytics, or backend.

## Local-only behavior

- The game works in the browser and as an installable PWA.
- Runner name, bio and completed runs are stored in this browser's local storage.
- The leaderboard shows each local profile's best score, on this device only.
- There is no shared/global leaderboard, cross-device sync, or online account.
- Clear the site's browser data to erase its profile and scores.
- No service quotas or paid APIs are involved. Hosting is only needed to distribute the app; you can run the built files locally too.

## Run locally

Requires Node.js 20+ and npm.

```sh
npm install
npm run dev
```

Build the static app with:

```sh
npm run build
npm run preview
```

## Install the PWA

For an install prompt, serve the deployed build over HTTPS. Open the site in a supported browser and choose **Install app**. On iPhone/iPad use Share → Add to Home Screen. The service worker caches the app shell and same-origin files after the first successful visit. The game can then reopen offline.

## Controls

←/→ or A/D switches lanes; ↑/W/Space jumps; ↓/S slides; Escape pauses. Touch swipe and on-screen controls work on mobile.

## Deploy or distribute

The app is static and can be hosted on any static file server. A public host can impose its own transfer or build limits. To avoid dependence on a hosted service, build the project and serve the generated `dist` directory from a computer on your local network; remote players will not be able to access it unless you provide a reachable host. A public online leaderboard requires a server and storage and is intentionally not included.

## Data and privacy

Profile and run data stay in this browser's local storage. There are no analytics, ads, account cookies or network database requests. App files and optional system fonts are self-contained; no external font service is used.
