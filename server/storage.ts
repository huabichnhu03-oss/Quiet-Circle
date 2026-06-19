import {
  type User, type InsertUser,
  type MoodEntry, type InsertMoodEntry,
  type JournalEntry, type InsertJournalEntry,
  type Contact, type InsertContact,
  type CommunityPost, type InsertCommunityPost,
} from "@shared/schema";
import { randomUUID } from "crypto";

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
  private moodEntries: Map<string, MoodEntry>;
  private journalEntries: Map<string, JournalEntry>;
  private contacts: Map<string, Contact>;
  private communityPosts: Map<string, CommunityPost>;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.journalEntries = new Map();
    this.contacts = new Map();
    this.communityPosts = new Map();

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
    seeds.forEach((p) => this.communityPosts.set(p.id, p));
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
      passwordHash: insertUser.passwordHash ?? null,
      passwordSalt: insertUser.passwordSalt ?? null,
      googleId: insertUser.googleId ?? null,
      avatarUrl: insertUser.avatarUrl ?? null,
    };
    this.users.set(id, user);
    return user;
  }

  async getMoodEntries(): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const moodEntry: MoodEntry = { ...entry, id, createdAt: new Date(), note: entry.note ?? null };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const journalEntry: JournalEntry = { ...entry, id, createdAt: new Date(), mood: entry.mood ?? null };
    this.journalEntries.set(id, journalEntry);
    return journalEntry;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)
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
    this.contacts.set(id, c);
    return c;
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPosts.get(id);
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPosts.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
    this.communityPosts.set(id, p);
    return p;
  }
}

export const storage = new MemStorage();
