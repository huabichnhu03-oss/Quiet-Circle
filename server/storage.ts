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
  type UpdateMoodEntry,
  type UpdateJournalEntry,
  type UpdateContact,
  type UpdateCommunityPost,
  type UpdateCommunityPostReaction,
  type UserProfile,
  users,
  moodEntries,
  journalEntries,
  contacts,
  communityPosts,
  userProfiles,
} from "@shared/schema";
import { mergeProfileData, type UserProfileData } from "@shared/profile-data";
import { randomUUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { getDb, hasDatabase } from "./db";
import { formatDbError, isDbConnectionError } from "./db-errors";
import { buildMemDemoCommunityPosts } from "./demo-data";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMoodEntries(clerkId: string): Promise<MoodEntry[]>;
  getMoodEntry(id: string): Promise<MoodEntry | undefined>;
  createMoodEntry(clerkId: string, entry: InsertMoodEntry): Promise<MoodEntry>;
  updateMoodEntry(id: string, clerkId: string, entry: UpdateMoodEntry): Promise<MoodEntry | undefined>;
  deleteMoodEntry(id: string, clerkId: string): Promise<boolean>;
  getJournalEntries(clerkId: string): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  createJournalEntry(clerkId: string, entry: InsertJournalEntry): Promise<JournalEntry>;
  updateJournalEntry(id: string, clerkId: string, entry: UpdateJournalEntry): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: string, clerkId: string): Promise<boolean>;
  getContacts(clerkId: string): Promise<Contact[]>;
  getContact(id: string): Promise<Contact | undefined>;
  createContact(clerkId: string, contact: InsertContact): Promise<Contact>;
  updateContact(id: string, clerkId: string, contact: UpdateContact): Promise<Contact | undefined>;
  deleteContact(id: string, clerkId: string): Promise<boolean>;
  getCommunityPosts(): Promise<CommunityPost[]>;
  getCommunityPost(id: string): Promise<CommunityPost | undefined>;
  createCommunityPost(clerkId: string, username: string, post: InsertCommunityPost): Promise<CommunityPost>;
  updateCommunityPost(id: string, post: UpdateCommunityPost | UpdateCommunityPostReaction): Promise<CommunityPost | undefined>;
  deleteCommunityPost(id: string, clerkId: string): Promise<boolean>;
  seedDemoCommunityPosts(posts: CommunityPost[]): Promise<void>;
  getUserProfile(clerkId: string): Promise<UserProfileData>;
  updateUserProfile(clerkId: string, data: Partial<UserProfileData>): Promise<UserProfileData>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moodEntriesMap: Map<string, MoodEntry>;
  private journalEntriesMap: Map<string, JournalEntry>;
  private contactsMap: Map<string, Contact>;
  private communityPostsMap: Map<string, CommunityPost>;
  private userProfilesMap: Map<string, UserProfileData>;

  constructor() {
    this.users = new Map();
    this.moodEntriesMap = new Map();
    this.journalEntriesMap = new Map();
    this.contactsMap = new Map();
    this.communityPostsMap = new Map();
    this.userProfilesMap = new Map();

    this._seedCommunityPosts();
  }

  private _seedCommunityPosts() {
    for (const post of buildMemDemoCommunityPosts()) {
      this.communityPostsMap.set(post.id, post);
    }
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

  async getMoodEntries(clerkId: string): Promise<MoodEntry[]> {
    return Array.from(this.moodEntriesMap.values())
      .filter((entry) => entry.clerkId === clerkId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async getMoodEntry(id: string): Promise<MoodEntry | undefined> {
    return this.moodEntriesMap.get(id);
  }

  async createMoodEntry(clerkId: string, entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const moodEntry: MoodEntry = {
      ...entry,
      clerkId,
      id,
      createdAt: new Date(),
      note: entry.note ?? null,
    };
    this.moodEntriesMap.set(id, moodEntry);
    return moodEntry;
  }

  async updateMoodEntry(id: string, clerkId: string, entry: UpdateMoodEntry): Promise<MoodEntry | undefined> {
    const existing = this.moodEntriesMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return undefined;
    const updated = { ...existing, ...entry };
    this.moodEntriesMap.set(id, updated);
    return updated;
  }

  async deleteMoodEntry(id: string, clerkId: string): Promise<boolean> {
    const existing = this.moodEntriesMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return false;
    return this.moodEntriesMap.delete(id);
  }

  async getJournalEntries(clerkId: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntriesMap.values())
      .filter((entry) => entry.clerkId === clerkId)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntriesMap.get(id);
  }

  async createJournalEntry(clerkId: string, entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const journalEntry: JournalEntry = {
      ...entry,
      clerkId,
      id,
      createdAt: new Date(),
      mood: entry.mood ?? null,
    };
    this.journalEntriesMap.set(id, journalEntry);
    return journalEntry;
  }

  async updateJournalEntry(id: string, clerkId: string, entry: UpdateJournalEntry): Promise<JournalEntry | undefined> {
    const existing = this.journalEntriesMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return undefined;
    const updated = { ...existing, ...entry };
    this.journalEntriesMap.set(id, updated);
    return updated;
  }

  async deleteJournalEntry(id: string, clerkId: string): Promise<boolean> {
    const existing = this.journalEntriesMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return false;
    return this.journalEntriesMap.delete(id);
  }

  async getContacts(clerkId: string): Promise<Contact[]> {
    return Array.from(this.contactsMap.values())
      .filter((contact) => contact.clerkId === clerkId)
      .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contactsMap.get(id);
  }

  async createContact(clerkId: string, contact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const c: Contact = {
      ...contact,
      clerkId,
      id,
      createdAt: new Date(),
      email: contact.email ?? null,
      imageUrl: contact.imageUrl ?? null,
      isPrimary: contact.isPrimary ?? false,
    };
    this.contactsMap.set(id, c);
    return c;
  }

  async updateContact(id: string, clerkId: string, contact: UpdateContact): Promise<Contact | undefined> {
    const existing = this.contactsMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return undefined;
    const updated = { ...existing, ...contact };
    this.contactsMap.set(id, updated);
    return updated;
  }

  async deleteContact(id: string, clerkId: string): Promise<boolean> {
    const existing = this.contactsMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return false;
    return this.contactsMap.delete(id);
  }

  async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    return this.communityPostsMap.get(id);
  }

  async getCommunityPosts(): Promise<CommunityPost[]> {
    return Array.from(this.communityPostsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async createCommunityPost(
    clerkId: string,
    username: string,
    post: InsertCommunityPost,
  ): Promise<CommunityPost> {
    const id = randomUUID();
    const p: CommunityPost = {
      ...post,
      clerkId,
      username,
      id,
      createdAt: new Date(),
      tag: post.tag ?? null,
      likesCount: 0,
      savesCount: 0,
    };
    this.communityPostsMap.set(id, p);
    return p;
  }

  async updateCommunityPost(
    id: string,
    post: UpdateCommunityPost | UpdateCommunityPostReaction,
  ): Promise<CommunityPost | undefined> {
    const existing = this.communityPostsMap.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...post };
    this.communityPostsMap.set(id, updated);
    return updated;
  }

  async deleteCommunityPost(id: string, clerkId: string): Promise<boolean> {
    const existing = this.communityPostsMap.get(id);
    if (!existing || existing.clerkId !== clerkId) return false;
    return this.communityPostsMap.delete(id);
  }

  async seedDemoCommunityPosts(posts: CommunityPost[]): Promise<void> {
    for (const post of posts) {
      this.communityPostsMap.set(post.id, post);
    }
  }

  async getUserProfile(clerkId: string): Promise<UserProfileData> {
    return mergeProfileData(this.userProfilesMap.get(clerkId));
  }

  async updateUserProfile(clerkId: string, data: Partial<UserProfileData>): Promise<UserProfileData> {
    const merged = mergeProfileData({ ...this.userProfilesMap.get(clerkId), ...data });
    this.userProfilesMap.set(clerkId, merged);
    return merged;
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

  async getMoodEntries(clerkId: string): Promise<MoodEntry[]> {
    return this.db()
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.clerkId, clerkId))
      .orderBy(desc(moodEntries.createdAt));
  }

  async getMoodEntry(id: string): Promise<MoodEntry | undefined> {
    const [row] = await this.db().select().from(moodEntries).where(eq(moodEntries.id, id));
    return row;
  }

  async createMoodEntry(clerkId: string, entry: InsertMoodEntry): Promise<MoodEntry> {
    const [row] = await this.db()
      .insert(moodEntries)
      .values({ ...entry, clerkId })
      .returning();
    return row;
  }

  async updateMoodEntry(id: string, clerkId: string, entry: UpdateMoodEntry): Promise<MoodEntry | undefined> {
    const [row] = await this.db()
      .update(moodEntries)
      .set(entry)
      .where(and(eq(moodEntries.id, id), eq(moodEntries.clerkId, clerkId)))
      .returning();
    return row;
  }

  async deleteMoodEntry(id: string, clerkId: string): Promise<boolean> {
    const result = await this.db()
      .delete(moodEntries)
      .where(and(eq(moodEntries.id, id), eq(moodEntries.clerkId, clerkId)))
      .returning();
    return result.length > 0;
  }

  async getJournalEntries(clerkId: string): Promise<JournalEntry[]> {
    return this.db()
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.clerkId, clerkId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    const [row] = await this.db().select().from(journalEntries).where(eq(journalEntries.id, id));
    return row;
  }

  async createJournalEntry(clerkId: string, entry: InsertJournalEntry): Promise<JournalEntry> {
    const [row] = await this.db()
      .insert(journalEntries)
      .values({ ...entry, clerkId })
      .returning();
    return row;
  }

  async updateJournalEntry(
    id: string,
    clerkId: string,
    entry: UpdateJournalEntry,
  ): Promise<JournalEntry | undefined> {
    const [row] = await this.db()
      .update(journalEntries)
      .set(entry)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.clerkId, clerkId)))
      .returning();
    return row;
  }

  async deleteJournalEntry(id: string, clerkId: string): Promise<boolean> {
    const result = await this.db()
      .delete(journalEntries)
      .where(and(eq(journalEntries.id, id), eq(journalEntries.clerkId, clerkId)))
      .returning();
    return result.length > 0;
  }

  async getContacts(clerkId: string): Promise<Contact[]> {
    return this.db()
      .select()
      .from(contacts)
      .where(eq(contacts.clerkId, clerkId))
      .orderBy(desc(contacts.isPrimary), desc(contacts.createdAt));
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const [row] = await this.db().select().from(contacts).where(eq(contacts.id, id));
    return row;
  }

  async createContact(clerkId: string, contact: InsertContact): Promise<Contact> {
    const [row] = await this.db()
      .insert(contacts)
      .values({ ...contact, clerkId })
      .returning();
    return row;
  }

  async updateContact(id: string, clerkId: string, contact: UpdateContact): Promise<Contact | undefined> {
    const [row] = await this.db()
      .update(contacts)
      .set(contact)
      .where(and(eq(contacts.id, id), eq(contacts.clerkId, clerkId)))
      .returning();
    return row;
  }

  async deleteContact(id: string, clerkId: string): Promise<boolean> {
    const result = await this.db()
      .delete(contacts)
      .where(and(eq(contacts.id, id), eq(contacts.clerkId, clerkId)))
      .returning();
    return result.length > 0;
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

  async createCommunityPost(
    clerkId: string,
    username: string,
    post: InsertCommunityPost,
  ): Promise<CommunityPost> {
    const [row] = await this.db()
      .insert(communityPosts)
      .values({
        ...post,
        clerkId,
        username,
        likesCount: 0,
        savesCount: 0,
      })
      .returning();
    return row;
  }

  async updateCommunityPost(
    id: string,
    post: UpdateCommunityPost | UpdateCommunityPostReaction,
  ): Promise<CommunityPost | undefined> {
    const [row] = await this.db()
      .update(communityPosts)
      .set(post)
      .where(eq(communityPosts.id, id))
      .returning();
    return row;
  }

  async deleteCommunityPost(id: string, clerkId: string): Promise<boolean> {
    const result = await this.db()
      .delete(communityPosts)
      .where(and(eq(communityPosts.id, id), eq(communityPosts.clerkId, clerkId)))
      .returning();
    return result.length > 0;
  }

  async seedDemoCommunityPosts(posts: CommunityPost[]): Promise<void> {
    if (posts.length === 0) return;
    await this.db().insert(communityPosts).values(posts);
  }

  async getUserProfile(clerkId: string): Promise<UserProfileData> {
    const [row] = await this.db()
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.clerkId, clerkId));
    if (!row) return mergeProfileData();
    try {
      return mergeProfileData(JSON.parse(row.data) as Partial<UserProfileData>);
    } catch {
      return mergeProfileData();
    }
  }

  async updateUserProfile(clerkId: string, data: Partial<UserProfileData>): Promise<UserProfileData> {
    const current = await this.getUserProfile(clerkId);
    const merged = mergeProfileData({ ...current, ...data });
    const payload = JSON.stringify(merged);
    const [existing] = await this.db()
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.clerkId, clerkId));

    if (existing) {
      await this.db()
        .update(userProfiles)
        .set({ data: payload, updatedAt: new Date() })
        .where(eq(userProfiles.clerkId, clerkId));
    } else {
      await this.db().insert(userProfiles).values({ clerkId, data: payload });
    }

    return merged;
  }
}

class ResilientStorage implements IStorage {
  private readonly database = new DatabaseStorage();
  private readonly memory = new MemStorage();
  private useMemory = !hasDatabase();
  private warned = false;

  private warnFallback(err: unknown) {
    if (this.warned) return;
    this.warned = true;
    console.warn(
      "[storage] DATABASE_URL is set but the database is unavailable — using in-memory storage for this session.",
      formatDbError(err),
    );
  }

  private async run<T>(
    dbOp: (store: DatabaseStorage) => Promise<T>,
    memOp: (store: MemStorage) => Promise<T>,
  ): Promise<T> {
    if (this.useMemory) return memOp(this.memory);

    try {
      return await dbOp(this.database);
    } catch (err) {
      if (isDbConnectionError(err)) {
        this.useMemory = true;
        this.warnFallback(err);
        return memOp(this.memory);
      }
      throw err;
    }
  }

  getUser(id: string) {
    return this.run((s) => s.getUser(id), (s) => s.getUser(id));
  }

  getUserByUsername(username: string) {
    return this.run((s) => s.getUserByUsername(username), (s) => s.getUserByUsername(username));
  }

  createUser(user: InsertUser) {
    return this.run((s) => s.createUser(user), (s) => s.createUser(user));
  }

  getMoodEntries(clerkId: string) {
    return this.run((s) => s.getMoodEntries(clerkId), (s) => s.getMoodEntries(clerkId));
  }

  getMoodEntry(id: string) {
    return this.run((s) => s.getMoodEntry(id), (s) => s.getMoodEntry(id));
  }

  createMoodEntry(clerkId: string, entry: InsertMoodEntry) {
    return this.run(
      (s) => s.createMoodEntry(clerkId, entry),
      (s) => s.createMoodEntry(clerkId, entry),
    );
  }

  updateMoodEntry(id: string, clerkId: string, entry: UpdateMoodEntry) {
    return this.run(
      (s) => s.updateMoodEntry(id, clerkId, entry),
      (s) => s.updateMoodEntry(id, clerkId, entry),
    );
  }

  deleteMoodEntry(id: string, clerkId: string) {
    return this.run(
      (s) => s.deleteMoodEntry(id, clerkId),
      (s) => s.deleteMoodEntry(id, clerkId),
    );
  }

  getJournalEntries(clerkId: string) {
    return this.run(
      (s) => s.getJournalEntries(clerkId),
      (s) => s.getJournalEntries(clerkId),
    );
  }

  getJournalEntry(id: string) {
    return this.run((s) => s.getJournalEntry(id), (s) => s.getJournalEntry(id));
  }

  createJournalEntry(clerkId: string, entry: InsertJournalEntry) {
    return this.run(
      (s) => s.createJournalEntry(clerkId, entry),
      (s) => s.createJournalEntry(clerkId, entry),
    );
  }

  updateJournalEntry(id: string, clerkId: string, entry: UpdateJournalEntry) {
    return this.run(
      (s) => s.updateJournalEntry(id, clerkId, entry),
      (s) => s.updateJournalEntry(id, clerkId, entry),
    );
  }

  deleteJournalEntry(id: string, clerkId: string) {
    return this.run(
      (s) => s.deleteJournalEntry(id, clerkId),
      (s) => s.deleteJournalEntry(id, clerkId),
    );
  }

  getContacts(clerkId: string) {
    return this.run((s) => s.getContacts(clerkId), (s) => s.getContacts(clerkId));
  }

  getContact(id: string) {
    return this.run((s) => s.getContact(id), (s) => s.getContact(id));
  }

  createContact(clerkId: string, contact: InsertContact) {
    return this.run(
      (s) => s.createContact(clerkId, contact),
      (s) => s.createContact(clerkId, contact),
    );
  }

  updateContact(id: string, clerkId: string, contact: UpdateContact) {
    return this.run(
      (s) => s.updateContact(id, clerkId, contact),
      (s) => s.updateContact(id, clerkId, contact),
    );
  }

  deleteContact(id: string, clerkId: string) {
    return this.run(
      (s) => s.deleteContact(id, clerkId),
      (s) => s.deleteContact(id, clerkId),
    );
  }

  getCommunityPost(id: string) {
    return this.run((s) => s.getCommunityPost(id), (s) => s.getCommunityPost(id));
  }

  getCommunityPosts() {
    return this.run((s) => s.getCommunityPosts(), (s) => s.getCommunityPosts());
  }

  createCommunityPost(clerkId: string, username: string, post: InsertCommunityPost) {
    return this.run(
      (s) => s.createCommunityPost(clerkId, username, post),
      (s) => s.createCommunityPost(clerkId, username, post),
    );
  }

  updateCommunityPost(id: string, post: UpdateCommunityPost | UpdateCommunityPostReaction) {
    return this.run(
      (s) => s.updateCommunityPost(id, post),
      (s) => s.updateCommunityPost(id, post),
    );
  }

  deleteCommunityPost(id: string, clerkId: string) {
    return this.run(
      (s) => s.deleteCommunityPost(id, clerkId),
      (s) => s.deleteCommunityPost(id, clerkId),
    );
  }

  seedDemoCommunityPosts(posts: CommunityPost[]) {
    return this.run(
      (s) => s.seedDemoCommunityPosts(posts),
      (s) => s.seedDemoCommunityPosts(posts),
    );
  }

  getUserProfile(clerkId: string) {
    return this.run((s) => s.getUserProfile(clerkId), (s) => s.getUserProfile(clerkId));
  }

  updateUserProfile(clerkId: string, data: Partial<UserProfileData>) {
    return this.run(
      (s) => s.updateUserProfile(clerkId, data),
      (s) => s.updateUserProfile(clerkId, data),
    );
  }
}

export const storage: IStorage = new ResilientStorage();
