import {
  type User,
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type Contact,
  type InsertContact,
  type CommunityPost,
  type InsertCommunityPost,
  users,
  moodEntries,
  journalEntries,
  contacts,
  communityPosts,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "./db";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMoodEntries(): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getJournalEntries(): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moodEntriesMap: Map<string, MoodEntry>;
  private journalEntriesMap: Map<string, JournalEntry>;
  private contactsMap: Map<string, Contact>;
  private communityPostsMap: Map<string, CommunityPost>;

  constructor() {
    this.users = new Map();
    this.moodEntriesMap = new Map();
    this.journalEntriesMap = new Map();
    this.contactsMap = new Map();
    this.communityPostsMap = new Map();

    this._seedCommunityPosts();
  }

  private _seedCommunityPosts() {
    const seeds: CommunityPost[] = [
      {
        id: randomUUID(),
        username: "alex_t",
        community: "Trans Experiences",
        body: "Just had my first appointment with a gender-affirming doctor and it went so well. Feeling hopeful 🌈",
        tag: "Milestone",
        likesCount: 24,
        savesCount: 8,
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        id: randomUUID(),
        username: "torontoqueers",
        community: "Toronto",
        body: "Anyone going to the Pride parade this Saturday? Looking for people to meet up with!",
        tag: "Events",
        likesCount: 17,
        savesCount: 5,
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        id: randomUUID(),
        username: "river_m",
        community: "AskLGBT",
        body: "How do you handle coming out to extended family? I'm struggling with whether to say anything at the next reunion.",
        tag: "Advice",
        likesCount: 31,
        savesCount: 12,
        createdAt: new Date(Date.now() - 14400000),
      },
      {
        id: randomUUID(),
        username: "sunflower_z",
        community: "Trans Experiences",
        body: "Six months on HRT today 🌸 The changes are subtle but I feel so much more like myself. Sending love to everyone on their own journey.",
        tag: "Support",
        likesCount: 48,
        savesCount: 19,
        createdAt: new Date(Date.now() - 28800000),
      },
    ];
    seeds.forEach((p) => this.communityPostsMap.set(p.id, p));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      name: insertUser.name ?? null,
      clerkId: insertUser.clerkId ?? null,
      passwordHash: insertUser.passwordHash ?? null,
      passwordSalt: insertUser.passwordSalt ?? null,
      emailVerified: insertUser.emailVerified ?? false,
      googleId: insertUser.googleId ?? null,
      avatarUrl: insertUser.avatarUrl ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    return Array.from(this.moodEntriesMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const moodEntry: MoodEntry = {
      ...entry,
      id,
      createdAt: new Date(),
      note: entry.note ?? null,
    };
    this.moodEntriesMap.set(id, moodEntry);
    return moodEntry;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.journalEntriesMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const journalEntry: JournalEntry = {
      ...entry,
      id,
      createdAt: new Date(),
      mood: entry.mood ?? null,
    };
    this.journalEntriesMap.set(id, journalEntry);
    return journalEntry;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contactsMap.values()).sort(
      (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0),
    );
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const c: Contact = {
      ...contact,
      id,
      createdAt: new Date(),
      email: contact.email ?? null,
      imageUrl: contact.imageUrl ?? null,
      isPrimary: contact.isPrimary ?? false,
    };
    this.contactsMap.set(id, c);
    return c;
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPostsMap.get(id);
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPostsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const id = randomUUID();
    const p: CommunityPost = {
      ...post,
      id,
      createdAt: new Date(),
      tag: post.tag ?? null,
      likesCount: post.likesCount ?? 0,
      savesCount: post.savesCount ?? 0,
    };
    this.communityPostsMap.set(id, p);
    return p;
  }
}

export class DatabaseStorage implements IStorage {
  private db() {
    const db = getDb();
    if (!db) throw new Error("DATABASE_URL is not configured");
    return db;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db().select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db()
      .select()
      .from(users)
      .where(eq(users.email, username.toLowerCase().trim()));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db().insert(users).values(insertUser).returning();
    return user;
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    return this.db()
      .select()
      .from(moodEntries)
      .orderBy(desc(moodEntries.createdAt));
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [row] = await this.db().insert(moodEntries).values(entry).returning();
    return row;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return this.db()
      .select()
      .from(journalEntries)
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [row] = await this.db().insert(journalEntries).values(entry).returning();
    return row;
  }

  async getContacts(): Promise<Contact[]> {
    return this.db()
      .select()
      .from(contacts)
      .orderBy(desc(contacts.isPrimary), desc(contacts.createdAt));
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [row] = await this.db().insert(contacts).values(contact).returning();
    return row;
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    const [post] = await this.db()
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, id));
    return post;
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return this.db()
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.createdAt));
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [row] = await this.db().insert(communityPosts).values(post).returning();
    return row;
  }
}

export const storage: IStorage = hasDatabase()
  ? new DatabaseStorage()
  : new MemStorage();
