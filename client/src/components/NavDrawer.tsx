import { useLocation, Link } from "wouter";
import {
  IllustrationPlan,
  IllustrationBreathe,
  IllustrationJournal,
  IllustrationInsights,
  IllustrationMilestone,
  IllustrationRelax,
  IllustrationSafety,
  IllustrationCommunity,
} from "@/components/Illustrations";

const drawerLinks = [
  { href: "/", label: "Home", Illustration: IllustrationPlan },
  { href: "/checkin", label: "Check-In", Illustration: IllustrationRelax },
  { href: "/breathe", label: "Breathe", Illustration: IllustrationBreathe },
  { href: "/journals", label: "Journals", Illustration: IllustrationJournal },
  { href: "/entries", label: "Entries", Illustration: IllustrationMilestone },
  { href: "/insights", label: "Insights", Illustration: IllustrationInsights },
  { href: "/profile", label: "Profile", Illustration: IllustrationCommunity },
];

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const [location] = useLocation();

  return (
    <>
      {open && (
        <div
          data-testid="drawer-backdrop"
          className="absolute inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }}
          onClick={onClose}
        />
      )}

      <div
        data-testid="nav-drawer"
        className="absolute top-0 left-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 260,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.12)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-10 pb-6">
          <div>
            <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-widest">Navigate</p>
            <h2 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Khand', sans-serif" }}>
              MoodMind
            </h2>
          </div>
          <button
            data-testid="button-drawer-close"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-gray-900 transition-colors"
            style={{ background: "rgba(0,0,0,0.05)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-8">
          <div className="flex flex-col gap-1">
            {drawerLinks.map(({ href, label, Illustration }) => {
              const isActive = location === href;
              return (
                <Link key={href} href={href}>
                  <button
                    data-testid={`drawer-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={onClose}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: isActive ? "rgba(139,92,246,0.1)" : "transparent",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <Illustration size={36} />
                    </div>
                    <span
                      className="text-[14px] font-semibold"
                      style={{ color: isActive ? "#7c3aed" : "#374151" }}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-5 pb-8">
          <div className="h-[1px] bg-gray-100 mb-4" />
          <p className="text-[10px] text-slate-600 text-center">MoodMind · Your mental wellness companion</p>
        </div>
      </div>
    </>
  );
}
