import { z } from "zod";

export const BaseEvent = z.object({
  type: z.string(),
  ts: z.string().optional(),
  user_id: z.string().optional(),
  anonymous_id: z.string().optional(),
  source: z.string().optional(),
  fbclid: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export const StreamSignal = BaseEvent.extend({
  type: z.literal("StreamSignal"),
  platform: z.enum(["spotify","apple","soundcloud"]),
  track_id: z.string(),
  count: z.number().default(1),
});

export const ClickOutbound = BaseEvent.extend({
  type: z.literal("ClickOutbound"),
  dest: z.enum(["even","shopify","spotify","apple","soundcloud"]),
  content_id: z.string(),
  click_id: z.string(),
});

export const PurchaseEvt = BaseEvent.extend({
  type: z.literal("Purchase"),
  source: z.enum(["shopify","even"]),
  order_id: z.string(),
  value: z.number(),
  currency: z.string(),
  contents: z.array(z.object({ sku: z.string(), qty: z.number() })).optional(),
  attributed_click_id: z.string().optional(),
});

export type EventPayloads =
  | z.infer<typeof StreamSignal>
  | z.infer<typeof ClickOutbound>
  | z.infer<typeof PurchaseEvt>;