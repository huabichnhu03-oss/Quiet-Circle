import { useAuth } from "@clerk/react";
import { useEffect, useMemo, useState } from "react";

const CLERK_LOAD_TIMEOUT_MS = 8000;

function getClerkSetupError(): string | null {
  const key =
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!key) {
    return "Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in .env.";
  }

  const host = window.location.hostname;
  const isLocal = host === "localhost" || host === "127.0.0.1";
  if (key.startsWith("pk_live_") && isLocal) {
    return "Production Clerk keys only work on quiet-circle.app. Use pk_test_ keys in .env for local development.";
  }

  return null;
}

export function useClerkReady() {
  const setupError = useMemo(() => getClerkSetupError(), []);
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (setupError || isLoaded) return;
    const timer = window.setTimeout(() => setTimedOut(true), CLERK_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [isLoaded, setupError]);

  const clerkUnavailable = Boolean(setupError) || (timedOut && !isLoaded);
  const clerkError =
    setupError ??
    (timedOut && !isLoaded
      ? "Sign-in could not load. Check Clerk keys and allowed origins for this URL in the Clerk dashboard."
      : null);

  return {
    isLoaded,
    isSignedIn,
    userId,
    authReady: isLoaded || timedOut || Boolean(setupError),
    clerkUnavailable,
    clerkError,
  };
}
