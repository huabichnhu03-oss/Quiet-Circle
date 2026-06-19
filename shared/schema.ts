import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"),
  passwordSalt: text("password_salt"),
  googleId: text("google_id").unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  mood: text("mood"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  relationship: text("relationship").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull(),
  community: text("community").notNull(),
  body: text("body").notNull(),
  tag: text("tag"),
  likesCount: integer("likes_count").default(0).notNull(),
  savesCount: integer("saves_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
