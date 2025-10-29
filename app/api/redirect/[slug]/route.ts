export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const url = new URL(req.url);
  const slug = params.slug;

  const smartLink = await prisma.smartLink.findUnique({
    where: { slug, active: true }
  });

  if (!smartLink) {
    return NextResponse.redirect(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/404`, 302);
  }

  const clickId = Math.random().toString(36).substring(7);
  const fbclid = url.searchParams.get("fbclid") || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;
  const referer = req.headers.get("referer") || undefined;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ||
             req.headers.get("x-real-ip") ||
             undefined;

  await prisma.smartLink.update({
    where: { id: smartLink.id },
    data: { clickCount: { increment: 1 } }
  });

  try {
    await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/events/ingest`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "ClickOutbound",
        smartLinkId: smartLink.id,
        content_id: slug,
        click_id: clickId,
        fbclid,
        utm_source: url.searchParams.get("utm_source") || smartLink.utmSource,
        utm_medium: url.searchParams.get("utm_medium") || smartLink.utmMedium,
        utm_campaign: url.searchParams.get("utm_campaign") || smartLink.utmCampaign,
        user_agent: userAgent,
        referer,
        ip_address: ip,
        source: "smartlink",
        ts: new Date().toISOString()
      }),
    });
  } catch (error) {
    console.error("Failed to log click event:", error);
  }

  return NextResponse.redirect(smartLink.destination, 302);
}