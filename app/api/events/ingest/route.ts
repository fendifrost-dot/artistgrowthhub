export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveOrCreateUser } from "@/lib/identity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.type) {
      return NextResponse.json({ ok: false, error: "Event type is required" }, { status: 400 });
    }

    let userId: string | null = null;
    const anonymousId = body.anonymous_id || body.anonymousId;

    if (body.fbclid || body.email || body.phone || anonymousId) {
      userId = await resolveOrCreateUser({
        fbclid: body.fbclid,
        email: body.email,
        phone: body.phone,
        anonymousId
      });
    }

    const event = await prisma.event.create({
      data: {
        userId,
        anonymousId,
        type: body.type,
        payload: body,
        source: body.source || "unknown",
        clickId: body.click_id || body.clickId
      }
    });

    return NextResponse.json({ ok: true, eventId: event.id });
  } catch (e: any) {
    console.error("Event ingestion error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}