import crypto from "crypto";

export interface StoredUser {
  name: string;
  email: string;
}

export interface PendingAuth {
  email: string;
  name?: string;
  expiresAt: number;
}

const TOKEN_TTL_MS = 15 * 60 * 1000;

export const users = new Map<string, StoredUser>();
const pendingTokens = new Map<string, PendingAuth>();

export function createMagicLinkToken(email: string, name?: string) {
  const token = crypto.randomBytes(32).toString("hex");
  pendingTokens.set(token, {
    email,
    name,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });
  return token;
}

export function consumeMagicLinkToken(token: string) {
  const pending = pendingTokens.get(token);
  if (!pending) {
    return { ok: false as const, error: "Invalid or expired link." };
  }

  pendingTokens.delete(token);

  if (Date.now() > pending.expiresAt) {
    return { ok: false as const, error: "This link has expired. Please request a new one." };
  }

  const email = pending.email.toLowerCase().trim();
  const existing = users.get(email);
  const isNewUser = !existing;

  if (isNewUser) {
    users.set(email, {
      email,
      name: pending.name?.trim() || email.split("@")[0],
    });
  }

  const user = users.get(email)!;

  return {
    ok: true as const,
    email: user.email,
    name: user.name,
    isNewUser,
  };
}
