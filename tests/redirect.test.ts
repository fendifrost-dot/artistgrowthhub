import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { POST as issueOffer } from "@/app/api/offers/issue/route";
import { GET as resolveRedirect } from "@/app/api/redirect/[slug]/route";
import { clearIssuedLinks } from "@/lib/issued-links";

const origin = "https://example.com";

describe("offer issuance and redirect", () => {
  beforeEach(() => {
    clearIssuedLinks();
    vi.restoreAllMocks();
  });

  it("issues an offer link and redirects with the stored destination", async () => {
    const request = new NextRequest(
      new Request(`${origin}/api/offers/issue`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          offerId: "merch-store",
          userId: "user-123",
          audienceId: "aud-456",
        }),
      })
    );

    const response = await issueOffer(request);
    expect(response.status).toBe(200);

    const payload = await response.json();
    expect(payload.ok).toBe(true);
    expect(payload.dest).toBe("bemoremodest");
    expect(payload.finalUrl).toBe(
      "https://www.bemoremodest.com/collections/fendi-frost"
    );

    const mockFetch = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));

    const redirectRequest = new NextRequest(
      new Request(payload.trackingUrl, {
        headers: { "content-type": "application/json" },
      })
    );

    const redirectResponse = await resolveRedirect(redirectRequest, {
      params: { slug: payload.token },
    });

    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.get("location")).toBe(
      "https://www.bemoremodest.com/collections/fendi-frost"
    );
    expect(mockFetch).toHaveBeenCalledOnce();
  });
});
