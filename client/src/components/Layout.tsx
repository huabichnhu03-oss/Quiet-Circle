import { useState } from "react";
import { useLocation, Link } from "wouter";
import { BookOpen, Home, Layers, Radio, Users } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { NavDrawer } from "@/components/NavDrawer";
import { PhoneShell } from "@/components/PhoneShell";

type NavTab = {
  id: string;
  label: string;
  href: string;
  match: (path: string) => boolean;
  center?: boolean;
};

const navItems: NavTab[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    match: (path) => path === "/",
  },
  {
    id: "journal",
    label: "Journal",
    href: "/journals",
    match: (path) => path.startsWith("/journals") || path === "/entries",
  },
  {
    id: "signal",
    label: "Signal",
    href: "/emergency",
    match: (path) =>
      path.startsWith("/emergency") ||
      path.startsWith("/contacts") ||
      path === "/crisis",
    center: true,
  },
  {
    id: "community",
    label: "Community",
    href: "/community",
    match: (path) => path.startsWith("/community"),
  },
  {
    id: "resources",
    label: "Resources",
    href: "/resources",
    match: (path) => path.startsWith("/resources"),
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <PhoneShell>
      <BrandHeader onMenuClick={() => setDrawerOpen(true)} />
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="flex-1 overflow-y-auto overscroll-contain pb-[calc(88px+var(--app-safe-bottom))]">
        {children}
      </main>

      <nav
        data-testid="bottom-nav"
        className="flex-shrink-0 absolute bottom-0 left-0 right-0 z-50 border-t border-[var(--app-border)] bg-[var(--app-nav-bg)]"
        style={{ paddingBottom: "var(--app-safe-bottom)" }}
      >
        <div className="grid grid-cols-5 items-end px-2 pt-1.5 pb-2">
          {navItems.map((item) => {
            const isActive = item.match(location);

            if (item.center) {
              return (
                <Link key={item.id} href={item.href}>
                  <button
                    type="button"
                    data-testid="nav-signal"
                    className="w-full flex flex-col items-center gap-0.5 -mt-4"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-colors ${
                        isActive ? "bg-[var(--app-accent)]" : "bg-[var(--app-primary)]"
                      }`}
                    >
                      <Radio className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`text-[9px] font-semibold ${
                        isActive
                          ? "text-[var(--app-accent)]"
                          : "text-[var(--app-muted)]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </Link>
              );
            }

            const Icon =
              item.id === "home"
                ? Home
                : item.id === "journal"
                  ? BookOpen
                  : item.id === "community"
                    ? Users
                    : Layers;

            return (
              <Link key={item.id} href={item.href}>
                <button
                  type="button"
                  data-testid={`nav-${item.id}`}
                  className="w-full flex flex-col items-center gap-0.5 py-0.5 px-2"
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      isActive
                        ? "text-[var(--app-accent)]"
                        : "text-[var(--app-muted)]"
                    }`}
                  />
                  <span
                    className={`text-[9px] font-semibold ${
                      isActive
                        ? "text-[var(--app-accent)]"
                        : "text-[var(--app-muted)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </PhoneShell>
  );
}
