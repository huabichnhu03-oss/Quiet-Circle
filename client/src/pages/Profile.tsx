import { useState } from "react";
import { Link } from "wouter";
import { SignOutButton, useUser } from "@clerk/react";
import { clearOnboarding } from "@/lib/auth-fetch";
import { IconBed, IconHeart, IconMoon, IconSparkles, IconUser } from "@/components/Icons";
import { IllustrationCommunity } from "@/components/Illustrations";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { EditToggle } from "@/components/ItemActions";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";
import type { UserProfileData } from "@shared/profile-data";

function EditableTags({
  editing,
  tags,
  onChange,
}: {
  editing: boolean;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState(tags.join(", "));

  if (!editing) {
    return (
      <div className="flex items-center gap-2 flex-wrap justify-center" data-testid="profile-tags">
        {tags.map((tag) => (
          <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold text-[var(--app-muted)] app-card">
            {tag}
          </span>
        ))}
      </div>
    );
  }

  return (
    <input
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        );
      }}
      className="w-full app-input rounded-xl px-4 py-2 text-sm text-center"
      placeholder="Tags separated by commas"
      data-testid="input-profile-tags"
    />
  );
}

export default function Profile() {
  const { user } = useUser();
  const { toast } = useToast();
  const { profile, updateProfile, isSaving } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<UserProfileData>(profile);

  const displayName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "MoodMind user";

  const startEditing = () => {
    setDraft(profile);
    setEditing(true);
  };

  const saveProfile = async () => {
    try {
      await updateProfile(draft);
      toast({ title: "Profile updated" });
      setEditing(false);
    } catch {
      toast({ title: "Could not save profile", variant: "destructive" });
    }
  };

  const setField = <K extends keyof UserProfileData>(key: K, value: UserProfileData[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col min-h-full relative px-4 pb-6">
      <div className="flex justify-end pt-2 pb-1">
        <EditToggle
          editing={editing}
          onToggle={() => (editing ? setEditing(false) : startEditing())}
          onSave={saveProfile}
          isSaving={isSaving}
        />
      </div>

      <div className="flex flex-col items-center pb-5">
        <div
          data-testid="avatar"
          className="w-24 h-24 rounded-full mb-4 flex items-center justify-center overflow-hidden shadow-lg"
          style={{
            background: "linear-gradient(135deg, var(--app-accent), var(--app-primary))",
            border: "3px solid rgba(255,255,255,0.9)",
          }}
        >
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <IconUser size={40} color="white" />
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <IllustrationCommunity size={32} />
          <h2 className="text-[24px] font-bold text-[var(--app-text)] app-brand" data-testid="profile-name">
            {displayName}
          </h2>
        </div>

        <EditableTags
          editing={editing}
          tags={editing ? draft.tags : profile.tags}
          onChange={(tags) => setField("tags", tags)}
        />
      </div>

      <div className="pb-4">
        <ThemeSwitcher />
      </div>

      <div className="pb-3">
        <div className="app-card rounded-3xl p-5" data-testid="card-sleep">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--app-primary) 12%, transparent)" }}
            >
              <IconBed size={20} color="var(--app-primary)" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[var(--app-text)]">Sleep Quality</h3>
              <p className="text-[11px] text-[var(--app-muted)]">Track your stress, health, sleep, and more</p>
            </div>
          </div>

          <div className="flex items-end justify-between mb-5 gap-3">
            <div>
              <p className="text-[10px] text-[var(--app-muted)] font-medium mb-1">Sleep time</p>
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={draft.sleepHours}
                    onChange={(e) => setField("sleepHours", Number(e.target.value))}
                    className="w-14 app-input rounded-lg px-2 py-1 text-sm"
                  />
                  <span className="text-sm">h</span>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={draft.sleepMinutes}
                    onChange={(e) => setField("sleepMinutes", Number(e.target.value))}
                    className="w-14 app-input rounded-lg px-2 py-1 text-sm"
                  />
                  <span className="text-sm">m</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[42px] font-bold text-[var(--app-text)] leading-none">{profile.sleepHours}</span>
                  <span className="text-[18px] font-bold text-[var(--app-muted)] leading-none">h</span>
                  <span className="text-[42px] font-bold text-[var(--app-text)] leading-none ml-1">{profile.sleepMinutes}</span>
                  <span className="text-[18px] font-bold text-[var(--app-muted)] leading-none">m</span>
                </div>
              )}
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "linear-gradient(135deg, #fecaca, #fca5a5)" }}
              data-testid="bpm-badge"
            >
              {editing ? (
                <input
                  type="number"
                  step="0.1"
                  value={draft.bpmAvg}
                  onChange={(e) => setField("bpmAvg", Number(e.target.value))}
                  className="w-16 bg-transparent text-[11px] font-bold text-red-700 outline-none"
                />
              ) : (
                <span className="text-[11px] font-bold text-red-700">{profile.bpmAvg} BPM AVG</span>
              )}
              <IconHeart size={12} color="#ef4444" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { key: "dreamSleepPct" as const, label: "Dream Sleep", color: "#10b981", Icon: IconMoon },
              { key: "deepSleepPct" as const, label: "Deep Sleep", color: "#ec4899", Icon: IconSparkles },
            ].map(({ key, label, color, Icon }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                  <Icon size={16} color={color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-semibold text-[var(--app-text)]">{label}</span>
                    {editing ? (
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={draft[key]}
                        onChange={(e) => setField(key, Number(e.target.value))}
                        className="w-14 app-input rounded-lg px-2 py-0.5 text-xs text-right"
                      />
                    ) : (
                      <span className="text-[12px] font-bold" style={{ color }}>{profile[key]}%</span>
                    )}
                  </div>
                  <div className="h-2.5 rounded-full bg-[var(--app-muted-bg)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${editing ? draft[key] : profile[key]}%`,
                        background: `linear-gradient(90deg, ${color}cc, ${color})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pb-4">
        <div className="flex gap-3" data-testid="stat-cards">
          {[
            { key: "activityValue" as const, label: "Activity", bg: "rgba(16,185,129,0.08)" },
            { key: "bodyValue" as const, label: "Body", bg: "rgba(236,72,153,0.08)" },
            { key: "heartValue" as const, label: "Heart", bg: "rgba(239,68,68,0.08)" },
          ].map(({ key, label, bg }) => (
            <div key={key} className="flex-1 rounded-2xl p-3 flex flex-col items-center gap-1.5" style={{ background: bg }}>
              <span className="text-[11px] font-bold text-[var(--app-text)]">{label}</span>
              {editing ? (
                <input
                  value={draft[key]}
                  onChange={(e) => setField(key, e.target.value)}
                  className="w-full app-input rounded-lg px-2 py-1 text-[10px] text-center"
                />
              ) : (
                <span className="text-[10px] text-[var(--app-muted)] font-medium">{profile[key]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="pb-4 space-y-3">
        <div className="app-card rounded-2xl p-4">
          <p className="text-xs font-semibold text-[var(--app-muted)] mb-2">Home tagline</p>
          {editing ? (
            <textarea
              value={draft.homeTagline}
              onChange={(e) => setField("homeTagline", e.target.value)}
              className="w-full app-input rounded-xl p-3 text-sm outline-none resize-none"
            />
          ) : (
            <p className="text-sm text-[var(--app-text)]">{profile.homeTagline}</p>
          )}
        </div>
        <div className="app-card rounded-2xl p-4">
          <p className="text-xs font-semibold text-[var(--app-muted)] mb-2">Daily insight</p>
          {editing ? (
            <textarea
              value={draft.dailyInsight}
              onChange={(e) => setField("dailyInsight", e.target.value)}
              className="w-full app-input rounded-xl p-3 text-sm outline-none resize-none min-h-[80px]"
            />
          ) : (
            <p className="text-sm text-[var(--app-text)]">{profile.dailyInsight}</p>
          )}
        </div>
        <Link href="/onboarding">
          <button
            type="button"
            className="w-full py-3 rounded-2xl text-sm font-semibold app-card border border-[var(--app-border)]"
            data-testid="button-edit-preferences"
          >
            Edit wellness preferences
          </button>
        </Link>
      </div>

      <SignOutButton signOutOptions={{ redirectUrl: "/login" }}>
        <button
          data-testid="button-sign-out"
          onClick={() => {
            if (user?.id) clearOnboarding(user.id);
          }}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 border border-[var(--app-border)] app-card text-red-500"
        >
          Sign Out
        </button>
      </SignOutButton>
    </div>
  );
}
