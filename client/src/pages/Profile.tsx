import { useState } from "react";
import { SignOutButton, useUser } from "@clerk/react";
import { clearOnboarding } from "@/lib/auth-fetch";
import { IconMenu, IconBell, IconBed, IconHeart, IconChevronRight } from "@/components/Icons";
import { NavDrawer } from "@/components/NavDrawer";
import { IllustrationCommunity } from "@/components/Illustrations";

function SleepBar({ label, pct, color, icon }: { label: string; pct: number; color: string; icon: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
        style={{ background: `${color}18` }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[13px] font-semibold text-gray-700">{label}</span>
          <div className="flex items-center gap-1">
            <span className="text-[12px] font-bold" style={{ color }}>{pct}%</span>
            <IconChevronRight size={12} color="#d1d5db" />
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})` }}
          />
        </div>
      </div>
    </div>
  );
}

function StatIllustration({ type }: { type: "activity" | "body" | "heart" }) {
  if (type === "activity") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="rgba(16,185,129,0.12)" />
        <path d="M8 22 L13 16 L17 20 L22 12 L28 18" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="18" r="2.5" fill="#10b981" />
      </svg>
    );
  }
  if (type === "body") {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" fill="rgba(236,72,153,0.12)" />
        <circle cx="18" cy="12" r="3.5" fill="#ec4899" opacity="0.6" />
        <path d="M12 18 Q18 15 24 18 L22 28 L18 25 L14 28 Z" fill="#ec4899" opacity="0.5" />
        <path d="M12 18 L10 24" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 18 L26 24" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="16" fill="rgba(239,68,68,0.1)" />
      <path d="M18 26 C18 26 9 20 9 14 C9 11.2 11.2 9 14 9 C15.6 9 17 9.8 18 11 C19 9.8 20.4 9 22 9 C24.8 9 27 11.2 27 14 C27 20 18 26 18 26Z" fill="#ef4444" opacity="0.55" />
    </svg>
  );
}

function StatCard({ type, label, value, bg }: { type: "activity" | "body" | "heart"; label: string; value: string; bg: string }) {
  return (
    <div
      className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1.5"
      style={{ background: bg }}
      data-testid={`stat-${label.toLowerCase()}`}
    >
      <StatIllustration type={type} />
      <span className="text-[11px] font-bold text-gray-700">{label}</span>
      <span className="text-[10px] text-slate-600 font-medium">{value}</span>
    </div>
  );
}

export default function Profile() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useUser();

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "MoodMind user";

  return (
    <div className="flex flex-col min-h-full relative">
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button
          data-testid="button-menu"
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card"
        >
          <IconMenu size={18} />
        </button>
        <button data-testid="button-bell" className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card">
          <IconBell size={18} />
        </button>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center pb-5 px-5">
        <div
          data-testid="avatar"
          className="w-24 h-24 rounded-full mb-4 flex items-center justify-center overflow-hidden shadow-lg"
          style={{
            background: "linear-gradient(135deg, #fbbf24 0%, #fb923c 50%, #f97316 100%)",
            border: "3px solid rgba(255,255,255,0.9)",
          }}
        >
          <svg viewBox="0 0 96 96" width="96" height="96" fill="none">
            <ellipse cx="48" cy="82" rx="28" ry="18" fill="#6366f1" />
            <rect x="40" y="62" width="16" height="14" rx="8" fill="#fde68a" />
            <ellipse cx="48" cy="52" rx="22" ry="24" fill="#fde68a" />
            <ellipse cx="48" cy="32" rx="22" ry="12" fill="#1f2937" />
            <ellipse cx="26" cy="52" rx="5" ry="14" fill="#1f2937" />
            <ellipse cx="69" cy="38" rx="6" ry="10" fill="#1f2937" transform="rotate(-20 69 38)" />
            <ellipse cx="41" cy="52" rx="3" ry="3.5" fill="#1f2937" />
            <ellipse cx="55" cy="52" rx="3" ry="3.5" fill="#1f2937" />
            <circle cx="42" cy="51" r="1" fill="white" />
            <circle cx="56" cy="51" r="1" fill="white" />
            <ellipse cx="36" cy="58" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6" />
            <ellipse cx="60" cy="58" rx="4" ry="2.5" fill="#fca5a5" opacity="0.6" />
            <path d="M42 62 Q48 67 54 62" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M27 46 Q28 30 48 28 Q68 30 69 46" stroke="#6366f1" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="23" y="46" width="8" height="12" rx="4" fill="#6366f1" />
            <rect x="65" y="46" width="8" height="12" rx="4" fill="#6366f1" />
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <IllustrationCommunity size={32} />
          <h2
            className="text-[24px] font-bold text-gray-800"
            style={{ fontFamily: "'Khand', sans-serif" }}
            data-testid="profile-name"
          >{displayName}</h2>
        </div>

        <div className="flex items-center gap-2" data-testid="profile-tags">
          {["Designer", "Illustrator", "Model"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold text-gray-600 glass-card"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Sleep Quality card */}
      <div className="px-5 pb-3">
        <div className="glass-card rounded-3xl p-5" data-testid="card-sleep">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.1)" }}>
              <IconBed size={20} color="#6366f1" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-gray-800">Sleep Quality</h3>
              <p className="text-[11px] text-slate-600">Track your stress, health, sleep, and more</p>
            </div>
          </div>

          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[10px] text-slate-600 font-medium mb-1">Sleep time</p>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[42px] font-bold text-gray-800 leading-none">7</span>
                <span className="text-[18px] font-bold text-gray-500 leading-none">h</span>
                <span className="text-[42px] font-bold text-gray-800 leading-none ml-1">39</span>
                <span className="text-[18px] font-bold text-gray-500 leading-none">m</span>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #fecaca, #fca5a5)" }}
              data-testid="bpm-badge"
            >
              <span className="text-[11px] font-bold text-red-700">85.4 BPM AVG</span>
              <IconHeart size={12} color="#ef4444" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SleepBar label="Dream Sleep" pct={54} color="#10b981" icon="🌙" />
            <SleepBar label="Deep Sleep" pct={73} color="#ec4899" icon="💤" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="px-5 pb-4">
        <div className="flex gap-3" data-testid="stat-cards">
          <StatCard type="activity" label="Activity" value="+3.9 Points" bg="rgba(16,185,129,0.08)" />
          <StatCard type="body" label="Body" value="78.9% mscl" bg="rgba(236,72,153,0.08)" />
          <StatCard type="heart" label="Heart" value="83.8 bpm" bg="rgba(239,68,68,0.08)" />
        </div>
      </div>

      {/* Sign out */}
      <div className="px-5 pb-6">
        <SignOutButton signOutOptions={{ redirectUrl: "/login" }}>
          <button
            data-testid="button-sign-out"
            onClick={() => {
              if (user?.id) clearOnboarding(user.id);
            }}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border border-gray-200"
            style={{ background: "rgba(255,255,255,0.7)", color: "#ef4444" }}
          >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="16 17 21 12 16 7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="21" y1="12" x2="9" y2="12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
