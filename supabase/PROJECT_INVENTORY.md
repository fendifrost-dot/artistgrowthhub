# Supabase project inventory (Lovable → repo sync)

**Last reconciled:** from Lovable full export (user-provided). **Project ref:** `vsemrziqxrrfcquxfnwd`.

Use this file to stop guessing between GitHub, Cursor, and Lovable. When Lovable changes functions or secrets, update this doc in the same PR as `config.toml`.

---

## 1. Edge functions (25 in Lovable codebase)

| Function | Auth | Notes |
|----------|------|--------|
| `control-center-api` | `FANFUEL_HUB_KEY` | Bridge for Control Center |
| `execute-pitch` | `FANFUEL_HUB_KEY` | |
| `fan-intelligence` | In-code auth | `verify_jwt = false` in Lovable (validates in function) |
| `fetch-public-spotify-data` | none | `verify_jwt` off |
| `get-og-metadata` | none | SmartLink / worker |
| `healthcheck` | none | |
| `instagram-messaging` | `INSTAGRAM_MESSAGING_API_TOKEN` | Graph API |
| `meta-conversions` | none | CAPI; pixel `788829401662107` in code |
| `pitch-status` | `FANFUEL_HUB_KEY` | |
| `playlist-batch` | `FANFUEL_HUB_KEY` | |
| `playlist-research` | `FANFUEL_HUB_KEY` | Spotify live search; Lovable may also wire SoundCloud secrets |
| `project-stats` | none | |
| `scrape-chartmetric` | In-code auth + Firecrawl | `verify_jwt = false` in Lovable (validates in function) |
| `send-pitch-email` | `FANFUEL_HUB_KEY` | Resend |
| `shopify-order-webhook` | HMAC `SHOPIFY_WEBHOOK_SECRET` | |
| `soundcloud-auth` | none | OAuth start |
| `soundcloud-callback` | none | Needs **`FRONTEND_URL`** secret |
| `soundcloud-stats` | none | Tokens in `platform_connections` |
| `spotify-auth` / `spotify-callback` / `spotify-stats` | none / OAuth | |
| `update-pitch-status` | `FANFUEL_HUB_KEY` | |
| `youtube-auth` / `youtube-callback` / `youtube-stats` | OAuth + API key | `Fendi_Youtube_API_Key_1` |

**Stale config:** `[functions.ogmetadata]` in Lovable `config.toml` if present — remove (no function dir).

---

## 2. Meta: CAPI vs Marketing API

- **CAPI:** `META_CONVERSIONS_API_TOKEN`, function `meta-conversions` — events e.g. PageView, EmailSignup, AccordionOpen; dedup with `event_id`.
- **Marketing API (ads insights, campaign edit):** **Not configured** in this project — no `ads_read` / management token or functions.

---

## 3. SoundCloud

- Secrets: `SOUNDCLOUD_CLIENT_ID`, `SOUNDCLOUD_CLIENT_SECRET`.
- Tokens: `platform_connections` (`platform = 'soundcloud'`) per `user_id`.
- **Action:** Set Supabase secret **`FRONTEND_URL`** (e.g. production Lovable app URL) for `soundcloud-callback` redirect after OAuth.

Legacy unused secret name (per Lovable): `Fendi_SoundCloud_API`.

---

## 4. Database (Supabase Postgres — not Prisma `artistgrowthhub` local schema)

Lovable lists: `playlist_targets`, `pitch_log`, `follower_snapshots`, `artist_config`, `platform_connections`, `fan_profiles`, `fan_events`, `fan_data`, `smart_links`, `smart_link_leads`, `link_analytics`, `analytics_snapshots`, `momentum_events`, `marketing_actions`, `profiles`, `system_logs`.

**Not in this DB:** `bot_settings`, `tasks`, `sessions` (those belong to **Fendi Control Center**’s Supabase, not this Hub project).

---

## 5. Scheduled jobs

- `pg_cron`: not visible from Lovable tool — verify in Supabase dashboard.
- No triggers reported on public tables.

---

## 6. Repo vs Lovable disconnect

- **This GitHub folder** may only contain a **subset** of functions until you sync all `supabase/functions/*` from Lovable.
- **`config.toml`** here should match Lovable so JWT does not block `FANFUEL_HUB_KEY` callers.
- **Telegram** lives in **fendi-control-center**; it calls **this** project via `FANFUEL_HUB_URL` + `playlist-research`, etc.

---

## 7. Applied in Lovable (reconciled with this repo)

1. **`verify_jwt = false`** for `execute-pitch`, `pitch-status`, `playlist-batch`, `update-pitch-status` (plus existing FanFuel entries).  
2. **`FRONTEND_URL`** = `https://fan-growth-pilot.lovable.app` (SoundCloud OAuth redirect).  
3. **Stale `ogmetadata`** config entry removed.  
4. **`fan-intelligence`** and **`scrape-chartmetric`**: `verify_jwt = false` in production — auth handled inside the function; GitHub matches.

**Superset rule:** Lovable may deploy more functions than this repo lists; any function present in GitHub `config.toml` should match Lovable for `verify_jwt`.
