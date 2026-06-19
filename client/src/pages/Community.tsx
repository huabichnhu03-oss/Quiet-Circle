import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type CommunityPost } from "@shared/schema";
import { IconSearch, IconPlus } from "@/components/Icons";

const COMMUNITIES = ["All", "Trans Experiences", "Toronto", "AskLGBT"];

const TAG_COLORS: Record<string, string> = {
  Milestone: "bg-emerald-100 text-emerald-700",
  Events: "bg-violet-100 text-violet-700",
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
      {/* Header */}
      <div className="px-5 pt-10 pb-4">
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1">Connect</p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Communities</h1>
          <Link href="/community/new">
            <button
              data-testid="button-create-post"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)" }}
            >
              <IconPlus size={14} />
              Create Post
            </button>
          </Link>
        </div>
      </div>

      {/* Community pills */}
      <div className="px-5 mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {COMMUNITIES.map((c) => (
            <button
              key={c}
              data-testid={`tab-${c.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveTab(c)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeTab === c
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-slate-300"
              }`}
            >
              {c}
            </button>
          ))}
          <button
            data-testid="tab-browse"
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-violet-600 border border-violet-200"
          >
            + Browse
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 border border-slate-300">
          <IconSearch size={16} />
          <input
            data-testid="input-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Feed */}
      <div className="px-5 pb-6 flex flex-col gap-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/50 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-posts">
            <p className="text-3xl mb-3">💬</p>
            <p className="text-sm text-slate-600 font-medium">No posts yet.</p>
            <p className="text-xs text-slate-600 mt-1">Be the first to share something!</p>
          </div>
        ) : (
          filtered.map((post) => (
            <Link key={post.id} href={`/community/${post.id}`}>
            <div
              data-testid={`post-${post.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
                  >
                    {post.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">@{post.username}</p>
                    <p className="text-[10px] text-slate-600">{timeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
                  {post.community}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-2">{post.body}</p>
              {post.tag && (
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    TAG_COLORS[post.tag] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {post.tag}
                </span>
              )}
            </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
