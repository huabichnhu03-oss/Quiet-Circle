import { z } from "zod";

export const resourceItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  tag: z.string(),
  href: z.string(),
});

export const hotlineItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  number: z.string(),
  available: z.string(),
  accent: z.string(),
  href: z.string(),
  action: z.enum(["call", "text"]),
});

export const userProfileDataSchema = z.object({
  tags: z.array(z.string()),
  sleepHours: z.number(),
  sleepMinutes: z.number(),
  bpmAvg: z.number(),
  dreamSleepPct: z.number(),
  deepSleepPct: z.number(),
  activityValue: z.string(),
  bodyValue: z.string(),
  heartValue: z.string(),
  homeTagline: z.string(),
  dailyInsight: z.string(),
  onboardingTopics: z.array(z.string()),
  onboardingMood: z.number().nullable(),
  joinedCommunities: z.array(z.string()),
  resources: z.array(resourceItemSchema),
  hotlines: z.array(hotlineItemSchema),
});

export type ResourceItem = z.infer<typeof resourceItemSchema>;
export type HotlineItem = z.infer<typeof hotlineItemSchema>;
export type UserProfileData = z.infer<typeof userProfileDataSchema>;

export const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: "coming-out",
    title: "Coming Out",
    description: "A brief beginner's guide",
    tag: "LGBTQ+ Resources",
    href: "/community",
  },
  {
    id: "breathing",
    title: "4-7-8 Breathing",
    description: "Self-care tools and grounding",
    tag: "Self-Care",
    href: "/breathe",
  },
];

export const DEFAULT_HOTLINES: HotlineItem[] = [
  {
    id: "trans-lifeline",
    name: "Trans Lifeline",
    description: "Peer support run by and for trans people",
    number: "877-565-8860",
    available: "24/7",
    accent: "var(--app-accent)",
    href: "tel:8775658860",
    action: "call",
  },
  {
    id: "crisis-text",
    name: "Crisis Text Line",
    description: "Text HOME to start a conversation",
    number: "741741",
    available: "Text anytime",
    accent: "#db2777",
    href: "sms:741741&body=HOME",
    action: "text",
  },
  {
    id: "trevor",
    name: "Trevor Project",
    description: "Crisis intervention for LGBTQ+ youth",
    number: "1-866-488-7386",
    available: "24/7",
    accent: "#d97706",
    href: "tel:18664887386",
    action: "call",
  },
  {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    description: "Call or text for immediate support",
    number: "988",
    available: "24/7",
    accent: "#059669",
    href: "tel:988",
    action: "call",
  },
  {
    id: "pflag",
    name: "PFLAG Canada",
    description: "Local support for LGBTQ+ people and families",
    number: "1-888-530-6777",
    available: "Mon–Fri 9am–5pm EST",
    accent: "var(--app-primary)",
    href: "tel:18885306777",
    action: "call",
  },
];

export const DEFAULT_PROFILE: UserProfileData = {
  tags: ["Designer", "Illustrator", "Model"],
  sleepHours: 7,
  sleepMinutes: 39,
  bpmAvg: 85.4,
  dreamSleepPct: 54,
  deepSleepPct: 73,
  activityValue: "+3.9 Points",
  bodyValue: "78.9% mscl",
  heartValue: "83.8 bpm",
  homeTagline: "Take a breath. You're doing better than you think.",
  dailyInsight:
    "Tracking your mood consistently is the first step to understanding yourself better. You're doing great!",
  onboardingTopics: [],
  onboardingMood: null,
  joinedCommunities: [],
  resources: DEFAULT_RESOURCES,
  hotlines: DEFAULT_HOTLINES,
};

export function mergeProfileData(partial?: Partial<UserProfileData> | null): UserProfileData {
  if (!partial) return { ...DEFAULT_PROFILE };
  return userProfileDataSchema.parse({
    ...DEFAULT_PROFILE,
    ...partial,
    resources: partial.resources ?? DEFAULT_PROFILE.resources,
    hotlines: partial.hotlines ?? DEFAULT_PROFILE.hotlines,
  });
}

export const updateUserProfileSchema = userProfileDataSchema.partial();
