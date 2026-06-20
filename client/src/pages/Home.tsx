import { Link, useLocation } from "wouter";
import { useUser } from "@clerk/react";
import { Bell, MessageSquare, Phone } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";

export const Home = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const { user } = useUser();
  const { profile } = useUserProfile();

  const firstName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "there";

  return (
    <div className="flex flex-col min-h-full px-4 pb-6 space-y-3">
      <div className="pt-1">
        <h1
          data-testid="headline"
          className="text-[22px] font-bold text-[var(--app-text)] leading-tight"
        >
          Good Morning, {firstName}.
        </h1>
        <p className="text-xs text-[var(--app-muted)] mt-1 leading-relaxed">
          {profile.homeTagline}
        </p>
      </div>

      <Link href="/checkin">
        <button
          type="button"
          data-testid="button-start"
          className="btn-primary text-sm font-semibold px-5 py-2 rounded-full self-start"
        >
          Start
        </button>
      </Link>

      <div className="app-card rounded-2xl px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-[var(--app-text)]">
            Daily Check-In
          </p>
          <p className="text-[11px] text-[var(--app-muted)] mt-0.5">
            How are you feeling today?
          </p>
        </div>
        <Link href="/checkin">
          <button
            type="button"
            data-testid="button-checkin"
            className="btn-primary text-[11px] font-semibold px-3 py-1.5 rounded-full"
          >
            Start
          </button>
        </Link>
      </div>

      <p className="text-[13px] font-bold text-[var(--app-text)] pt-1">
        Quick Actions
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          data-testid="button-sos-home"
          onClick={() => setLocation("/emergency")}
          className="rounded-2xl p-4 flex flex-col items-start gap-8 aspect-square text-left"
          style={{ background: "var(--app-primary)" }}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[13px] font-semibold leading-tight">
            Signal for Help
          </span>
        </button>

        <button
          type="button"
          onClick={() => setLocation("/crisis")}
          className="rounded-2xl p-4 flex flex-col items-start gap-8 aspect-square text-left"
          style={{ background: "var(--app-primary-dark)" }}
        >
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-[13px] font-semibold leading-tight">
            Crisis Hotline
          </span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setLocation("/ai-chat")}
        className="w-full app-card-muted rounded-2xl p-4 flex items-center gap-3 text-left"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: "color-mix(in srgb, var(--app-accent) 20%, transparent)",
          }}
        >
          <MessageSquare className="w-5 h-5 text-[var(--app-accent)]" />
        </div>
        <span className="text-[13px] font-semibold text-[var(--app-text)]">
          Private Messaging
        </span>
      </button>
    </div>
  );
};
