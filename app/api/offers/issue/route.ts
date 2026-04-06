export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, userId, audienceId } = body;
    
    if (!offerId) {
      return NextResponse.json({ ok: false, error: "Offer ID is required" }, { status: 400 });
    }

    // In a real app, this would:
    // 1. Fetch the offer from database
    // 2. Generate a unique tracking token
    // 3. Create personalized link
    // 4. Log the issuance event
    
    const token = Math.random().toString(36).substring(7);
    const trackingUrl = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/redirect/${token}`;
    
    console.log("Offer issued:", { offerId, userId, audienceId, token });

    return NextResponse.json({ 
      ok: true, 
      trackingUrl,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}