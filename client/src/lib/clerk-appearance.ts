import type { AppTheme } from "@/lib/theme";

const THEME_COLORS: Record<AppTheme, { primary: string; primaryDark: string; accent: string }> = {
  "quiet-circle": {
    primary: "#3d4e1e",
    primaryDark: "#4a5c2a",
    accent: "#8a6b2e",
  },
  moodmind: {
    primary: "#7c3aed",
    primaryDark: "#6d28d9",
    accent: "#8b5cf6",
  },
};

function gradient(primary: string, accent: string) {
  return `linear-gradient(to right, ${primary}, ${accent})`;
}

export function getClerkAppearance(theme: AppTheme = "quiet-circle") {
  const colors = THEME_COLORS[theme];
  return {
    variables: {
      colorPrimary: colors.primary,
      colorText: "#1f2937",
      colorTextSecondary: "#64748b",
      borderRadius: "1rem",
      fontFamily: "system-ui, sans-serif",
    },
    elements: {
      rootBox: "mx-auto w-full",
      card: "shadow-xl rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl",
      headerTitle: "font-bold text-[var(--app-text)]",
      headerSubtitle: "text-[var(--app-muted)]",
      formButtonPrimary: `text-sm font-bold rounded-2xl shadow-md text-white`,
      formFieldInput: "rounded-2xl border-[var(--app-pill-inactive-border)]",
      footerActionLink: "font-semibold",
      identityPreviewEditButton: "",
    },
  };
}

export function getEmbeddedClerkAppearance(theme: AppTheme = "quiet-circle") {
  const base = getClerkAppearance(theme);
  const colors = THEME_COLORS[theme];

  return {
    variables: base.variables,
    elements: {
      ...base.elements,
      rootBox: "w-full min-w-0 max-w-full box-border",
      card: "shadow-none border-0 bg-transparent p-0 gap-3 w-full min-w-0 max-w-full box-border",
      cardBox: "shadow-none border-0 bg-transparent p-0 w-full min-w-0 max-w-full box-border",
      main: "w-full min-w-0 max-w-full gap-3 box-border",
      form: "w-full min-w-0 max-w-full gap-3 box-border",
      formFieldRow: "w-full min-w-0",
      header: "hidden",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      footer: "bg-transparent pt-3 mt-1 w-full min-w-0",
      footerAction: "justify-center",
      footerActionText: "text-xs sm:text-sm",
      formButtonPrimary:
        "w-full max-w-full box-border text-sm font-bold rounded-2xl shadow-md text-white",
      formFieldInput:
        "w-full max-w-full box-border rounded-2xl app-input text-[var(--app-text)] placeholder-[var(--app-muted)]",
      socialButtons: "w-full min-w-0",
      socialButtonsBlockButton:
        "w-full max-w-full box-border rounded-2xl app-input text-[var(--app-text)] font-semibold",
      dividerRow: "w-full",
      dividerLine: "bg-[var(--app-border)]",
      dividerText: "text-[var(--app-muted)] text-xs",
      identityPreview: "w-full max-w-full",
      formFieldLabel: "text-sm text-[var(--app-text)]",
      footerActionLink: `font-semibold`,
    },
    layout: {
      socialButtonsPlacement: "bottom" as const,
    },
  };
}
