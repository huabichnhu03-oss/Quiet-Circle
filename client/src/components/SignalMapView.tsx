import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { type SignalRouteInfo } from "@/lib/signal-map";
import "leaflet/dist/leaflet.css";

type SignalMapViewProps = {
  routeInfo: SignalRouteInfo;
  userLabel: string;
  userPinText: string;
  contactLabel: string;
  contactPinText: string;
  bottomSheet: React.ReactNode;
};

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const resize = () => map.invalidateSize();
    resize();
    const timer = window.setTimeout(resize, 100);
    window.addEventListener("resize", resize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [map]);

  return null;
}

function FitMapBounds({
  userLocation,
  contactLocation,
}: {
  userLocation: SignalRouteInfo["userLocation"];
  contactLocation: SignalRouteInfo["contactLocation"];
}) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      [userLocation.lat, userLocation.lng],
      [contactLocation.lat, contactLocation.lng],
    ]);
    map.fitBounds(bounds, { padding: [56, 56], maxZoom: 16 });
    map.invalidateSize();
  }, [contactLocation.lat, contactLocation.lng, map, userLocation.lat, userLocation.lng]);

  return null;
}

function createPinIcon(text: string, color: string, label: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
        <div style="
          width:32px;height:32px;border-radius:50%;
          background:${color};border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          color:white;font-size:10px;font-weight:700;font-family:Inter,sans-serif;
        ">${text}</div>
        <div style="
          margin-top:4px;background:white;border-radius:999px;
          padding:2px 8px;font-size:10px;font-weight:600;
          color:#2d5016;font-family:Inter,sans-serif;
          box-shadow:0 1px 4px rgba(0,0,0,0.12);white-space:nowrap;
        ">${label}</div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function createDistanceIcon(distance: string) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        transform:translate(-50%,-50%);
        background:var(--app-accent,#8b6914);
        color:white;border-radius:999px;
        padding:4px 12px;font-size:11px;font-weight:700;
        font-family:Inter,sans-serif;
        box-shadow:0 2px 8px rgba(0,0,0,0.2);white-space:nowrap;
      ">${distance}</div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function SignalMapView({
  routeInfo,
  userLabel,
  userPinText,
  contactLabel,
  contactPinText,
  bottomSheet,
}: SignalMapViewProps) {
  const { userLocation, contactLocation, distance } = routeInfo;

  if (
    userLocation?.lat == null ||
    userLocation?.lng == null ||
    contactLocation?.lat == null ||
    contactLocation?.lng == null
  ) {
    return (
      <div className="flex items-center justify-center min-h-full text-sm text-[var(--app-muted)]">
        Loading map…
      </div>
    );
  }

  const centerLat = (userLocation.lat + contactLocation.lat) / 2;
  const centerLng = (userLocation.lng + contactLocation.lng) / 2;
  const routeLine: [number, number][] = [
    [userLocation.lat, userLocation.lng],
    [contactLocation.lat, contactLocation.lng],
  ];

  const userIcon = createPinIcon(userPinText, "var(--app-primary,#2d5016)", userLabel);
  const contactIcon = createPinIcon(contactPinText, "var(--app-accent,#8b6914)", contactLabel);
  const distanceIcon = createDistanceIcon(distance);

  return (
    <div className="signal-map-layout flex flex-col h-full min-h-0 bg-[#e8ecef]">
      <div className="signal-map-canvas relative flex-1 min-h-[280px] z-0">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={14}
          className="signal-map-container h-full w-full"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapResizeHandler />
          <FitMapBounds userLocation={userLocation} contactLocation={contactLocation} />
          <Polyline
            positions={routeLine}
            pathOptions={{
              color: "var(--app-accent,#8b6914)",
              weight: 5,
              dashArray: "12 8",
              lineCap: "round",
            }}
          />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
          <Marker position={[contactLocation.lat, contactLocation.lng]} icon={contactIcon} />
          <Marker position={[centerLat, centerLng]} icon={distanceIcon} zIndexOffset={1000} />
        </MapContainer>
      </div>

      <div
        className="flex-shrink-0 bg-white rounded-t-3xl px-4 pt-4 shadow-2xl border-t border-[var(--app-border)] z-10"
        style={{ paddingBottom: "calc(1.25rem + var(--app-safe-bottom))" }}
      >
        {bottomSheet}
      </div>
    </div>
  );
}
