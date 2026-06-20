import { ClerkProvider } from "@clerk/react";
import { shadcn } from "@clerk/ui/themes";
import { useLocation } from "wouter";
import type { ReactNode } from "react";
import { getClerkAppearance } from "@/lib/clerk-appearance";
import type { AppTheme } from "@/lib/theme";

const publishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const signInFallbackRedirectUrl =
  import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL || "/";
const signUpFallbackRedirectUrl =
  import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL || "/onboarding";

function clerkNavigate(
  to: string,
  navigate: (path: string, options?: { replace?: boolean }) => void,
  replace: boolean,
  windowNavigate?: (to: URL | string) => void,
) {
  if (/^https?:\/\//i.test(to)) {
    if (windowNavigate) {
      windowNavigate(to);
      return;
    }
    if (replace) {
      window.location.replace(to);
    } else {
      window.location.assign(to);
    }
    return;
  }
  navigate(to, { replace });
}

export function ClerkWouterProvider({
  initialTheme,
  children,
}: {
  initialTheme: AppTheme;
  children: ReactNode;
}) {
  const [, navigate] = useLocation();

  if (!publishableKey) {
    throw new Error(
      "Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in .env.",
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      signInUrl="/login"
      signUpUrl="/sign-up"
      afterSignOutUrl="/login"
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
      routerPush={(to, metadata) => {
        clerkNavigate(to, navigate, false, metadata?.windowNavigate);
      }}
      routerReplace={(to, metadata) => {
        clerkNavigate(to, navigate, true, metadata?.windowNavigate);
      }}
      appearance={{
        theme: shadcn,
        ...getClerkAppearance(initialTheme),
      }}
    >
      {children}
    </ClerkProvider>
  );
}
