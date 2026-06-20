import { useRef, useState } from "react";
import {
  MAP_H,
  MAP_STREETS,
  MAP_W,
  type SignalRouteInfo,
} from "@/lib/signal-map";

type SignalMapViewProps = {
  routeInfo: SignalRouteInfo;
  userLabel: string;
  userPinText: string;
  contactLabel: string;
  contactPinText: string;
  bottomSheet: React.ReactNode;
};

export function SignalMapView({
  routeInfo,
  userLabel,
  userPinText,
  contactLabel,
  contactPinText,
  bottomSheet,
}: SignalMapViewProps) {
  const [offset, setOffset] = useState({ x: -180, y: -180 });
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    });
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const { userPin, contactPin, route, midLabel, distance } = routeInfo;

  return (
    <div className="flex flex-col min-h-full bg-[#e8f0d8]">
      <div
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing min-h-0"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ touchAction: "none" }}
      >
        <svg
          width={MAP_W}
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="absolute select-none"
          style={{ left: offset.x, top: offset.y }}
        >
          <rect width={MAP_W} height={MAP_H} fill="#dce8c8" />

          {MAP_STREETS.blocks.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#c8d9aa" opacity="0.55" />
          ))}

          {MAP_STREETS.vRoads.map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2={MAP_H} stroke="#f0ece0" strokeWidth="8" />
          ))}
          {MAP_STREETS.hRoads.map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2={MAP_W} y2={y} stroke="#f0ece0" strokeWidth="8" />
          ))}

          {MAP_STREETS.roadLabels.map((r) => (
            <text
              key={r.text}
              x={r.x}
              y={r.y}
              fontSize="11"
              fill="#7a9a58"
              fontFamily="Inter,sans-serif"
              transform={r.rotate ? `rotate(-90,${r.x},${r.y})` : undefined}
              opacity="0.9"
            >
              {r.text}
            </text>
          ))}

          <polyline
            points={route}
            fill="none"
            stroke="var(--app-accent)"
            strokeWidth="5"
            strokeDasharray="12 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <rect
            x={midLabel.x - 28}
            y={midLabel.y - 12}
            width="72"
            height="22"
            rx="11"
            fill="var(--app-accent)"
          />
          <text
            x={midLabel.x + 8}
            y={midLabel.y + 4}
            fontSize="11"
            fill="white"
            fontFamily="Inter,sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            {distance}
          </text>

          <circle cx={userPin.x} cy={userPin.y} r="14" fill="var(--app-primary)" stroke="white" strokeWidth="3" />
          <text
            x={userPin.x}
            y={userPin.y + 4}
            fontSize="8"
            fill="white"
            fontFamily="Inter,sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            {userPinText}
          </text>
          <rect
            x={userPin.x - 22}
            y={userPin.y + 18}
            width="44"
            height="16"
            rx="8"
            fill="white"
            opacity="0.95"
          />
          <text
            x={userPin.x}
            y={userPin.y + 30}
            fontSize="9"
            fill="var(--app-primary)"
            fontFamily="Inter,sans-serif"
            textAnchor="middle"
            fontWeight="600"
          >
            {userLabel}
          </text>

          <circle cx={contactPin.x} cy={contactPin.y} r="16" fill="var(--app-accent)" stroke="white" strokeWidth="3" />
          <text
            x={contactPin.x}
            y={contactPin.y + 5}
            fontSize="9"
            fill="white"
            fontFamily="Inter,sans-serif"
            textAnchor="middle"
            fontWeight="bold"
          >
            {contactPinText}
          </text>
          <rect
            x={contactPin.x - 38}
            y={contactPin.y + 20}
            width="76"
            height="17"
            rx="8"
            fill="white"
            opacity="0.95"
          />
          <text
            x={contactPin.x}
            y={contactPin.y + 32}
            fontSize="9"
            fill="var(--app-primary)"
            fontFamily="Inter,sans-serif"
            textAnchor="middle"
            fontWeight="600"
          >
            {contactLabel}
          </text>
        </svg>
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
