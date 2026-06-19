import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type CommunityPost } from "@shared/schema";
import { ChevronLeft } from "lucide-react";

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

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CommunityPostDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: post, isLoading, isError } = useQuery<CommunityPost>({
    queryKey: ["/api/community-posts", id],
    queryFn: async () => {
      const res = await fetch(`/api/community-posts/${id}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
  });

  const STANDALONE_BG = "linear-gradient(145deg, #c8f5ea 0%, #dcd8f9 50%, #fde4d8 100%)";

  return (
    <div
      className="min-h-[100dvh] overflow-hidden flex items-start justify-center bg-gray-100"
    >
      <div
        className="relative w-full max-w-[430px] h-[100dvh] flex flex-col overflow-y-auto overflow-x-hidden shadow-2xl"
        style={{ background: STANDALONE_BG }}
      >
        {/* Header */}
        <div className="px-5 pt-10 pb-4 flex items-center gap-3">
          <button
            data-testid="button-back"
            onClick={() => navigate("/community")}
            className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <p className="text-sm font-semibold text-gray-700">Community</p>
        </div>

        {/* Content */}
        <div className="px-5 pb-10 flex-1">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="h-16 rounded-2xl bg-white/50 animate-pulse" />
              <div className="h-40 rounded-2xl bg-white/50 animate-pulse" />
            </div>
          ) : isError || !post ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-testid="post-not-found"
            >
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-bold text-gray-800 mb-2">Post not found</p>
              <p className="text-sm text-slate-600 mb-6">
                This post may have been removed or the link is invalid.
              </p>
              <button
                data-testid="button-back-not-found"
                onClick={() => navigate("/community")}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)" }}
              >
                Back to Community
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Post card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                {/* Author row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm"
                      style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
                      data-testid="author-avatar"
                    >
                      {post.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900" data-testid="author-name">
                        @{post.username}
                      </p>
                      <p className="text-xs text-slate-500" data-testid="post-date">
                        {formatDate(post.createdAt)} · {timeAgo(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full"
                    data-testid="post-community"
                  >
                    {post.community}
                  </span>
                </div>

                {/* Body */}
                <p
                  className="text-base text-gray-800 leading-relaxed mb-4"
                  data-testid="post-body"
                >
                  {post.body}
                </p>

                {/* Tag + counts row */}
                <div className="flex items-center justify-between mt-1">
                  <div>
                    {post.tag && (
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          TAG_COLORS[post.tag] ?? "bg-gray-100 text-gray-600"
                        }`}
                        data-testid="post-tag"
                      >
                        {post.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex items-center gap-1 text-xs font-semibold text-rose-500"
                      data-testid="post-likes-count"
                    >
                      ❤️ {post.likesCount}
                    </span>
                    <span
                      className="flex items-center gap-1 text-xs font-semibold text-violet-500"
                      data-testid="post-saves-count"
                    >
                      🔖 {post.savesCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments placeholder */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <p className="text-sm font-bold text-gray-800 mb-1">💬 Comments</p>
                <p className="text-xs text-slate-500">Comments coming soon — stay tuned!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
