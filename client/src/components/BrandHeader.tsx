import { useTheme } from "@/hooks/use-theme";
import { getThemeBrandName } from "@/lib/theme";
import { IconBell, IconMenu } from "@/components/Icons";
import { Link } from "wouter";

type BrandHeaderProps = {
  onMenuClick?: () => void;
  rightSlot?: React.ReactNode;
};

export function BrandHeader({ onMenuClick, rightSlot }: BrandHeaderProps) {
  const { theme } = useTheme();
  const brandName = getThemeBrandName(theme);

  return (
    <header
      className="relative flex items-center justify-center px-4 py-2 flex-shrink-0"
      style={{ paddingTop: "calc(0.5rem + var(--app-safe-top))" }}
    >
      {onMenuClick ? (
        <div className="absolute left-4">
          <button
            type="button"
            data-testid="button-menu"
            onClick={onMenuClick}
            className="w-9 h-9 flex items-center justify-center rounded-2xl app-card text-[var(--app-text)]"
            aria-label="Open menu"
          >
            <IconMenu size={18} />
          </button>
        </div>
      ) : null}

      <span
        className="text-[17px] font-semibold text-[var(--app-primary)] tracking-wide app-brand"
        data-testid="brand-title"
      >
        {brandName}
      </span>

      <div className="absolute right-4 flex items-center gap-2">
        {rightSlot ?? (
          <>
            <Link href="/notifications">
              <button
                type="button"
                data-testid="button-bell"
                className="w-9 h-9 flex items-center justify-center rounded-2xl app-card text-[var(--app-text)]"
                aria-label="Notifications"
              >
                <IconBell size={18} />
              </button>
            </Link>
            <Link href="/profile">
              <button
                type="button"
                data-testid="button-profile"
                className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: "var(--app-primary)" }}
                aria-label="Profile"
              >
                Me
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
