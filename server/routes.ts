import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertContactSchema,
  insertCommunityPostSchema,
} from "@shared/schema";
import { createMagicLinkToken, consumeMagicLinkToken } from "./auth";
import { getAppUrl, sendMagicLinkEmail } from "./email";

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

  // Auth: send a magic sign-in link via Resend
  app.post("/api/auth/magic-link", async (req, res) => {
    const { email, name } = req.body;
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required." });
    }

    const key = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const token = createMagicLinkToken(
      key,
      typeof name === "string" ? name : undefined,
    );
    const appUrl = getAppUrl(req);
    const link = `${appUrl}/auth/verify?token=${token}`;

    try {
      await sendMagicLinkEmail(key, link, req);
      res.json({ ok: true, message: "Check your email for a sign-in link." });
    } catch (err) {
      console.error("Failed to send magic link:", err);
      res.status(500).json({ error: "Could not send email. Please try again." });
    }
  });

  // Auth: verify magic link token (used by /auth/verify page)
  app.get("/api/auth/verify", (req, res) => {
    const token = req.query.token;
    if (!token || typeof token !== "string") {
      return res.status(400).json({ ok: false, error: "Missing sign-in token." });
    }

    const result = consumeMagicLinkToken(token);
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

  return httpServer;
}
