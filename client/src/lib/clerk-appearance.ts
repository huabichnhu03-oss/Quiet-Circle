export const clerkAppearance = {
  variables: {
    colorPrimary: "#7c3aed",
    colorText: "#1f2937",
    colorTextSecondary: "#64748b",
    borderRadius: "1rem",
    fontFamily: "system-ui, sans-serif",
  },
  elements: {
    rootBox: "mx-auto w-full",
    card: "shadow-xl rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl",
    headerTitle: "font-bold text-gray-800",
    headerSubtitle: "text-slate-500",
    formButtonPrimary:
      "bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-sm font-bold rounded-2xl shadow-md",
    formFieldInput: "rounded-2xl border-gray-200",
    footerActionLink: "text-violet-600 hover:text-violet-700 font-semibold",
    identityPreviewEditButton: "text-violet-600",
  },
};

/** Clerk UI embedded inside the MoodMind auth glass card (no outer card/header). */
export const embeddedClerkAppearance = {
  variables: clerkAppearance.variables,
  elements: {
    ...clerkAppearance.elements,
    rootBox: "w-full",
    card: "shadow-none border-0 bg-transparent p-0 gap-4",
    cardBox: "shadow-none border-0 bg-transparent p-0",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    footer: "bg-transparent",
    footerAction: "justify-center",
    formButtonPrimary:
      "w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-sm font-bold rounded-2xl shadow-md",
    formFieldInput:
      "rounded-2xl border-gray-200 bg-white text-gray-800 placeholder-gray-400",
    socialButtonsBlockButton:
      "rounded-2xl border-gray-200 bg-white text-gray-700 font-semibold",
    dividerLine: "bg-gray-200",
    dividerText: "text-slate-500 text-xs",
  },
};
