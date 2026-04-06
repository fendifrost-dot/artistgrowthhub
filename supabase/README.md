# FanFuel Hub (Supabase backend)

This directory is the **only** home for FanFuel Hub Edge Functions and their SQL migrations. It is part of [Artist Growth Hub](https://github.com/fendifrost-dot/artistgrowthhub) and must not be mixed with Credit Compass (`fendi-fight-plan`) or Fendi Control Center.

## Where Supabase runs

The live Supabase project (database, secrets, Edge Function deploys) is managed **in the Lovable project**, not via a local Supabase stack on a developer machine. Treat this `supabase/` folder as the **versioned source** for functions and migrations that you sync or deploy through that workflow (e.g. paste into Lovable, CI, or Supabase dashboard), rather than assuming `supabase start` or CLI link on this device.

**Full function list, Meta CAPI vs Marketing API, SoundCloud OAuth, and DB tables:** see [`PROJECT_INVENTORY.md`](./PROJECT_INVENTORY.md).

## Functions (minimal set often edited in Git; Lovable has ~25 total)

| Function | Purpose |
|----------|---------|
| `playlist-research` | POST `{ track_name, user_vibe }` → ranked `playlists[]` (catalog + optional Spotify live search). Auth: `FANFUEL_HUB_KEY`. |
| `playlist-batch` | POST `{ playlist_ids }` → `playlist_targets` rows in order. |
| `execute-pitch` | Send or route a pitch for a track × playlist. |
| `update-pitch-status` | Mark responded / rejected on `pitch_log`. |
| `pitch-status` | Recent `pitch_log` entries (optional `track_name` filter). |

## Env (set in Supabase project secrets)

- `FANFUEL_HUB_KEY` — shared secret; Control Center sends it as `x-api-key` / `Authorization` / `apikey`.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — standard service role (functions use these).
- `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET` — optional; enables live playlist search in `playlist-research`.
- `FRONTEND_URL` — required for `soundcloud-callback` post-OAuth redirect (see inventory).
- `META_CONVERSIONS_API_TOKEN` — CAPI only (`meta-conversions`); not Marketing API.

## Migrations

Apply in order on the **FanFuel Hub** Supabase project (`playlist_targets`, `pitch_log`, `follower_snapshots`, etc.). Prerequisites: existing `playlist_targets` table as described in `001_playlist_catalog_migration.sql`.
