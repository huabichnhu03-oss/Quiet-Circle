import type { CommunityPost, Contact, InsertCommunityPost, InsertContact } from "@shared/schema";
import { DEMO_CLERK_ID } from "@shared/constants";

type ContactStorage = {
  getContacts(clerkId: string): Promise<Contact[]>;
  createContact(clerkId: string, contact: InsertContact): Promise<Contact>;
};

export const DEMO_CONTACT_SEEDS: InsertContact[] = [
  {
    firstName: "Nathan",
    lastName: "Richards",
    phone: "+1 (705) 555-0142",
    email: "nathan.demo@quietcircle.app",
    relationship: "Friend",
    isPrimary: true,
  },
  {
    firstName: "Nhu",
    lastName: "Hua",
    phone: "+1 (416) 555-0198",
    email: "nhu.demo@quietcircle.app",
    relationship: "Friend",
    isPrimary: false,
  },
  {
    firstName: "Alex",
    lastName: "Rivera",
    phone: "+1 (647) 555-0133",
    email: "alex.demo@quietcircle.app",
    relationship: "Partner",
    isPrimary: false,
  },
];

export const DEMO_CONTACT_IDS = [
  "demo-nathan-richards",
  "demo-nhu-hua",
  "demo-alex-rivera",
] as const;

export function buildMemDemoContacts(clerkId: string): Contact[] {
  const now = new Date();
  return DEMO_CONTACT_SEEDS.map((seed, index) => ({
    ...seed,
    clerkId,
    id: DEMO_CONTACT_IDS[index],
    email: seed.email ?? null,
    isPrimary: seed.isPrimary ?? false,
    imageUrl: null,
    createdAt: now,
  }));
}

export async function ensureDemoContacts(storage: ContactStorage, clerkId: string): Promise<void> {
  const existing = await storage.getContacts(clerkId);
  if (existing.length > 0) return;

  for (const seed of DEMO_CONTACT_SEEDS) {
    await storage.createContact(clerkId, seed);
  }
}

export function shouldSeedDemoContacts(): boolean {
  return process.env.NODE_ENV !== "production";
}

type CommunityPostSeed = {
  id: string;
  hoursAgo: number;
  username: string;
  community: string;
  body: string;
  tag?: string | null;
  likesCount: number;
  savesCount: number;
};

export const DEMO_COMMUNITY_POST_IDS = [
  "demo-post-alex-appointment",
  "demo-post-toronto-pride",
  "demo-post-river-coming-out",
  "demo-post-sunflower-hrt",
  "demo-post-jamie-mindfulness",
  "demo-post-sage-workplace",
] as const;

const DEMO_COMMUNITY_POST_SEEDS: CommunityPostSeed[] = [
  {
    id: DEMO_COMMUNITY_POST_IDS[0],
    username: "alex_t",
    community: "Trans Experiences",
    body: "Just had my first appointment with a gender-affirming doctor and it went so well. Feeling hopeful.",
    tag: "Milestone",
    likesCount: 24,
    savesCount: 8,
    hoursAgo: 1,
  },
  {
    id: DEMO_COMMUNITY_POST_IDS[1],
    username: "torontoqueers",
    community: "Toronto",
    body: "Anyone going to the Pride parade this Saturday? Looking for people to meet up with before the march!",
    tag: "Events",
    likesCount: 17,
    savesCount: 5,
    hoursAgo: 2,
  },
  {
    id: DEMO_COMMUNITY_POST_IDS[2],
    username: "river_m",
    community: "AskLGBT",
    body: "How do you handle coming out to extended family? I'm struggling with whether to say anything at the next reunion.",
    tag: "Advice",
    likesCount: 31,
    savesCount: 12,
    hoursAgo: 4,
  },
  {
    id: DEMO_COMMUNITY_POST_IDS[3],
    username: "sunflower_z",
    community: "Trans Experiences",
    body: "Six months on HRT today. The changes are subtle but I feel so much more like myself. Sending love to everyone on their own journey.",
    tag: "Support",
    likesCount: 48,
    savesCount: 19,
    hoursAgo: 8,
  },
  {
    id: DEMO_COMMUNITY_POST_IDS[4],
    username: "jamie_calm",
    community: "Mindfulness",
    body: "Tried the 4-7-8 breathing exercise before bed last night and actually slept through for the first time in weeks. Small win!",
    tag: "Discussion",
    likesCount: 15,
    savesCount: 22,
    hoursAgo: 12,
  },
  {
    id: DEMO_COMMUNITY_POST_IDS[5],
    username: "sage_w",
    community: "Workplace Wellness",
    body: "My manager used my correct pronouns in a team email without making it a thing. I didn't realize how much that would mean to me.",
    tag: "Milestone",
    likesCount: 56,
    savesCount: 11,
    hoursAgo: 26,
  },
];

type CommunityPostStorage = {
  getCommunityPosts(): Promise<CommunityPost[]>;
  seedDemoCommunityPosts(posts: CommunityPost[]): Promise<void>;
};

export function buildMemDemoCommunityPosts(): CommunityPost[] {
  const now = Date.now();
  return DEMO_COMMUNITY_POST_SEEDS.map(({ id, hoursAgo, username, ...seed }) => ({
    ...seed,
    username,
    clerkId: DEMO_CLERK_ID,
    id,
    tag: seed.tag ?? null,
    likesCount: seed.likesCount,
    savesCount: seed.savesCount,
    createdAt: new Date(now - hoursAgo * 3600000),
  }));
}

export async function ensureDemoCommunityPosts(storage: CommunityPostStorage): Promise<void> {
  const existing = await storage.getCommunityPosts();
  if (existing.length > 0) return;

  await storage.seedDemoCommunityPosts(buildMemDemoCommunityPosts());
}

export function shouldSeedDemoCommunityPosts(): boolean {
  return process.env.NODE_ENV !== "production";
}
