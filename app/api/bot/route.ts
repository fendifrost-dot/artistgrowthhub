export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, userId, platform } = body;
    
    // In a real app, this would:
    // 1. Process the incoming message
    // 2. Determine appropriate response based on bot rules
    // 3. Check for trigger conditions
    // 4. Send response via appropriate channel
    
    // Mock bot response logic
    let botResponse = "Thanks for reaching out! 🎵";
    
    if (message.toLowerCase().includes('music')) {
      botResponse = "Check out my latest tracks on EVEN! I've got some exclusive content just for fans like you.";
    } else if (message.toLowerCase().includes('merch')) {
      botResponse = "Love the merch interest! Check out the latest drops at BeMoreModest.com - I think you'll find something you like.";
    } else if (message.toLowerCase().includes('show') || message.toLowerCase().includes('concert')) {
      botResponse = "No shows scheduled right now, but follow me to stay updated on upcoming dates!";
    }
    
    console.log("Bot interaction:", { userId, platform, message, response: botResponse });

    return NextResponse.json({ 
      ok: true, 
      response: botResponse,
      timestamp: new Date().toISOString()
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}