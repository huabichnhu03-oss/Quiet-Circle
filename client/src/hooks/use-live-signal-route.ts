import { useEffect, useMemo, useRef, useState } from "react";
import { type Contact } from "@shared/schema";
import { authFetch } from "@/lib/auth-fetch";
import { apiRequest } from "@/lib/queryClient";
import {
  type GeoPoint,
  type SignalRouteInfo,
  getContactRouteInfo,
} from "@/lib/signal-map";

const WALKING_SPEED_KMH = 4.8;
const EARTH_RADIUS_KM = 6371;
const LOCATION_POST_INTERVAL_MS = 2000;
const LOCATION_POLL_INTERVAL_MS = 2000;

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

function etaFromDistanceKm(distanceKm: number): string {
  const mins = Math.max(1, Math.round((distanceKm / WALKING_SPEED_KMH) * 60));
  return `${mins} mins`;
}

function formatDistance(distanceKm: number): string {
  return distanceKm < 1
    ? `${Math.round(distanceKm * 1000)} m`
    : `${distanceKm.toFixed(1)} km`;
}

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function estimatedOtherPoint(self: GeoPoint, contactId: string): GeoPoint {
  const seed = hashSeed(contactId);
  const bearing = ((seed % 360) * Math.PI) / 180;
  const distanceKm = 0.8 + (seed % 30) / 10;
  const latOffset = (distanceKm / EARTH_RADIUS_KM) * (180 / Math.PI) * Math.cos(bearing);
  const lngOffset =
    ((distanceKm / EARTH_RADIUS_KM) * (180 / Math.PI) * Math.sin(bearing)) /
    Math.cos(toRad(self.lat));
  return { lat: self.lat + latOffset, lng: self.lng + lngOffset };
}

function buildRouteInfo(
  self: GeoPoint,
  other: GeoPoint,
  locationLabel: string,
  role: LiveRole,
): SignalRouteInfo {
  const userLocation = role === "sender" ? self : other;
  const contactLocation = role === "sender" ? other : self;
  const distanceKm = haversineKm(self, other);

  return {
    distance: formatDistance(distanceKm),
    eta: etaFromDistanceKm(distanceKm),
    location: locationLabel,
    userLocation,
    contactLocation,
  };
}

type LiveRole = "sender" | "companion";

type LiveSignalSnapshot = {
  sender: GeoPoint | null;
  companion: GeoPoint | null;
};

async function publishLocation(
  contactId: string,
  role: LiveRole,
  point: GeoPoint,
  accuracy: number | null,
) {
  await apiRequest("POST", `/api/live-signal/${contactId}/location`, {
    role,
    lat: point.lat,
    lng: point.lng,
    accuracy,
  });
}

export function useLiveSignalRoute(
  contact: Contact | undefined,
  role: LiveRole,
): SignalRouteInfo | null {
  const fallback = useMemo(
    () => (contact ? getContactRouteInfo(contact) : null),
    [contact],
  );
  const [routeInfo, setRouteInfo] = useState<SignalRouteInfo | null>(fallback);
  const [snapshot, setSnapshot] = useState<LiveSignalSnapshot>({
    sender: null,
    companion: null,
  });
  const [selfGeo, setSelfGeo] = useState<GeoPoint | null>(null);
  const lastPostedAtRef = useRef(0);
  const postInFlightRef = useRef(false);
  const roleKey = role;
  const otherRole: LiveRole = role === "sender" ? "companion" : "sender";

  useEffect(() => {
    if (!contact) {
      setRouteInfo(null);
      return;
    }

    setRouteInfo(fallback);

    if (!("geolocation" in navigator)) {
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      async (position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setSelfGeo(current);
        setSnapshot((prev) => ({ ...prev, [roleKey]: current }));

        const now = Date.now();
        if (now - lastPostedAtRef.current < LOCATION_POST_INTERVAL_MS || postInFlightRef.current) {
          return;
        }

        lastPostedAtRef.current = now;
        postInFlightRef.current = true;
        try {
          await publishLocation(contact.id, roleKey, current, position.coords.accuracy ?? null);
        } catch {
          // Keep local updates active even if network posting fails.
        } finally {
          postInFlightRef.current = false;
        }
      },
      () => {
        setRouteInfo((current) => current ?? fallback);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [contact, fallback, roleKey]);

  useEffect(() => {
    if (!contact) return;

    let cancelled = false;

    const poll = async () => {
      try {
        const res = await authFetch(`/api/live-signal/${contact.id}`);
        if (!res.ok || cancelled) return;
        const parsed = (await res.json()) as LiveSignalSnapshot;
        if (!cancelled) setSnapshot(parsed);
      } catch {
        // Polling retries on the next interval.
      }
    };

    void poll();
    const interval = setInterval(() => {
      void poll();
    }, LOCATION_POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [contact]);

  useEffect(() => {
    if (!contact) return;

    const self = snapshot[roleKey] ?? selfGeo;
    if (!self) {
      setRouteInfo((current) => current ?? fallback);
      return;
    }

    const other = snapshot[otherRole];
    if (other) {
      setRouteInfo(buildRouteInfo(self, other, "Live tracking", roleKey));
      return;
    }

    const estimatedOther = estimatedOtherPoint(self, contact.id);
    setRouteInfo(
      buildRouteInfo(
        self,
        estimatedOther,
        "Live tracking · waiting for companion",
        roleKey,
      ),
    );
  }, [contact, fallback, otherRole, roleKey, selfGeo, snapshot]);

  return routeInfo;
}
