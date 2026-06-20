import crypto from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";
import { users as usersTable, type User } from "@shared/schema";
import { getDb } from "./db";

const scryptAsync = promisify(crypto.scrypt);

const CODE_TTL_MS = 15 * 60 * 1000;

interface PendingVerification {
  email: string;
  code: string;
  expiresAt: number;
}

type StoredUser = User;

const memUsers = new Map<string, StoredUser>();
const pendingCodes = new Map<string, PendingVerification>();

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashBuf = (await scryptAsync(password, salt, 64)) as Buffer;
  return { salt, hash: hashBuf.toString("hex") };
}

export async function verifyPassword(
  password: string,
  salt: string,
  hash: string,
) {
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const hashBuf = Buffer.from(hash, "hex");
  if (derived.length !== hashBuf.length) return false;
  return crypto.timingSafeEqual(derived, hashBuf);
}

function generateCode() {
  return crypto.randomInt(100000, 999999).toString();
}

function normalizeEmail(email: string) {
  return email.toLowerCase().trim();
}

async function getUserByEmail(email: string): Promise<StoredUser | undefined> {
  const key = normalizeEmail(email);
  const db = getDb();
  if (db) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, key));
    return user;
  }
  return memUsers.get(key);
}

async function upsertUnverifiedUser(data: {
  email: string;
  name: string;
  passwordHash: string;
  passwordSalt: string;
}) {
  const db = getDb();
  if (db) {
    const existing = await getUserByEmail(data.email);
    if (existing) {
      const [user] = await db
        .update(usersTable)
        .set({
          name: data.name,
          passwordHash: data.passwordHash,
          passwordSalt: data.passwordSalt,
          emailVerified: false,
        })
        .where(eq(usersTable.email, data.email))
        .returning();
      return user;
    }
    const [user] = await db
      .insert(usersTable)
      .values({
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        passwordSalt: data.passwordSalt,
        emailVerified: false,
      })
      .returning();
    return user;
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    passwordHash: data.passwordHash,
    passwordSalt: data.passwordSalt,
    emailVerified: false,
    googleId: null,
    avatarUrl: null,
    createdAt: new Date(),
  };
  memUsers.set(data.email, user);
  return user;
}

async function markEmailVerified(email: string) {
  const key = normalizeEmail(email);
  const db = getDb();
  if (db) {
    await db
      .update(usersTable)
      .set({ emailVerified: true })
      .where(eq(usersTable.email, key));
  } else {
    const user = memUsers.get(key);
    if (user) user.emailVerified = true;
  }
  return getUserByEmail(key);
}

function setPendingCode(email: string) {
  const code = generateCode();
  pendingCodes.set(email, {
    email,
    code,
    expiresAt: Date.now() + CODE_TTL_MS,
  });
  return code;
}

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  const key = normalizeEmail(email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
    return { ok: false as const, error: "Please enter a valid email address." };
  }
  if (password.length < 8) {
    return {
      ok: false as const,
      error: "Password must be at least 8 characters.",
    };
  }

  const existing = await getUserByEmail(key);
  if (existing?.emailVerified) {
    return {
      ok: false as const,
      error: "An account with this email already exists. Try signing in.",
    };
  }

  const { salt, hash } = await hashPassword(password);
  const displayName = name.trim() || key.split("@")[0];

  await upsertUnverifiedUser({
    email: key,
    name: displayName,
    passwordHash: hash,
    passwordSalt: salt,
  });

  const code = setPendingCode(key);

  return { ok: true as const, email: key, code };
}

export async function verifyEmailCode(email: string, code: string) {
  const key = normalizeEmail(email);
  const pending = pendingCodes.get(key);

  if (!pending) {
    const existing = await getUserByEmail(key);
    if (existing?.emailVerified) {
      return {
        ok: true as const,
        email: key,
        name: existing.name || key.split("@")[0],
        isNewUser: false,
      };
    }
    return {
      ok: false as const,
      error: "No pending verification. Please request a new code.",
    };
  }

  if (Date.now() > pending.expiresAt) {
    pendingCodes.delete(key);
    return {
      ok: false as const,
      error: "This code has expired. Please request a new one.",
    };
  }

  if (pending.code !== code.trim()) {
    return { ok: false as const, error: "Invalid verification code." };
  }

  pendingCodes.delete(key);

  const existing = await getUserByEmail(key);
  const isNewUser = !existing?.emailVerified;

  await markEmailVerified(key);
  const user = await getUserByEmail(key);

  return {
    ok: true as const,
    email: key,
    name: user?.name || key.split("@")[0],
    isNewUser,
  };
}

export async function loginUser(email: string, password: string) {
  const key = normalizeEmail(email);
  const user = await getUserByEmail(key);

  if (!user?.passwordHash || !user.passwordSalt) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  const valid = await verifyPassword(
    password,
    user.passwordSalt,
    user.passwordHash,
  );
  if (!valid) {
    return { ok: false as const, error: "Invalid email or password." };
  }

  if (!user.emailVerified) {
    const code = setPendingCode(key);
    return {
      ok: false as const,
      error: "Please verify your email before signing in.",
      needsVerification: true as const,
      email: key,
      code,
    };
  }

  return {
    ok: true as const,
    email: key,
    name: user.name || key.split("@")[0],
  };
}

export async function resendVerificationCode(email: string) {
  const key = normalizeEmail(email);
  const user = await getUserByEmail(key);

  if (!user) {
    return {
      ok: false as const,
      error: "No account found. Please create an account first.",
    };
  }
  if (user.emailVerified) {
    return { ok: false as const, error: "This email is already verified." };
  }

  const code = setPendingCode(key);
  return { ok: true as const, email: key, code };
}
