export type DemoComment = {
  username: string;
  body: string;
  hoursAgo: number;
};

export const DEMO_COMMENTS_BY_USERNAME: Record<string, DemoComment[]> = {
  alex_t: [
    {
      username: "sunflower_z",
      body: "So happy for you! That first appointment is a big step.",
      hoursAgo: 0.5,
    },
    {
      username: "river_m",
      body: "Which clinic did you go to? I've been looking for recommendations in the area.",
      hoursAgo: 0.75,
    },
  ],
  torontoqueers: [
    {
      username: "jamie_calm",
      body: "I'll be there! DM me if you want to meet near Church St before noon.",
      hoursAgo: 1,
    },
  ],
  river_m: [
    {
      username: "sage_w",
      body: "You don't owe anyone your story. It's okay to wait until you feel safe.",
      hoursAgo: 2,
    },
    {
      username: "alex_t",
      body: "I wrote a letter instead of saying it in person — helped me get the words right.",
      hoursAgo: 3,
    },
    {
      username: "nhu_h",
      body: "Sending you strength. Whatever you decide is valid.",
      hoursAgo: 3.5,
    },
  ],
  sunflower_z: [
    {
      username: "alex_t",
      body: "Six months!! That's amazing — proud of you.",
      hoursAgo: 6,
    },
  ],
  jamie_calm: [
    {
      username: "nhu_h",
      body: "The 4-7-8 thing works for me too. Glad you got some rest!",
      hoursAgo: 10,
    },
  ],
  sage_w: [
    {
      username: "river_m",
      body: "Those small affirmations at work hit different. Happy for you!",
      hoursAgo: 20,
    },
    {
      username: "torontoqueers",
      body: "Managers like that make all the difference.",
      hoursAgo: 22,
    },
  ],
};

export function commentTimeAgo(hoursAgo: number) {
  if (hoursAgo >= 24) return `${Math.floor(hoursAgo / 24)}d ago`;
  if (hoursAgo >= 1) return `${Math.floor(hoursAgo)}h ago`;
  return `${Math.max(1, Math.floor(hoursAgo * 60))}m ago`;
}
