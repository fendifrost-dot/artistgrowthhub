export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const smartLinks = await prisma.smartLink.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ smartLinks });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.slug || !body.destination) {
      return NextResponse.json(
        { error: "slug and destination are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.smartLink.findUnique({
      where: { slug: body.slug }
    });

    if (existing) {
      return NextResponse.json(
        { error: "A smart link with this slug already exists" },
        { status: 409 }
      );
    }

    const smartLink = await prisma.smartLink.create({
      data: {
        slug: body.slug,
        destination: body.destination,
        title: body.title,
        campaignName: body.campaignName,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        active: body.active !== undefined ? body.active : true
      }
    });

    return NextResponse.json({ smartLink }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const smartLink = await prisma.smartLink.update({
      where: { id: body.id },
      data: {
        destination: body.destination,
        title: body.title,
        campaignName: body.campaignName,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        active: body.active
      }
    });

    return NextResponse.json({ smartLink });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.smartLink.delete({
      where: { id }
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
