import type { Express } from "express";
import { createServer, type Server } from "http";
import { clerkClient, getAuth } from "@clerk/express";
import { storage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertContactSchema,
  insertCommunityPostSchema,
} from "@shared/schema";
import { getClerkStatus, requireApiAuth } from "./clerk-auth";

export function registerRoutes(
  httpServer: Server,
  app: Express
): Server {
  app.get("/api/health/clerk", (_req, res) => {
    res.json(getClerkStatus());
  });

  app.get("/api/auth/me", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const clerkUser = await clerkClient.users.getUser(userId!);
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? null;
    const name =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
      email?.split("@")[0] ||
      null;

    res.json({
      userId,
      email,
      name,
      imageUrl: clerkUser.imageUrl,
    });
  });

  app.get("/api/mood-entries", requireApiAuth, async (_req, res) => {
    const entries = await storage.getMoodEntries();
    res.json(entries);
  });

  app.post("/api/mood-entries", requireApiAuth, async (req, res) => {
    const parsed = insertMoodEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.createMoodEntry(parsed.data);
    res.status(201).json(entry);
  });

  app.get("/api/journal-entries", requireApiAuth, async (_req, res) => {
    const entries = await storage.getJournalEntries();
    res.json(entries);
  });

  app.post("/api/journal-entries", requireApiAuth, async (req, res) => {
    const parsed = insertJournalEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.createJournalEntry(parsed.data);
    res.status(201).json(entry);
  });

  app.get("/api/contacts", requireApiAuth, async (_req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/contacts", requireApiAuth, async (req, res) => {
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

  app.post("/api/community-posts", requireApiAuth, async (req, res) => {
    const parsed = insertCommunityPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const post = await storage.createCommunityPost(parsed.data);
    res.status(201).json(post);
  });

  return httpServer;
}
