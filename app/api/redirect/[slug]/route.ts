export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

import { getDestinationByOfferId } from "@/lib/destinations";
import { getIssuedLink } from "@/lib/issued-links";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url);
  const slug = params.slug;
  const origin = req.nextUrl.origin;

  const issuedLink = getIssuedLink(slug);
  const baseDestination = issuedLink ?? getDestinationByOfferId(slug);

  if (!baseDestination) {
    return NextResponse.redirect(`${origin}/404`, 302);
  }

  const clickId = crypto.randomUUID();
  const fbclid = url.searchParams.get("fbclid") || undefined;

  try {
    await fetch(`${origin}/api/events/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "ClickOutbound",
        dest: baseDestination.dest,
        content_id: issuedLink ? issuedLink.offerId : baseDestination.offerId,
        click_id: clickId,
        fbclid,
        utm_source: url.searchParams.get("utm_source"),
        utm_medium: url.searchParams.get("utm_medium"),
        utm_campaign: url.searchParams.get("utm_campaign"),
        source: "smartlink",
        ts: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error("Failed to log click event:", error);
  }

  return NextResponse.redirect(baseDestination.finalUrl, 302);
}
