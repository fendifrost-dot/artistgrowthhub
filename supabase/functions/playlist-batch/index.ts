/**
 * playlist-batch — FanFuel Hub (read-only)
 * POST { playlist_ids: string[] } → playlists in same order (best effort)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-api-key",
};

function getHubKey(req: Request): string {
  return (
    req.headers.get("x-api-key") ||
    req.headers.get("apikey") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim()
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const expected = Deno.env.get("FANFUEL_HUB_KEY");
    if (!expected || getHubKey(req).trim() !== expected.trim()) {
      return json({ error: "Unauthorized" }, 401);
    }
    const body = await req.json().catch(() => ({}));
    const ids = Array.isArray(body.playlist_ids) ? body.playlist_ids.map(String) : [];
    if (ids.length === 0) return json({ ok: true, playlists: [] });

    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(url, key);

    const { data, error } = await sb.from("playlist_targets").select("*").in("playlist_id", ids);
    if (error) return json({ error: error.message }, 500);

    const map = new Map((data ?? []).map((r: { playlist_id: string }) => [r.playlist_id, r]));
    const ordered = ids.map((id) => map.get(id)).filter(Boolean);

    return json({ ok: true, playlists: ordered });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
