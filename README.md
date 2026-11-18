# Block Runner Arena

An original voxel-inspired endless runner built with React, TypeScript, Vite, Canvas and Supabase.

## Features and status

The repository includes a playable three-lane runner, keyboard and touch controls, responsive UI, original CSS/canvas artwork, PWA install/offline shell, and About/Privacy/Terms/Contact pages. Player profiles support a runner name and 160-character bio. With Supabase configured, players can register, sign in, reset passwords and sync their profile. The global leaderboard UI currently has no live data integration. There is no chat feature.

## Local development

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env
npm run dev
```

Without Supabase settings, the profile editor saves locally in the browser. The game itself remains playable.

## Supabase setup

1. Create a free Supabase project and enable email/password authentication.
2. Copy the project URL and **anon/public key** into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never put a service-role key in frontend variables.
3. Apply `supabase/migrations/202611170001_arena.sql` in the SQL editor.
4. If you applied the earlier VIP chat migration from a previous version, apply `supabase/migrations/202611180001_remove_chat_add_bio.sql` to remove its tables/functions and add the bio field.
5. Set the Supabase Auth site URL and allowed redirect URLs to your deployed HTTPS origin. Email confirmation can be enabled; users must confirm before signing in if enabled.
6. The profile page can create an account, sign in/out, request a password reset, and save the username/bio to the authenticated user's profile row. Username uniqueness is enforced by PostgreSQL RLS-protected writes.

This SQL is a baseline. Client-submitted game score checks only enforce plausibility bounds; production anti-cheat needs server-issued signed runs and server simulation.

## Cloudflare Pages

Connect this GitHub repository in Cloudflare Pages. Use Vite preset, build command `npm run build`, output directory `dist`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables. Deploy to the free `*.pages.dev` domain.

Free tiers can change. Cloudflare Pages Free currently offers up to 500 builds/month, one concurrent build and 20-minute build timeout. Supabase Free includes 500 MB database, 5 GB egress, 50,000 MAUs, and may pause low-activity projects after about a week. Neither free service guarantees uptime; check quotas before launch.

## Install as an app

Open the deployed HTTPS website on a supported browser and choose **Install app** (or use the browser menu → Install/Add to Home Screen). On iPhone/iPad, use Share → Add to Home Screen. Offline launch is supported after the first successful visit and cached asset load. Accounts, profile sync, leaderboard and advertising require a connection.

## Controls

←/→ or A/D switches lanes; ↑/W/Space jumps; ↓/S slides; Escape pauses. Touch gestures and on-screen controls are supported.

## Remaining integration

The score submission and leaderboard functions exist in SQL, but the UI does not yet submit runs or load live rankings. The admin screen is still a placeholder. The profile page is connected to Supabase Auth and profile storage when configured.
