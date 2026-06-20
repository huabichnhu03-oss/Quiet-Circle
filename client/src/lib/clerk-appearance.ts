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

  return {
    variables: {
      ...base.variables,
      borderRadius: "0.75rem",
      fontSize: "0.875rem",
      spacingUnit: "0.65rem",
    },
    elements: {
      ...base.elements,
      rootBox: "w-full min-w-0 max-w-full box-border",
      card: "shadow-none border-0 bg-transparent p-0 gap-2 w-full min-w-0 max-w-full box-border overflow-visible",
      cardBox: "shadow-none border-0 bg-transparent p-0 w-full min-w-0 max-w-full box-border overflow-visible",
      main: "w-full min-w-0 max-w-full gap-2 box-border overflow-visible",
      form: "w-full min-w-0 max-w-full gap-2 box-border overflow-visible",
      formFieldRow: "w-full min-w-0 gap-1",
      header: "hidden",
      headerTitle: "hidden",
      headerSubtitle: "hidden",
      footer: "bg-transparent pt-2 mt-0 w-full min-w-0 overflow-visible",
      footerPages: "hidden",
      footerAction: "justify-center py-0",
      footerActionText: "text-xs",
      formButtonPrimary:
        "w-full max-w-full box-border text-xs sm:text-sm font-bold rounded-xl shadow-md text-white px-4 py-2 min-h-9",
      formFieldInput:
        "w-full max-w-full box-border rounded-xl app-input text-sm text-[var(--app-text)] placeholder-[var(--app-muted)] px-3.5 sm:px-4 py-2 min-h-9",
      otpCodeFieldInputs: "flex justify-center gap-1.5 w-full overflow-visible flex-wrap",
      otpCodeFieldInput:
        "w-9 min-w-7 max-w-10 h-10 text-center text-base rounded-xl app-input text-[var(--app-text)] flex-shrink-0",
      formFieldInputShowPasswordButton: "text-[var(--app-muted)]",
      socialButtons: "w-full min-w-0 gap-2",
      socialButtonsBlockButton:
        "w-full max-w-full box-border rounded-xl app-input text-xs sm:text-sm text-[var(--app-text)] font-semibold px-3.5 sm:px-4 py-2 min-h-9",
      dividerRow: "w-full my-1",
      dividerLine: "bg-[var(--app-border)]",
      dividerText: "text-[var(--app-muted)] text-xs",
      identityPreview: "w-full max-w-full text-sm",
      formFieldLabel: "text-xs text-[var(--app-text)]",
      formFieldHintText: "text-xs text-[var(--app-muted)]",
      formResendCodeLink: "text-xs font-semibold",
      alternativeMethodsBlockButton: "text-xs font-semibold",
      footerActionLink: "font-semibold text-xs sm:text-sm",
    },
    layout: {
      socialButtonsPlacement: "bottom" as const,
    },
  };
}
