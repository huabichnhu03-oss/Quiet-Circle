import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAuthTokenGetter } from "@/lib/auth-fetch";

export function AuthTokenBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    setAuthTokenGetter(async () => {
      if (!isSignedIn) return null;
      return (await getToken()) ?? null;
    });
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}
