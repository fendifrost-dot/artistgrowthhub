export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { attributePurchase } from "@/lib/attribution";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.orderId || !body.value || !body.currency || !body.source) {
      return NextResponse.json(
        { error: "orderId, value, currency, and source are required" },
        { status: 400 }
      );
    }

    await attributePurchase(
      body.orderId,
      parseFloat(body.value),
      body.currency,
      body.source,
      {
        clickId: body.clickId,
        fbclid: body.fbclid,
        email: body.email,
        phone: body.phone
      }
    );

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Purchase tracking error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
