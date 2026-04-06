# Deploying Supabase Edge Functions

Production is managed in **Lovable** (project ref `vsemrziqxrrfcquxfnwd`). After pushing to GitHub, sync function sources in Lovable or use Supabase CLI:

```bash
supabase link --project-ref vsemrziqxrrfcquxfnwd
supabase functions deploy playlist-research
# …repeat per function you changed
```

Set secrets in the Supabase dashboard (or Lovable env): see `PROJECT_INVENTORY.md` and root `.env.example`.
