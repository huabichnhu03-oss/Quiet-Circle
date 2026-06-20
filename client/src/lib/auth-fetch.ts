type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

export function setAuthTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export async function authHeaders(extra?: HeadersInit): Promise<HeadersInit> {
  const headers = new Headers(extra);
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return headers;
}

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = await authHeaders(init?.headers);
  return fetch(input, { ...init, headers, credentials: "include" });
}

export function isOnboarded(userId: string | null | undefined) {
  if (!userId) return false;
  return localStorage.getItem(`onboarded_${userId}`) === "true";
}

export function markOnboarded(userId: string) {
  localStorage.setItem(`onboarded_${userId}`, "true");
}

export function clearOnboarding(userId: string) {
  localStorage.removeItem(`onboarded_${userId}`);
  localStorage.removeItem(`onboarding_data_${userId}`);
}
