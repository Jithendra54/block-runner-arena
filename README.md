# Block Runner Arena

An original voxel-inspired endless runner built with React, TypeScript, Vite, Canvas and Supabase.

## Status

The repository includes a playable three-lane game with keyboard and touch controls, responsive interface, original CSS/canvas visuals, SEO and policy pages, an installable PWA shell, and a Supabase schema for player profiles and score history. The profile page lets players set a runner name and a 160-character bio saved on the current device. Account registration and server profile syncing are not connected yet. There is no chat feature.

## Local development

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env
npm run dev
```

The game works without Supabase. Create a Supabase project, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then apply `supabase/migrations/202611170001_arena.sql` in the SQL editor. If you previously applied the older schema containing VIP chat, also apply `supabase/migrations/202611180001_remove_chat_add_bio.sql` to remove those tables/functions and add the bio column.

## Supabase

1. Create a free project and enable email/password auth.
2. Apply the migrations in chronological order.
3. Register your owner account, copy its UUID from Authentication → Users, and add it to `public.admins` using the SQL editor. Do not assign admin through client code.
4. Never expose the service-role key. Only the anon key belongs in browser variables.
5. Use the `submit_run` and `leaderboard` RPCs for scores and rankings.

The schema is a security baseline, not a complete backend integration. Client-submitted score checks only enforce plausibility bounds; production anti-cheat needs server-issued signed runs and server simulation.

## Cloudflare Pages

Connect this GitHub repository in Cloudflare Pages. Use Vite preset, build command `npm run build`, output directory `dist`. Add Supabase URL and anon key as build environment variables. Deploy to the free `*.pages.dev` domain.

Free tiers can change. Cloudflare Pages Free currently offers up to 500 builds/month, one concurrent build and 20-minute build timeout. Supabase Free includes 500 MB database, 5 GB egress, 50,000 MAUs, and may pause low-activity projects after about a week. Neither free service guarantees uptime; check quotas before launch.

## Install as an app

Open the deployed HTTPS website on a supported browser and choose **Install app** (or use the browser menu → Install/Add to Home Screen). On iPhone/iPad, use Share → Add to Home Screen. Offline launch is supported after the first successful visit and cached asset load. Accounts, scores, leaderboard and advertising require a connection.

## Controls

←/→ or A/D switches lanes; ↑/W/Space jumps; ↓/S slides; Escape pauses. Touch gestures and on-screen controls are supported.

## Before launch

The profile editor currently saves to local storage on the device. Registration and server-side profile sync need to be connected before profile bios can appear across devices. The global leaderboard and admin dashboard also need their application UI and backend integration.
