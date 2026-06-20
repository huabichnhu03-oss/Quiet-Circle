import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertContactSchema,
  insertCommunityPostSchema,
} from "@shared/schema";
import {
  registerUser,
  loginUser,
  verifyEmailCode,
  resendVerificationCode,
} from "./auth";
import {
  getResendStatus,
  sendTestEmail,
  sendVerificationCodeEmail,
} from "./email";

export function registerRoutes(
  httpServer: Server,
  app: Express
): Server {
  app.get("/api/mood-entries", async (_req, res) => {
    const entries = await storage.getMoodEntries();
    res.json(entries);
  });

  app.post("/api/mood-entries", async (req, res) => {
    const parsed = insertMoodEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.createMoodEntry(parsed.data);
    res.status(201).json(entry);
  });

  app.get("/api/journal-entries", async (_req, res) => {
    const entries = await storage.getJournalEntries();
    res.json(entries);
  });

  app.post("/api/journal-entries", async (req, res) => {
    const parsed = insertJournalEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.createJournalEntry(parsed.data);
    res.status(201).json(entry);
  });

  app.get("/api/contacts", async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/contacts", async (req, res) => {
    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const contact = await storage.createContact(parsed.data);
    res.status(201).json(contact);
  });

  app.get("/api/community-posts", async (_req, res) => {
    const posts = await storage.getCommunityPosts();
    res.json(posts);
  });

  app.get("/api/community-posts/:id", async (req, res) => {
    const post = await storage.getCommunityPost(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  app.post("/api/community-posts", async (req, res) => {
    const parsed = insertCommunityPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const post = await storage.createCommunityPost(parsed.data);
    res.status(201).json(post);
  });

  app.get("/api/health/resend", (_req, res) => {
    res.json(getResendStatus());
  });

  // Dev helper: POST { "to": "you@example.com" } — only when RESEND_API_KEY is set
  app.post("/api/health/resend/test", async (req, res) => {
    if (process.env.NODE_ENV === "production" && !process.env.ALLOW_RESEND_TEST) {
      return res.status(404).json({ error: "Not found." });
    }

    const { to } = req.body;
    if (!to || typeof to !== "string") {
      return res.status(400).json({ error: '"to" email address is required.' });
    }

    const result = await sendTestEmail(to.trim());
    if (!result.ok) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ ok: true, id: result.id, message: `Test email sent to ${to.trim()}.` });
  });

  // Auth: create account (password + email verification code)
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required." });
    }

    const result = await registerUser(
      email,
      password,
      typeof name === "string" ? name : "",
    );
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    const sent = await sendVerificationCodeEmail(result.email, result.code);
    if (!sent.ok) {
      return res.status(500).json({ error: "Could not send verification email." });
    }

    res.json({
      ok: true,
      email: result.email,
      message: "Check your email for a 6-digit verification code.",
    });
  });

  // Auth: verify email with 6-digit code
  app.post("/api/auth/verify-email", async (req, res) => {
    const { email, code } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Verification code is required." });
    }

    const result = await verifyEmailCode(email, code);
    if (!result.ok) {
      return res.status(400).json({ ok: false, error: result.error });
    }

    res.json({
      ok: true,
      email: result.email,
      name: result.name,
      isNewUser: result.isNewUser,
    });
  });

  // Auth: resend verification code
  app.post("/api/auth/resend-code", async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }

    const result = await resendVerificationCode(email);
    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    const sent = await sendVerificationCodeEmail(result.email, result.code);
    if (!sent.ok) {
      return res.status(500).json({ error: "Could not send verification email." });
    }

    res.json({ ok: true, message: "A new code has been sent to your email." });
  });

  // Auth: sign in with email + password
  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required." });
    }

    const result = await loginUser(email, password);
    if (!result.ok) {
      if ("needsVerification" in result && result.needsVerification) {
        const sent = await sendVerificationCodeEmail(result.email, result.code);
        if (!sent.ok) {
          return res.status(500).json({ error: "Could not send verification email." });
        }
        return res.status(403).json({
          error: result.error,
          needsVerification: true,
          email: result.email,
        });
      }
      return res.status(401).json({ error: result.error });
    }

    res.json({
      ok: true,
      email: result.email,
      name: result.name,
    });
  });

  return httpServer;
}
