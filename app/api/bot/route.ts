export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userId, platform } = body;

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const normalizedMessage = message.toLowerCase();

    let botResponse = "Thanks for reaching out! 🎵";

    if (normalizedMessage.includes("music")) {
      botResponse = "Check out my latest tracks on EVEN! I've got some exclusive content just for fans like you.";
    } else if (normalizedMessage.includes("merch")) {
      botResponse = "Love the merch interest! Check out the latest drops at BeMoreModest.com - I think you'll find something you like.";
    } else if (normalizedMessage.includes("show") || normalizedMessage.includes("concert")) {
      botResponse = "No shows scheduled right now, but follow me to stay updated on upcoming dates!";
    }

    console.log("Bot interaction:", { userId, platform, message, response: botResponse });

    return NextResponse.json({
      ok: true,
      response: botResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
