export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

// Mock function to fetch destination for slug
async function fetchDestForSlug(slug: string) {
  // In a real app, this would query the database
  const destinations: Record<string, any> = {
    'new-single': { dest: 'even', finalUrl: 'https://even.com/fendi-frost/midnight-vibes' },
    'merch-store': { dest: 'bemoremodest', finalUrl: 'https://bemoremodest.com/collections/fendi-frost' },
    'exclusive-track': { dest: 'even', finalUrl: 'https://even.com/fendi-frost/exclusive' },
    'vinyl-drop': { dest: 'bemoremodest', finalUrl: 'https://bemoremodest.com/products/vinyl-collection' }
  };
  
  return destinations[slug] || null;
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url);
  const slug = params.slug;
  
  const dest = await fetchDestForSlug(slug);
  if (!dest) {
    return NextResponse.redirect(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/404`, 302);
  }

  const clickId = Math.random().toString(36).substring(7);
  const fbclid = url.searchParams.get("fbclid") || undefined;

  // Log ClickOutbound event (fire-and-forget)
  try {
    await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/events/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "ClickOutbound",
        dest: dest.dest,
        content_id: slug,
        click_id: clickId,
        fbclid,
        utm_source: url.searchParams.get("utm_source"),
        utm_medium: url.searchParams.get("utm_medium"),
        utm_campaign: url.searchParams.get("utm_campaign"),
        source: "smartlink",
        ts: new Date().toISOString()
      }),
    });
  } catch (error) {
    console.error("Failed to log click event:", error);
  }

  return NextResponse.redirect(dest.finalUrl, 302);
}