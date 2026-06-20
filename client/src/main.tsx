import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { shadcn } from "@clerk/ui/themes";
import { applyTheme, getStoredTheme } from "@/lib/theme";
import { getClerkAppearance } from "@/lib/clerk-appearance";
import App from "./App";
import "./index.css";

applyTheme(getStoredTheme());

const initialTheme = getStoredTheme();

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error(
    "Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY (or NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) in .env — get keys at https://dashboard.clerk.com/last-active?path=api-keys",
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/login"
      signUpUrl="/sign-up"
      afterSignOutUrl="/login"
      appearance={{
        theme: shadcn,
        ...getClerkAppearance(initialTheme),
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
);
