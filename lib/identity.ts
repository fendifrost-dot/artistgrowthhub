import { prisma } from "./db";
import crypto from "crypto";

export async function resolveOrCreateUser(identifiers: {
  fbclid?: string;
  email?: string;
  phone?: string;
  anonymousId?: string;
}): Promise<string> {
  let userId: string | null = null;

  if (identifiers.fbclid) {
    const identity = await prisma.identity.findFirst({
      where: { type: "fbclid", value: identifiers.fbclid }
    });
    if (identity) userId = identity.userId;
  }

  if (!userId && identifiers.email) {
    const emailHash = crypto.createHash("sha256").update(identifiers.email.toLowerCase()).digest("hex");
    const user = await prisma.userProfile.findUnique({
      where: { emailHash }
    });
    if (user) userId = user.id;
  }

  if (!userId && identifiers.phone) {
    const phoneHash = crypto.createHash("sha256").update(identifiers.phone).digest("hex");
    const user = await prisma.userProfile.findUnique({
      where: { phoneHash }
    });
    if (user) userId = user.id;
  }

  if (!userId && identifiers.anonymousId) {
    const identity = await prisma.identity.findFirst({
      where: { type: "anonymous_id", value: identifiers.anonymousId }
    });
    if (identity) userId = identity.userId;
  }

  if (!userId) {
    const newUser = await prisma.userProfile.create({
      data: {
        emailHash: identifiers.email
          ? crypto.createHash("sha256").update(identifiers.email.toLowerCase()).digest("hex")
          : undefined,
        phoneHash: identifiers.phone
          ? crypto.createHash("sha256").update(identifiers.phone).digest("hex")
          : undefined,
        lastSeenAt: new Date()
      }
    });
    userId = newUser.id;
  } else {
    await prisma.userProfile.update({
      where: { id: userId },
      data: { lastSeenAt: new Date() }
    });
  }

  if (identifiers.fbclid) {
    await prisma.identity.upsert({
      where: {
        id: `${userId}-fbclid-${identifiers.fbclid}`
      },
      update: {},
      create: {
        userId,
        type: "fbclid",
        value: identifiers.fbclid
      }
    });
  }

  if (identifiers.anonymousId) {
    await prisma.identity.upsert({
      where: {
        id: `${userId}-anonymous_id-${identifiers.anonymousId}`
      },
      update: {},
      create: {
        userId,
        type: "anonymous_id",
        value: identifiers.anonymousId
      }
    });
  }

  return userId;
}
