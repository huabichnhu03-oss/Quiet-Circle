import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

const CLERK_LOAD_TIMEOUT_MS = 8000;

export function useClerkReady() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (isLoaded) return;
    const timer = window.setTimeout(() => setTimedOut(true), CLERK_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [isLoaded]);

  return {
    isLoaded,
    isSignedIn,
    userId,
    authReady: isLoaded || timedOut,
    clerkUnavailable: timedOut && !isLoaded,
  };
}
