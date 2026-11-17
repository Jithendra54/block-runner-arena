# Block Runner Arena

An original voxel-inspired endless runner built with React, TypeScript, Vite, Canvas and Supabase.

## Status

The repository contains a playable three-lane game with keyboard and touch controls, responsive interface, CSS/canvas artwork, SEO metadata, policy pages and a Supabase schema baseline. Supabase-backed registration, persisted leaderboard, live VIP chat, moderation and admin tools are not yet integrated. No fake player records are shipped.

## Local development

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env
npm run dev
```

The game works without Supabase. Create a Supabase project, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then apply `supabase/migrations/202611170001_arena.sql` in the SQL editor.

## Supabase

1. Create a free project and enable email/password auth.
2. Apply the SQL migration.
3. Register your owner account, copy its UUID from Authentication → Users, and add it to `public.admins` using SQL editor. Do not assign admin via client code.
4. Never expose the service-role key. Only the anon key belongs in browser variables.
5. Use the `submit_run` and `leaderboard` RPCs for scores and rankings. Enable Realtime on `vip_messages`.

This migration is a security baseline, not a complete backend integration. Client-submitted score checks only enforce plausibility bounds; production anti-cheat needs server-issued signed runs and server simulation.

## Cloudflare Pages

Connect this GitHub repository in Cloudflare Pages. Use Vite preset, build command `npm run build`, output directory `dist`. Add Supabase URL and anon key as build environment variables. Deploy to the free `*.pages.dev` domain.

Free tiers can change. Cloudflare Pages Free currently offers up to 500 builds/month, one concurrent build and 20-minute build timeout. Supabase Free includes 500 MB database, 5 GB egress, 50,000 MAUs, and may pause low-activity projects after about a week. Neither free service guarantees uptime; check quotas before launch.

## Ads

Ads stay disabled until AdSense approval. No fake credentials are included. After approval, configure valid IDs and Google's official script with appropriate consent handling. Keep placements outside the game canvas and touch controls. Never click your own ads or encourage clicks.

## Controls

←/→ or A/D switches lanes; ↑/W/Space jumps; ↓/S slides; Escape pauses. Touch gestures and on-screen controls are supported.

## Before launch

The starter does not yet contain registration UI, live VIP chat UI, or a functional admin control panel. Complete the backend integration and review database policies before opening user accounts.
