export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

import { getDestinationByOfferId } from "@/lib/destinations";
import { storeIssuedLink } from "@/lib/issued-links";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, userId, audienceId } = body;

    if (!offerId) {
      return NextResponse.json({ ok: false, error: "Offer ID is required" }, { status: 400 });
    }

    const offer = getDestinationByOfferId(offerId);

    if (!offer) {
      return NextResponse.json({ ok: false, error: "Unknown offer" }, { status: 404 });
    }

    const token = crypto.randomUUID();
    const origin = req.nextUrl.origin;
    const trackingUrl = `${origin}/api/redirect/${token}`;

    storeIssuedLink({
      token,
      offerId,
      dest: offer.dest,
      finalUrl: offer.finalUrl,
      createdAt: new Date(),
    });

    console.log("Offer issued:", { offerId, userId, audienceId, token });

    return NextResponse.json({
      ok: true,
      trackingUrl,
      token,
      dest: offer.dest,
      finalUrl: offer.finalUrl,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
