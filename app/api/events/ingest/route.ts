export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body.type) {
      return NextResponse.json({ ok: false, error: "Event type is required" }, { status: 400 });
    }

    // In a real app, this would:
    // 1. Validate the event schema
    // 2. Save to database
    // 3. Trigger any automation rules
    // 4. Update fan profiles
    console.log("Event ingested:", body);

    return NextResponse.json({ ok: true, eventId: Date.now().toString() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}