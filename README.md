# Block Runner Arena

An original voxel-inspired endless runner built with React, TypeScript, Vite, Canvas and Supabase.

## Features and status

The repository includes a playable three-lane runner, keyboard and touch controls, responsive UI, original CSS/canvas artwork, PWA install/offline shell, and About/Privacy/Terms/Contact pages. Player profiles support a runner name and 160-character bio. With Supabase configured, players can register, sign in, reset passwords, save profiles, submit completed runs, and view the live leaderboard. There is no chat feature. The admin screen remains a placeholder.

## Local development

Requires Node.js 20+ and npm.

```sh
npm install
cp .env.example .env
npm run dev
```

Without Supabase settings, the profile editor saves locally and the game remains playable. Scores are submitted only for signed-in users who have saved a valid profile.

## Supabase setup

1. Create a free Supabase project and enable email/password authentication.
2. Copy the project URL and **anon/public key** into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never put a service-role key in frontend variables.
3. Apply `supabase/migrations/202611170001_arena.sql` in the SQL editor.
4. If you applied an older schema with VIP messaging, apply `202611180001_remove_chat_add_bio.sql`.
5. Apply `202611180002_run_validation.sql` to align speed checks with the game and rate-limit run submissions.
6. Apply `202611180003_realtime_leaderboard.sql` to publish score changes for live ranking refresh.
7. Set Supabase Auth Site URL and redirect URLs to the deployed HTTPS origin. With email confirmation enabled, players must confirm their email before signing in.
8. Create an account, choose a unique 3–18 character username using letters, numbers or underscores, and save the profile before playing a ranked run.

The leaderboard ranks each player's highest non-suspicious score, breaking ties by earliest achievement. Score writes use a server-side RPC with range, speed, coin and submission-rate checks. This is basic plausibility validation, not cheat-proof server simulation.

## Cloudflare Pages

Connect this GitHub repository in Cloudflare Pages. Use Vite preset, build command `npm run build`, output directory `dist`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as build environment variables. Deploy to the free `*.pages.dev` domain.

Free tiers can change. Cloudflare Pages Free currently offers up to 500 builds/month, one concurrent build and 20-minute build timeout. Supabase Free includes 500 MB database, 5 GB egress, 50,000 MAUs, and may pause low-activity projects after about a week. Neither free service guarantees uptime; check quotas before launch.

## Install as an app

Open the deployed HTTPS website on a supported browser and choose **Install app** (or use the browser menu → Install/Add to Home Screen). On iPhone/iPad, use Share → Add to Home Screen. Offline launch is supported after the first successful visit and cached asset load. Accounts, profile sync, ranked scores and leaderboard require a connection.

## Controls

←/→ or A/D switches lanes; ↑/W/Space jumps; ↓/S slides; Escape pauses. Touch gestures and on-screen controls are supported.

## Remaining integration

The admin screen does not yet provide user/score moderation controls. Configure Supabase and apply all migrations before enabling ranked play.
