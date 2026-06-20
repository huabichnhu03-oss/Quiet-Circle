import { type Contact } from "@shared/schema";

export const MAP_W = 800;
export const MAP_H = 800;

export type MapPin = { x: number; y: number };

export type SignalRouteInfo = {
  distance: string;
  eta: string;
  location: string;
  userPin: MapPin;
  contactPin: MapPin;
  route: string;
  midLabel: MapPin;
};

const MOCK_LOCATIONS = [
  { location: "Barrie, Ontario", distance: "3.2 km", eta: "16 mins", pin: { x: 580, y: 140 } },
  { location: "North York, Toronto", distance: "1.8 km", eta: "9 mins", pin: { x: 480, y: 220 } },
  { location: "Downtown Toronto", distance: "2.4 km", eta: "12 mins", pin: { x: 520, y: 180 } },
  { location: "Scarborough, Toronto", distance: "4.1 km", eta: "20 mins", pin: { x: 620, y: 260 } },
];

const USER_PIN: MapPin = { x: 160, y: 580 };

function hashIndex(id: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % max;
  }
  return hash;
}

export function getContactRouteInfo(contact: Contact): SignalRouteInfo {
  const mock = MOCK_LOCATIONS[hashIndex(contact.id, MOCK_LOCATIONS.length)];
  const contactPin = mock.pin;
  const route = `${USER_PIN.x},${USER_PIN.y} ${USER_PIN.x},${contactPin.y + 200} ${contactPin.x - 120},${contactPin.y + 200} ${contactPin.x - 120},${contactPin.y} ${contactPin.x},${contactPin.y}`;
  const midLabel = {
    x: (USER_PIN.x + contactPin.x) / 2 - 10,
    y: (USER_PIN.y + contactPin.y + 200) / 2,
  };

  return {
    distance: mock.distance,
    eta: mock.eta,
    location: mock.location,
    userPin: USER_PIN,
    contactPin,
    route,
    midLabel,
  };
}

export function contactInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export function contactTags(contact: Contact): string[] {
  const tags = [contact.relationship];
  if (contact.isPrimary) tags.push("Primary Contact");
  return tags;
}

const ACTIVE_SIGNAL_KEY = "moodmind-active-signal";

export type ActiveSignal = {
  contactId: string;
  contactName: string;
  startedAt: string;
};

export function setActiveSignal(signal: ActiveSignal): void {
  sessionStorage.setItem(ACTIVE_SIGNAL_KEY, JSON.stringify(signal));
}

export function getActiveSignal(): ActiveSignal | null {
  try {
    const raw = sessionStorage.getItem(ACTIVE_SIGNAL_KEY);
    return raw ? (JSON.parse(raw) as ActiveSignal) : null;
  } catch {
    return null;
  }
}

export function clearActiveSignal(): void {
  sessionStorage.removeItem(ACTIVE_SIGNAL_KEY);
}

export const MAP_STREETS = {
  vRoads: [80, 200, 320, 440, 560, 680],
  hRoads: [80, 200, 320, 440, 560, 680],
  roadLabels: [
    { x: 220, y: 197, text: "Adelaide St W" },
    { x: 220, y: 317, text: "King St W" },
    { x: 220, y: 437, text: "Queen St W" },
    { x: 203, y: 260, rotate: true, text: "Spadina Ave" },
    { x: 323, y: 260, rotate: true, text: "University Ave" },
    { x: 443, y: 260, rotate: true, text: "Bay St" },
    { x: 563, y: 260, rotate: true, text: "Yonge St" },
  ],
  blocks: [
    [85, 85, 110, 110], [205, 85, 110, 110], [325, 85, 110, 110], [445, 85, 110, 110], [565, 85, 110, 110],
    [85, 205, 110, 110], [205, 205, 110, 110], [325, 205, 110, 110], [445, 205, 110, 110], [565, 205, 110, 110],
    [85, 325, 110, 110], [205, 325, 110, 110], [325, 325, 110, 110], [445, 325, 110, 110], [565, 325, 110, 110],
    [85, 445, 110, 110], [205, 445, 110, 110], [325, 445, 110, 110], [445, 445, 110, 110], [565, 445, 110, 110],
    [85, 565, 110, 110], [205, 565, 110, 110], [325, 565, 110, 110], [445, 565, 110, 110], [565, 565, 110, 110],
  ] as [number, number, number, number][],
};
