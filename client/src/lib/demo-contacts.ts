import type { Contact } from "@shared/schema";

const DEMO_EMAIL_SUFFIX = "@quietcircle.app";
const DEMO_IDS = new Set([
  "demo-nathan-richards",
  "demo-nhu-hua",
  "demo-alex-rivera",
]);

export function isDemoContact(contact: Pick<Contact, "id" | "email">): boolean {
  if (DEMO_IDS.has(contact.id)) return true;
  return Boolean(contact.email?.endsWith(DEMO_EMAIL_SUFFIX) && contact.email.includes(".demo@"));
}

export function hasDemoContacts(contacts: Contact[]): boolean {
  return contacts.some(isDemoContact);
}
