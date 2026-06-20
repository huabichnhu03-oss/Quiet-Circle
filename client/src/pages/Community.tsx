import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type CommunityPost } from "@shared/schema";
import { IconBookmark, IconHeart, IconMessageCircle, IconPlus, IconSearch } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";

const COMMUNITIES = ["All", "Trans Experiences", "Toronto", "AskLGBT"];

const DISCOVERABLE_COMMUNITIES = [
  "Queer Youth",
  "Mindfulness",
  "Recovery",
  "Creative Healing",
  "Parent Support",
  "Workplace Wellness",
];

const TAG_COLORS: Record<string, string> = {
  Milestone: "bg-emerald-100 text-emerald-700",
  Events: "app-tag",
  Advice: "bg-amber-100 text-amber-700",
  Support: "bg-pink-100 text-pink-700",
  Discussion: "bg-blue-100 text-blue-700",
};

function timeAgo(date: string | Date) {
  const diff = Date.now() - new Date(date).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ago`;
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

export default function Community() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);
  const { toast } = useToast();
  const { profile, updateProfile } = useUserProfile();

  const { data: posts = [], isLoading } = useQuery<CommunityPost[]>({
    queryKey: ["/api/community-posts"],
  });

  const filtered = posts.filter((p) => {
    const matchTab = activeTab === "All" || p.community === activeTab;
    const matchSearch =
      !search ||
      p.body.toLowerCase().includes(search.toLowerCase()) ||
      p.username.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow="Connect"
        title="My Communities"
        action={
          <Link href="/community/new">
            <button
              data-testid="button-create-post"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-transform btn-gradient flex-shrink-0"
            >
              <IconPlus size={14} />
              Create Post
            </button>
          </Link>
        }
      />

      <div className="px-4 sm:px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 app-scrollbar-x">
          {COMMUNITIES.map((c) => (
            <button
              key={c}
              data-testid={`tab-${c.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveTab(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === c ? "pill-active" : "pill-inactive"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            type="button"
            data-testid="tab-browse"
            onClick={() => setBrowseOpen(true)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold app-tag border border-[var(--app-border)]"
          >
            + Browse
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-5 mb-4">
        <div className="flex items-center gap-2 app-input rounded-2xl px-4 py-3">
          <IconSearch size={16} />
          <input
            data-testid="input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 text-sm bg-transparent outline-none min-w-0"
          />
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-6 flex flex-col gap-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl app-card-muted animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-posts">
            <div className="flex justify-center mb-3">
              <IconMessageCircle size={36} color="var(--app-muted)" />
            </div>
            <p className="text-sm text-[var(--app-muted)] font-medium">No posts yet.</p>
            <p className="text-xs text-[var(--app-muted)] mt-1">
              Be the first to share something!
            </p>
          </div>
        ) : (
          filtered.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
              <div
                data-testid={`post-${post.id}`}
                className="app-card rounded-2xl shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center justify-between mb-2 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 btn-gradient"
                    >
                      {post.username[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--app-text)] truncate">
                        @{post.username}
                      </p>
                      <p className="text-[10px] text-[var(--app-muted)]">
                        {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold app-tag px-2 py-0.5 rounded-full flex-shrink-0">
                    {post.community}
                  </span>
                </div>
                <p className="text-sm text-[var(--app-text)] leading-relaxed mb-2">
                  {post.body}
                </p>
                {post.tag ? (
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      TAG_COLORS[post.tag] ?? "app-card-muted text-[var(--app-muted)]"
                    }`}
                  >
                    {post.tag}
                  </span>
                ) : null}
                <div className="flex items-center gap-3 mt-2 text-[10px] font-semibold text-[var(--app-muted)]">
                  <span className="flex items-center gap-1">
                    <IconHeart size={12} color="#f43f5e" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconBookmark size={12} color="var(--app-accent)" />
                    {post.savesCount}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      <Dialog open={browseOpen} onOpenChange={setBrowseOpen}>
        <DialogContent className="app-card border-[var(--app-border)] max-w-[calc(100%-2rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--app-text)]">Browse Communities</DialogTitle>
            <DialogDescription className="text-[var(--app-muted)]">
              Discover groups that match what you&apos;re going through.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-1">
            {DISCOVERABLE_COMMUNITIES.map((community) => (
              <button
                key={community}
                type="button"
                data-testid={`browse-${community.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={async () => {
                  setActiveTab(community);
                  setBrowseOpen(false);
                  const joined = profile.joinedCommunities.includes(community)
                    ? profile.joinedCommunities
                    : [...profile.joinedCommunities, community];
                  await updateProfile({ joinedCommunities: joined });
                  toast({
                    title: `Joined ${community}`,
                    description: "Posts from this community will appear in your feed.",
                  });
                }}
                className="w-full text-left px-4 py-3 rounded-xl app-card-muted text-sm font-semibold text-[var(--app-text)] active:scale-[0.98] transition-transform"
              >
                {community}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
