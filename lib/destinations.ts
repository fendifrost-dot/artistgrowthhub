export const DESTINATION_IDS = [
  "even",
  "bemoremodest",
  "shopify",
  "spotify",
  "apple",
  "soundcloud",
] as const;

export type DestinationId = (typeof DESTINATION_IDS)[number];

export type DestinationDefinition = {
  offerId: string;
  dest: DestinationId;
  finalUrl: string;
};

const DESTINATIONS: Record<string, DestinationDefinition> = {
  "new-single": {
    offerId: "new-single",
    dest: "even",
    finalUrl: "https://even.com/fendi-frost/midnight-vibes",
  },
  "merch-store": {
    offerId: "merch-store",
    dest: "bemoremodest",
    finalUrl: "https://www.bemoremodest.com/collections/fendi-frost",
  },
  "exclusive-track": {
    offerId: "exclusive-track",
    dest: "even",
    finalUrl: "https://even.com/fendi-frost/exclusive",
  },
  "vinyl-drop": {
    offerId: "vinyl-drop",
    dest: "bemoremodest",
    finalUrl: "https://www.bemoremodest.com/products/vinyl-collection",
  },
};

export function getDestinationByOfferId(offerId: string) {
  return DESTINATIONS[offerId] ?? null;
}

export function listDestinations() {
  return { ...DESTINATIONS };
}
