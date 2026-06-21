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

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[calc(96px+var(--app-safe-bottom))]">
        {children}
      </main>

      <nav
        data-testid="bottom-nav"
        className="flex-shrink-0 absolute bottom-0 left-0 right-0 z-50 pointer-events-none"
        style={{ paddingBottom: "var(--app-safe-bottom)" }}
      >
        <div className="px-3 pb-3 pointer-events-auto">
          <div className="rounded-full bg-white px-3 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
            <div className="flex w-full items-center">
              {navItems.map((item) => {
                const isActive = item.match(location);

                if (item.center) {
                  return (
                    <div key={item.id} className="flex min-w-0 flex-1 justify-center">
                      <Link href={item.href} className="flex justify-center">
                        <button
                          type="button"
                          data-testid="nav-signal"
                          className="flex flex-col items-center gap-0.5 -mt-4"
                        >
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md transition-colors ${
                              isActive ? "bg-[var(--app-accent)]" : "bg-[var(--app-primary)]"
                            }`}
                          >
                            <Radio className="h-5 w-5 text-white" />
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
                    </div>
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
                  <div key={item.id} className="flex min-w-0 flex-1 justify-center">
                    <Link href={item.href} className="flex justify-center">
                      <button
                        type="button"
                        data-testid={`nav-${item.id}`}
                        className={`flex w-fit min-w-[48px] flex-col items-center gap-0.5 rounded-full px-2 py-1 transition-colors ${
                          isActive
                            ? "bg-[color-mix(in_srgb,var(--app-accent)_12%,transparent)]"
                            : "bg-[color-mix(in_srgb,var(--app-text)_5%,transparent)]"
                        }`}
                      >
                        <Icon
                          className={`h-[18px] w-[18px] ${
                            isActive
                              ? "text-[var(--app-accent)]"
                              : "text-[var(--app-text)]"
                          }`}
                        />
                        <span
                          className={`text-[9px] font-semibold ${
                            isActive
                              ? "text-[var(--app-accent)]"
                              : "text-[var(--app-text)]"
                          }`}
                        >
                          {item.label}
                        </span>
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </PhoneShell>
  );
}
