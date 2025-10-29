import { prisma } from "./db";

interface AttributionResult {
  clickId?: string;
  smartLinkId?: string;
  userId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function attributePurchase(
  orderId: string,
  value: number,
  currency: string,
  source: string,
  identifiers: {
    clickId?: string;
    fbclid?: string;
    email?: string;
    phone?: string;
  }
): Promise<void> {
  let attribution: AttributionResult = {};
  let userId: string | null = null;

  if (identifiers.clickId) {
    const clickEvent = await prisma.event.findFirst({
      where: { clickId: identifiers.clickId },
      orderBy: { createdAt: 'desc' }
    });

    if (clickEvent) {
      attribution.clickId = identifiers.clickId;
      attribution.userId = clickEvent.userId || undefined;
      attribution.utmSource = (clickEvent.payload as any)?.utm_source;
      attribution.utmMedium = (clickEvent.payload as any)?.utm_medium;
      attribution.utmCampaign = (clickEvent.payload as any)?.utm_campaign;
      attribution.smartLinkId = (clickEvent.payload as any)?.smartLinkId;
      userId = clickEvent.userId;
    }
  }

  if (!userId && identifiers.fbclid) {
    const identity = await prisma.identity.findFirst({
      where: { type: "fbclid", value: identifiers.fbclid }
    });
    if (identity) userId = identity.userId;
  }

  if (!userId && identifiers.email) {
    const crypto = await import("crypto");
    const emailHash = crypto.createHash("sha256")
      .update(identifiers.email.toLowerCase())
      .digest("hex");
    const user = await prisma.userProfile.findUnique({
      where: { emailHash }
    });
    if (user) userId = user.id;
  }

  await prisma.purchase.create({
    data: {
      userId,
      source,
      orderId,
      value,
      currency,
      clickId: attribution.clickId
    }
  });

  await prisma.event.create({
    data: {
      userId,
      type: "Purchase",
      payload: {
        orderId,
        value: value.toString(),
        currency,
        source,
        clickId: attribution.clickId || null,
        smartLinkId: attribution.smartLinkId || null,
        utmSource: attribution.utmSource || null,
        utmMedium: attribution.utmMedium || null,
        utmCampaign: attribution.utmCampaign || null
      },
      source,
      clickId: attribution.clickId
    }
  });
}

export async function getConversionStats(smartLinkId: string) {
  const clicks = await prisma.event.count({
    where: {
      type: "ClickOutbound",
      payload: {
        path: ["smartLinkId"],
        equals: smartLinkId
      }
    }
  });

  const clickIds = await prisma.event.findMany({
    where: {
      type: "ClickOutbound",
      payload: {
        path: ["smartLinkId"],
        equals: smartLinkId
      }
    },
    select: { clickId: true }
  });

  const validClickIds = clickIds
    .map((e: { clickId: string | null }) => e.clickId)
    .filter(Boolean) as string[];

  const conversions = await prisma.purchase.count({
    where: {
      clickId: {
        in: validClickIds
      }
    }
  });

  const revenue = await prisma.purchase.aggregate({
    where: {
      clickId: {
        in: validClickIds
      }
    },
    _sum: {
      value: true
    }
  });

  return {
    clicks,
    conversions,
    conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
    revenue: revenue._sum.value || 0
  };
}
