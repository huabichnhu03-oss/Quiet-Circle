export type AppTheme = "quiet-circle" | "moodmind";

export const THEME_STORAGE_KEY = "moodmind_theme";

export const THEMES: Record<
  AppTheme,
  {
    label: string;
    brandName: string;
    description: string;
    preview: [string, string, string];
    faviconHref: string;
  }
> = {
  "quiet-circle": {
    label: "Quiet Circle",
    brandName: "Quiet Circle",
    description: "Warm cream with olive accents",
    preview: ["#f4eedf", "#3d4e1e", "#8a6b2e"],
    faviconHref: "/favicon.svg",
  },
  moodmind: {
    label: "MoodMind",
    brandName: "MoodMind",
    description: "Soft pastel with purple accents",
    preview: ["#dcd8f9", "#7c3aed", "#8b5cf6"],
    faviconHref: "/favicon-moodmind.svg",
  },
};

export function getThemeBrandName(theme: AppTheme): string {
  return THEMES[theme].brandName;
}

export const THEME_CHART_ACCENT: Record<AppTheme, string> = {
  "quiet-circle": "#8a6b2e",
  moodmind: "#8b5cf6",
};

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") return "quiet-circle";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "moodmind" ? "moodmind" : "quiet-circle";
}

function updateFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }
  link.href = href;
}

export function applyTheme(theme: AppTheme) {
  const config = THEMES[theme];

  document.documentElement.dataset.theme = theme;
  document.title = config.brandName;
  updateFavicon(config.faviconHref);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
