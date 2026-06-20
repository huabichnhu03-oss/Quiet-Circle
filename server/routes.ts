import type { Express } from "express";
import type { Response } from "express";
import { createServer, type Server } from "http";
import { clerkClient, getAuth } from "@clerk/express";
import { storage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertContactSchema,
  insertCommunityPostSchema,
  updateMoodEntrySchema,
  updateJournalEntrySchema,
  updateContactSchema,
  updateCommunityPostSchema,
  updateCommunityPostReactionSchema,
} from "@shared/schema";
import { updateUserProfileSchema } from "@shared/profile-data";
import { getClerkStatus, requireApiAuth } from "./clerk-auth";
import { formatDbError } from "./db-errors";
import { ensureDemoContacts, ensureDemoCommunityPosts, shouldSeedDemoContacts, shouldSeedDemoCommunityPosts } from "./demo-data";
import { isReactionOnlyPatch, requireOwner } from "./ownership";
import { z } from "zod";

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

async function getCommunityUsername(userId: string): Promise<string> {
  const clerkUser = await clerkClient.users.getUser(userId);
  if (clerkUser.username) return clerkUser.username;
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (email) return email.split("@")[0] ?? "member";
  const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join("");
  if (name) return name.toLowerCase().replace(/\s+/g, "_");
  return "member";
}

type SignalRole = "sender" | "companion";
type LiveSignalLocation = {
  lat: number;
  lng: number;
  accuracy: number | null;
  updatedAt: string;
};
type LiveSignalSession = {
  ownerUserId: string;
  contactId: string;
  locations: Map<SignalRole, LiveSignalLocation>;
  listeners: Set<Response>;
};

const liveSignalSessions = new Map<string, LiveSignalSession>();
const liveLocationSchema = z.object({
  role: z.enum(["sender", "companion"]),
  lat: z.number().finite(),
  lng: z.number().finite(),
  accuracy: z.number().finite().nullable().optional(),
});

function signalSessionKey(ownerUserId: string, contactId: string): string {
  return `${ownerUserId}:${contactId}`;
}

function ensureLiveSignalSession(ownerUserId: string, contactId: string): LiveSignalSession {
  const key = signalSessionKey(ownerUserId, contactId);
  const existing = liveSignalSessions.get(key);
  if (existing) return existing;
  const created: LiveSignalSession = {
    ownerUserId,
    contactId,
    locations: new Map(),
    listeners: new Set(),
  };
  liveSignalSessions.set(key, created);
  return created;
}

function sessionPayload(session: LiveSignalSession) {
  return {
    contactId: session.contactId,
    sender: session.locations.get("sender") ?? null,
    companion: session.locations.get("companion") ?? null,
  };
}

function writeSse(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function broadcastSessionUpdate(session: LiveSignalSession) {
  const payload = sessionPayload(session);
  for (const listener of session.listeners) {
    writeSse(listener, "update", payload);
  }
}

export function registerRoutes(
  httpServer: Server,
  app: Express
): Server {
  app.get("/api/health/clerk", (_req, res) => {
    res.json(getClerkStatus());
  });

  app.get("/api/mood-entries", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const entries = await storage.getMoodEntries(userId!);
    res.json(entries);
  });

  app.post("/api/mood-entries", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const parsed = insertMoodEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.createMoodEntry(userId!, parsed.data);
    res.status(201).json(entry);
  });

  app.get("/api/mood-entries/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const entry = await storage.getMoodEntry(id);
    if (!requireOwner(entry, userId!, res)) return;
    res.json(entry);
  });

  app.patch("/api/mood-entries/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const parsed = updateMoodEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.updateMoodEntry(id, userId!, parsed.data);
    if (!entry) return res.status(404).json({ error: "Mood entry not found" });
    res.json(entry);
  });

  app.delete("/api/mood-entries/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const deleted = await storage.deleteMoodEntry(id, userId!);
    if (!deleted) return res.status(404).json({ error: "Mood entry not found" });
    res.status(204).send();
  });

  app.get("/api/journal-entries", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const entries = await storage.getJournalEntries(userId!);
    res.json(entries);
  });

  app.post("/api/journal-entries", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const parsed = insertJournalEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.createJournalEntry(userId!, parsed.data);
    res.status(201).json(entry);
  });

  app.get("/api/journal-entries/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const entry = await storage.getJournalEntry(id);
    if (!requireOwner(entry, userId!, res)) return;
    res.json(entry);
  });

  app.patch("/api/journal-entries/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const parsed = updateJournalEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const entry = await storage.updateJournalEntry(id, userId!, parsed.data);
    if (!entry) return res.status(404).json({ error: "Journal entry not found" });
    res.json(entry);
  });

  app.delete("/api/journal-entries/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const deleted = await storage.deleteJournalEntry(id, userId!);
    if (!deleted) return res.status(404).json({ error: "Journal entry not found" });
    res.status(204).send();
  });

  app.get("/api/contacts", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    if (shouldSeedDemoContacts()) {
      await ensureDemoContacts(storage, userId!);
    }
    const contacts = await storage.getContacts(userId!);
    res.json(contacts);
  });

  app.post("/api/contacts", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    try {
      const parsed = insertContactSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const contact = await storage.createContact(userId!, parsed.data);
      res.status(201).json(contact);
    } catch (err) {
      console.error("[POST /api/contacts]", err);
      res.status(500).json({ error: formatDbError(err) });
    }
  });

  app.get("/api/contacts/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const contact = await storage.getContact(id);
    if (!requireOwner(contact, userId!, res)) return;
    res.json(contact);
  });

  app.patch("/api/contacts/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const parsed = updateContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const contact = await storage.updateContact(id, userId!, parsed.data);
    if (!contact) return res.status(404).json({ error: "Contact not found" });
    res.json(contact);
  });

  app.delete("/api/contacts/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const deleted = await storage.deleteContact(id, userId!);
    if (!deleted) return res.status(404).json({ error: "Contact not found" });
    res.status(204).send();
  });

  app.get("/api/profile", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const profile = await storage.getUserProfile(userId!);
    res.json(profile);
  });

  app.patch("/api/profile", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const parsed = updateUserProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const profile = await storage.updateUserProfile(userId!, parsed.data);
    res.json(profile);
  });

  app.get("/api/community-posts", async (_req, res) => {
    if (shouldSeedDemoCommunityPosts()) {
      await ensureDemoCommunityPosts(storage);
    }
    const posts = await storage.getCommunityPosts();
    res.json(posts);
  });

  app.get("/api/community-posts/:id", async (req, res) => {
    const id = routeParam(req.params.id);
    const post = await storage.getCommunityPost(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  app.post("/api/community-posts", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const parsed = insertCommunityPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const username = await getCommunityUsername(userId!);
    const post = await storage.createCommunityPost(userId!, username, parsed.data);
    res.status(201).json(post);
  });

  app.patch("/api/community-posts/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const body = req.body as Record<string, unknown>;

    if (isReactionOnlyPatch(body)) {
      const parsed = updateCommunityPostReactionSchema.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
      }
      const post = await storage.updateCommunityPost(id, parsed.data);
      if (!post) return res.status(404).json({ error: "Post not found" });
      return res.json(post);
    }

    const parsed = updateCommunityPostSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const existing = await storage.getCommunityPost(id);
    if (!requireOwner(existing, userId!, res)) return;
    const post = await storage.updateCommunityPost(id, parsed.data);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  });

  app.delete("/api/community-posts/:id", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const id = routeParam(req.params.id);
    const deleted = await storage.deleteCommunityPost(id, userId!);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.status(204).send();
  });

  app.get("/api/live-signal/:contactId", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const contactId = routeParam(req.params.contactId);
    const session = liveSignalSessions.get(signalSessionKey(userId!, contactId));
    if (!session) {
      return res.json({
        contactId,
        sender: null,
        companion: null,
      });
    }
    res.json(sessionPayload(session));
  });

  app.post("/api/live-signal/:contactId/location", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const contactId = routeParam(req.params.contactId);
    const parsed = liveLocationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const session = ensureLiveSignalSession(userId!, contactId);
    session.locations.set(parsed.data.role, {
      lat: parsed.data.lat,
      lng: parsed.data.lng,
      accuracy: parsed.data.accuracy ?? null,
      updatedAt: new Date().toISOString(),
    });
    broadcastSessionUpdate(session);
    res.status(204).send();
  });

  app.get("/api/live-signal/:contactId/stream", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const contactId = routeParam(req.params.contactId);
    const session = ensureLiveSignalSession(userId!, contactId);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    session.listeners.add(res);
    writeSse(res, "update", sessionPayload(session));

    const heartbeat = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      session.listeners.delete(res);
      if (session.listeners.size === 0 && session.locations.size === 0) {
        liveSignalSessions.delete(signalSessionKey(userId!, contactId));
      }
    });
  });

  app.delete("/api/live-signal/:contactId", requireApiAuth, async (req, res) => {
    const { userId } = getAuth(req);
    const contactId = routeParam(req.params.contactId);
    const key = signalSessionKey(userId!, contactId);
    const session = liveSignalSessions.get(key);
    if (session) {
      for (const listener of session.listeners) {
        writeSse(listener, "ended", { contactId });
      }
      liveSignalSessions.delete(key);
    }
    res.status(204).send();
  });

  return httpServer;
}
