import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAuthTokenGetter } from "@/lib/auth-fetch";

export function AuthTokenBridge() {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;
    setAuthTokenGetter(() => getToken());
  }, [getToken, isLoaded]);

  return null;
}
