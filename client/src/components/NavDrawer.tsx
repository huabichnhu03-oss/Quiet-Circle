import { useLocation, Link } from "wouter";
import { AuthControls } from "@/components/AuthControls";
import { useTheme } from "@/hooks/use-theme";
import { getThemeBrandName } from "@/lib/theme";
import {
  IllustrationPlan,
  IllustrationBreathe,
  IllustrationJournal,
  IllustrationInsights,
  IllustrationMilestone,
  IllustrationRelax,
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
  { href: "/contacts", label: "Safety Circle", Illustration: IllustrationCommunity },
];

interface NavDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NavDrawer({ open, onClose }: NavDrawerProps) {
  const [location] = useLocation();
  const { theme } = useTheme();
  const brandName = getThemeBrandName(theme);

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
        className="absolute top-0 left-0 bottom-0 z-50 flex flex-col app-card"
        style={{
          width: 260,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: open ? "4px 0 32px rgba(0,0,0,0.12)" : "none",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease",
          pointerEvents: open ? "auto" : "none",
          visibility: open ? "visible" : "hidden",
        }}
      >
        <div className="flex items-center justify-between px-5 pt-10 pb-6">
          <div>
            <p
              className="text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--app-accent)" }}
            >
              Navigate
            </p>
            <h2 className="text-lg font-bold text-[var(--app-text)] app-brand">
              {brandName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <AuthControls />
            <button
              data-testid="button-drawer-close"
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
              style={{ background: "rgba(0,0,0,0.05)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
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
                      background: isActive
                        ? "color-mix(in srgb, var(--app-primary) 10%, transparent)"
                        : "transparent",
                    }}
                  >
                    <div className="flex-shrink-0">
                      <Illustration size={36} />
                    </div>
                    <span
                      className="text-[14px] font-semibold"
                      style={{ color: isActive ? "var(--app-primary)" : "var(--app-text)" }}
                    >
                      {label}
                    </span>
                    {isActive && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--app-accent)" }}
                      />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-5 pb-8">
          <div className="h-[1px] bg-[var(--app-border)] mb-4" />
          <p className="text-[10px] text-[var(--app-muted)] text-center">
            {brandName} · Your mental wellness companion
          </p>
        </div>
      </div>
    </>
  );
}
