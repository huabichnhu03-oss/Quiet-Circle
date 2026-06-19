import { useLocation, Link } from "wouter";
import {
  IconHome,
  IconJournal,
  IconResources,
  IconSafety,
  IconProfile,
} from "@/components/Icons";

const navItems = [
  { id: "home", label: "Home", Icon: IconHome, href: "/" },
  { id: "journals", label: "Journal", Icon: IconJournal, href: "/journals" },
  { id: "explore", label: "Explore", Icon: IconResources, href: "/community" },
  { id: "safety", label: "Safety", Icon: IconSafety, href: "/contacts" },
  { id: "profile", label: "Profile", Icon: IconProfile, href: "/profile" },
];

const PASTEL_BG = "linear-gradient(145deg, #c8f5ea 0%, #dcd8f9 50%, #fde4d8 100%)";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] overflow-hidden flex items-start justify-center bg-gray-100">
      <div
        className="relative w-full max-w-[430px] h-[100dvh] flex flex-col overflow-hidden shadow-2xl"
        style={{ background: PASTEL_BG }}
      >
        <main className="flex-1 overflow-y-auto overscroll-contain pb-[80px]">
          {children}
        </main>

        <nav
          data-testid="bottom-nav"
          className="flex-shrink-0 absolute bottom-0 left-0 right-0 z-50"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
          }}
        >
          <div className="flex items-center justify-around px-1 py-2">
            {navItems.map(({ id, label, Icon, href }) => {
              const isActive = location === href;
              return (
                <Link key={id} href={href}>
                  <button
                    data-testid={`nav-${id}`}
                    className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300"
                  >
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive ? "bg-gray-900" : "bg-transparent"
                      }`}
                    >
                      <Icon size={18} active={isActive} />
                    </div>
                    <span
                      className={`text-[9px] font-semibold transition-colors duration-300 ${
                        isActive ? "text-gray-900" : "text-slate-600"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export { PASTEL_BG };
