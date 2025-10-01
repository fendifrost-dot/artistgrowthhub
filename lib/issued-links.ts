import type { DestinationId } from "./destinations";

export type IssuedLinkRecord = {
  token: string;
  offerId: string;
  dest: DestinationId;
  finalUrl: string;
  createdAt: Date;
};

const issuedLinks = new Map<string, IssuedLinkRecord>();

export function storeIssuedLink(record: IssuedLinkRecord) {
  issuedLinks.set(record.token, record);
  return record;
}

export function getIssuedLink(token: string) {
  return issuedLinks.get(token) ?? null;
}

export function clearIssuedLinks() {
  issuedLinks.clear();
}
