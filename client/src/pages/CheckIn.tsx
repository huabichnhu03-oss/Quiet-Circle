import { useState } from "react";
import { useLocation } from "wouter";
import { IconHeadphones, IconMenu, IconBell, IconSun } from "@/components/Icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { NavDrawer } from "@/components/NavDrawer";
import { PhoneShell } from "@/components/PhoneShell";
import { CHECKIN_MOOD_MAP } from "@/lib/mood-utils";

const moods = [
  {
    id: "sad",
    label: "Sadness",
    color: "#f9a8d4",
    shadowColor: "rgba(249,168,212,0.4)",
    size: 90,
    face: "sad",
    offsetX: -55,
    offsetY: 30,
  },
  {
    id: "happy",
    label: "Happies",
    color: "#fcd34d",
    shadowColor: "rgba(252,211,77,0.45)",
    size: 130,
    face: "happy",
    offsetX: 0,
    offsetY: 0,
    featured: true,
  },
  {
    id: "neutral",
    label: "Okay",
    color: "#c4b5fd",
    shadowColor: "rgba(196,181,253,0.4)",
    size: 100,
    face: "neutral",
    offsetX: 60,
    offsetY: 20,
  },
];

function BubbleFace({ face, size }: { face: string; size: number }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s / 2 - 1;
  const eyeY = cy - s * 0.08;
  const eyeX = s * 0.15;
  const eyeR = s * 0.065;
  const mouthY = cy + s * 0.12;
  const mouthW = s * 0.28;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={cx} cy={cy} r={r} fill="transparent" />
      {face === "happy" ? (
        <>
          <path
            d={`M ${cx - eyeX - eyeR * 1.1} ${eyeY + eyeR * 0.5} Q ${cx - eyeX} ${eyeY - eyeR * 1.4} ${cx - eyeX + eyeR * 1.1} ${eyeY + eyeR * 0.5}`}
            stroke="rgba(0,0,0,0.25)" strokeWidth={s * 0.04} fill="none" strokeLinecap="round"
          />
          <path
            d={`M ${cx + eyeX - eyeR * 1.1} ${eyeY + eyeR * 0.5} Q ${cx + eyeX} ${eyeY - eyeR * 1.4} ${cx + eyeX + eyeR * 1.1} ${eyeY + eyeR * 0.5}`}
            stroke="rgba(0,0,0,0.25)" strokeWidth={s * 0.04} fill="none" strokeLinecap="round"
          />
          <path
            d={`M ${cx - mouthW} ${mouthY - 2} Q ${cx} ${mouthY + s * 0.14} ${cx + mouthW} ${mouthY - 2}`}
            stroke="rgba(0,0,0,0.22)" strokeWidth={s * 0.04} fill="none" strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx={cx - eyeX} cy={eyeY} r={eyeR} fill="rgba(0,0,0,0.18)" />
          <circle cx={cx + eyeX} cy={eyeY} r={eyeR} fill="rgba(0,0,0,0.18)" />
        </>
      )}
      {face === "sad" && (
        <path
          d={`M ${cx - mouthW} ${mouthY + 6} Q ${cx} ${mouthY - s * 0.08} ${cx + mouthW} ${mouthY + 6}`}
          stroke="rgba(0,0,0,0.22)" strokeWidth={s * 0.04} fill="none" strokeLinecap="round"
        />
      )}
      {face === "neutral" && (
        <line
          x1={cx - mouthW * 0.8} y1={mouthY}
          x2={cx + mouthW * 0.8} y2={mouthY}
          stroke="rgba(0,0,0,0.22)" strokeWidth={s * 0.04} strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function CheckIn() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (mood: string) => apiRequest("POST", "/api/mood-entries", { mood }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      toast({ title: "Mood saved!", description: "We're listening." });
      setTimeout(() => setLocation("/"), 800);
    },
  });

  const handleListeningPress = () => {
    if (!selected || mutation.isPending) return;
    mutation.mutate(CHECKIN_MOOD_MAP[selected] ?? selected);
  };

  return (
    <PhoneShell>
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="flex flex-col flex-1 min-h-0">
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-2"
        style={{ paddingTop: "calc(1rem + var(--app-safe-top))" }}
      >
        <button
          data-testid="button-close-checkin"
          onClick={() => setLocation("/")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card"
          aria-label="Back to home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#4b5563" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <button
            data-testid="button-menu"
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card"
          >
            <IconMenu size={18} />
          </button>
          <button
            type="button"
            data-testid="button-bell"
            onClick={() => setLocation("/notifications")}
            className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card"
            aria-label="Notifications"
          >
            <IconBell size={18} />
          </button>
        </div>
      </div>

      {/* Header text */}
      <div className="flex flex-col items-center text-center px-8 pt-6 pb-2">
        <div className="flex items-center gap-2 mb-4">
          <IconSun size={18} color="#f59e0b" />
          <span className="text-sm font-medium text-[var(--app-muted)]">Good Morning</span>
        </div>
        <h1
          className="text-[28px] sm:text-[30px] font-bold text-[var(--app-text)] leading-tight app-brand"
          data-testid="checkin-heading"
        >
          How are you really<br />feeling today?
        </h1>
        <p className="text-sm text-[var(--app-muted)] mt-3 leading-relaxed max-w-[280px]">
          Take a moment to reflect on your emotions<br />and assess your mood today.
        </p>
      </div>

      {/* Mood bubbles */}
      <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 260 }}>
        <div className="relative" style={{ width: 280, height: 200 }}>
          {moods.map((mood) => {
            const isSelected = selected === mood.id;
            const cx = 140 + mood.offsetX;
            const cy = 100 + mood.offsetY;
            return (
              <button
                key={mood.id}
                data-testid={`bubble-${mood.id}`}
                onClick={() => setSelected(mood.id)}
                className={`absolute rounded-full transition-all duration-300 active:scale-95 flex items-center justify-center overflow-hidden ${
                  mood.featured ? "animate-float" : mood.id === "sad" ? "animate-float-delay" : "animate-float-delay-2"
                }`}
                style={{
                  width: mood.size,
                  height: mood.size,
                  left: cx - mood.size / 2,
                  top: cy - mood.size / 2,
                  background: `radial-gradient(circle at 35% 30%, ${mood.color}ee, ${mood.color}aa)`,
                  boxShadow: isSelected
                    ? `0 0 0 4px white, 0 0 0 6px ${mood.color}, 0 12px 32px ${mood.shadowColor}`
                    : `0 8px 24px ${mood.shadowColor}`,
                  zIndex: mood.featured ? 10 : 5,
                  transform: isSelected ? "scale(1.1)" : undefined,
                }}
              >
                <BubbleFace face={mood.face} size={mood.size} />
              </button>
            );
          })}

          {/* Featured label */}
          <div
            className="absolute text-center pointer-events-none"
            style={{ left: 140 - 50, top: 100 + 65 + 8, width: 100 }}
          >
            <span className="text-[13px] font-bold text-[var(--app-text)]">Happies</span>
          </div>
        </div>
      </div>

      {/* Listening to you button */}
      <div
        className="px-4 sm:px-8 pb-12 flex flex-col items-center gap-4"
        style={{ paddingBottom: "calc(3rem + var(--app-safe-bottom))" }}
      >
        {selected && (
          <p className="text-sm text-[var(--app-muted)] animate-fade-in" data-testid="selected-label">
            Feeling{" "}
            <span className="font-semibold text-[var(--app-text)] capitalize">{selected}</span>
            {" "}today
          </p>
        )}
        <button
          data-testid="button-listening"
          onClick={handleListeningPress}
          disabled={mutation.isPending}
          className={`flex flex-col items-center justify-center rounded-full transition-all duration-300 active:scale-95 glass-card ${
            selected ? "opacity-100" : "opacity-70"
          }`}
          style={{
            width: 130,
            height: 130,
          }}
        >
          <IconHeadphones size={28} color="var(--app-accent)" className="mb-1" />
          <span className="text-xs font-semibold text-[var(--app-muted)] text-center leading-tight">
            {mutation.isPending ? "Saving…" : "Listening\nto you"}
          </span>
        </button>

        <div className="flex items-center gap-1 mt-1 opacity-40">
          {[3, 6, 10, 14, 10, 7, 4, 7, 11, 15, 9, 5, 3].map((h, i) => (
            <div
              key={i}
              className="rounded-full bg-[var(--app-accent)]"
              style={{ width: 3, height: h, opacity: 0.6 + (i % 3) * 0.15 }}
            />
          ))}
        </div>
      </div>
      </div>
    </PhoneShell>
  );
}
