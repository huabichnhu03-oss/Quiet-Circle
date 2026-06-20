import { type Contact } from "@shared/schema";

export type GeoPoint = { lat: number; lng: number };

export type SignalRouteInfo = {
  distance: string;
  eta: string;
  location: string;
  userLocation: GeoPoint;
  contactLocation: GeoPoint;
};

const WALKING_SPEED_KMH = 4.8;
const EARTH_RADIUS_KM = 6371;

const MOCK_LOCATIONS = [
  { location: "Barrie, Ontario", lat: 44.3894, lng: -79.6903 },
  { location: "North York, Toronto", lat: 43.7615, lng: -79.4111 },
  { location: "Downtown Toronto", lat: 43.6532, lng: -79.3832 },
  { location: "Scarborough, Toronto", lat: 43.7764, lng: -79.2318 },
];

const DEFAULT_USER: GeoPoint = { lat: 43.6426, lng: -79.3871 };

function hashIndex(id: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % max;
  }
  return hash;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

function formatDistance(distanceKm: number): string {
  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(1)} km`;
}

function etaFromDistanceKm(distanceKm: number): string {
  const mins = Math.max(1, Math.round((distanceKm / WALKING_SPEED_KMH) * 60));
  return `${mins} mins`;
}

export function getContactRouteInfo(contact: Contact): SignalRouteInfo {
  const mock = MOCK_LOCATIONS[hashIndex(contact.id, MOCK_LOCATIONS.length)];
  const contactLocation = { lat: mock.lat, lng: mock.lng };
  const distanceKm = haversineKm(DEFAULT_USER, contactLocation);

  return {
    distance: formatDistance(distanceKm),
    eta: etaFromDistanceKm(distanceKm),
    location: mock.location,
    userLocation: DEFAULT_USER,
    contactLocation,
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
