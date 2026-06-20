import { useTheme } from "@/hooks/use-theme";
import { THEMES, type AppTheme } from "@/lib/theme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="app-card rounded-2xl p-4" data-testid="theme-switcher">
      <h3 className="text-[15px] font-bold text-[var(--app-text)] mb-1">
        Color theme
      </h3>
      <p className="text-[11px] text-[var(--app-muted)] mb-4">
        Switch between the Quiet Circle and MoodMind palettes.
      </p>

      <div className="flex flex-col gap-2">
        {(Object.keys(THEMES) as AppTheme[]).map((id) => {
          const option = THEMES[id];
          const selected = theme === id;

          return (
            <button
              key={id}
              type="button"
              data-testid={`theme-option-${id}`}
              onClick={() => setTheme(id)}
              className={`w-full rounded-xl border px-3 py-3 text-left transition-all ${
                selected
                  ? "border-[var(--app-primary)] bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)]"
                  : "border-[var(--app-border)] app-card-muted"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1">
                  {option.preview.map((color) => (
                    <span
                      key={color}
                      className="w-5 h-5 rounded-full border border-white"
                      style={{ background: color }}
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--app-text)]">
                    {option.label}
                  </p>
                  <p className="text-[11px] text-[var(--app-muted)]">
                    {option.description}
                  </p>
                </div>
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selected
                      ? "border-[var(--app-primary)]"
                      : "border-[var(--app-border)]"
                  }`}
                >
                  {selected ? (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "var(--app-primary)" }}
                    />
                  ) : null}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
