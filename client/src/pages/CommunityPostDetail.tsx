import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/react";
import { type CommunityPost } from "@shared/schema";
import { ChevronLeft } from "lucide-react";
import { IconBookmark, IconHeart, IconMessageCircle, IconSearch } from "@/components/Icons";
import { PhoneShell } from "@/components/PhoneShell";
import { ItemActions } from "@/components/ItemActions";
import { apiRequest } from "@/lib/queryClient";
import { DEMO_COMMENTS_BY_USERNAME, commentTimeAgo } from "@/lib/demo-community";
import { useToast } from "@/hooks/use-toast";

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
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: post, isLoading, isError } = useQuery<CommunityPost>({
    queryKey: ["/api/community-posts", id],
    queryFn: async () => {
      const res = await fetch(`/api/community-posts/${id}`);
      if (!res.ok) throw new Error("Post not found");
      return res.json();
    },
  });

  const reactionMutation = useMutation({
    mutationFn: async ({
      likesCount,
      savesCount,
    }: {
      likesCount: number;
      savesCount: number;
    }) => {
      const res = await apiRequest("PATCH", `/api/community-posts/${id}`, {
        likesCount,
        savesCount,
      });
      return res.json() as Promise<CommunityPost>;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["/api/community-posts", id], updated);
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
    onError: () => {
      toast({
        title: "Couldn't update post",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const toggleLike = () => {
    if (!post || reactionMutation.isPending) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    reactionMutation.mutate({
      likesCount: Math.max(0, post.likesCount + (nextLiked ? 1 : -1)),
      savesCount: post.savesCount,
    });
  };

  const toggleSave = () => {
    if (!post || reactionMutation.isPending) return;
    const nextSaved = !saved;
    setSaved(nextSaved);
    reactionMutation.mutate({
      likesCount: post.likesCount,
      savesCount: Math.max(0, post.savesCount + (nextSaved ? 1 : -1)),
    });
    if (nextSaved) {
      toast({ title: "Post saved", description: "Find it in your saved posts later." });
    }
  };

  const comments = post ? (DEMO_COMMENTS_BY_USERNAME[post.username] ?? []) : [];
  const isOwner = Boolean(post && user?.id && post.clerkId === user.id);

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", `/api/community-posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      toast({ title: "Post deleted" });
      navigate("/community");
    },
    onError: () => {
      toast({
        title: "Couldn't delete post",
        variant: "destructive",
      });
    },
  });

  return (
    <PhoneShell scrollable>
      <div
        className="px-4 sm:px-5 pt-8 pb-4 flex items-center gap-3 flex-shrink-0"
        style={{ paddingTop: "calc(2rem + var(--app-safe-top))" }}
      >
        <button
          data-testid="button-back"
          onClick={() => navigate("/community")}
          className="w-9 h-9 rounded-full app-card flex items-center justify-center shadow-sm active:scale-95 transition-transform text-[var(--app-text)]"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="text-sm font-semibold text-[var(--app-text)]">Community</p>
      </div>

      <div className="px-4 sm:px-5 pb-10 flex-1">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <div className="h-16 rounded-2xl app-card-muted animate-pulse" />
            <div className="h-40 rounded-2xl app-card-muted animate-pulse" />
          </div>
        ) : isError || !post ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-testid="post-not-found"
          >
            <div className="w-14 h-14 rounded-full app-card-muted flex items-center justify-center mb-4">
              <IconSearch size={28} color="var(--app-muted)" />
            </div>
            <p className="text-lg font-bold text-[var(--app-text)] mb-2">Post not found</p>
            <p className="text-sm text-[var(--app-muted)] mb-6">
              This post may have been removed or the link is invalid.
            </p>
            <button
              data-testid="button-back-not-found"
              onClick={() => navigate("/community")}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-transform btn-gradient"
            >
              Back to Community
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="app-card rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm flex-shrink-0 btn-gradient"
                    data-testid="author-avatar"
                  >
                    {post.username[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--app-text)] truncate" data-testid="author-name">
                      @{post.username}
                    </p>
                    <p className="text-xs text-[var(--app-muted)]" data-testid="post-date">
                      {formatDate(post.createdAt)} · {timeAgo(post.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[11px] font-semibold app-tag px-2.5 py-1 rounded-full flex-shrink-0"
                  data-testid="post-community"
                >
                  {post.community}
                </span>
                {isOwner ? (
                  <ItemActions
                    onEdit={() => navigate(`/community/${id}/edit`)}
                    onDelete={() => deleteMutation.mutate()}
                  />
                ) : null}
              </div>

              <p
                className="text-base text-[var(--app-text)] leading-relaxed mb-4"
                data-testid="post-body"
              >
                {post.body}
              </p>

              <div className="flex items-center justify-between mt-1 gap-2">
                <div>
                  {post.tag ? (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                        TAG_COLORS[post.tag] ?? "app-card-muted text-[var(--app-muted)]"
                      }`}
                      data-testid="post-tag"
                    >
                      {post.tag}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="flex items-center gap-1 text-xs font-semibold text-rose-500"
                    data-testid="post-likes-count"
                  >
                    <IconHeart size={14} color="#f43f5e" filled={liked} />
                    {post.likesCount}
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs font-semibold text-[var(--app-accent)]"
                    data-testid="post-saves-count"
                  >
                    <IconBookmark size={14} color="var(--app-accent)" filled={saved} />
                    {post.savesCount}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  data-testid="button-like"
                  onClick={toggleLike}
                  disabled={reactionMutation.isPending}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    liked
                      ? "bg-rose-100 text-rose-600"
                      : "app-card-muted text-[var(--app-text)]"
                  }`}
                >
                  <IconHeart size={16} color={liked ? "#e11d48" : "var(--app-text)"} filled={liked} />
                  {liked ? "Liked" : "Like"}
                </button>
                <button
                  type="button"
                  data-testid="button-save"
                  onClick={toggleSave}
                  disabled={reactionMutation.isPending}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                    saved
                      ? "bg-violet-100 text-violet-700"
                      : "app-card-muted text-[var(--app-text)]"
                  }`}
                >
                  <IconBookmark size={16} color={saved ? "#7c3aed" : "var(--app-text)"} filled={saved} />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            <div className="app-card rounded-2xl shadow-sm p-5">
              <p className="text-sm font-bold text-[var(--app-text)] mb-3 flex items-center gap-2">
                <IconMessageCircle size={16} color="var(--app-text)" />
                Comments {comments.length > 0 ? `(${comments.length})` : ""}
              </p>
              {comments.length === 0 ? (
                <p className="text-xs text-[var(--app-muted)]">
                  No comments yet — be the first to reply!
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  {comments.map((comment) => (
                    <div
                      key={`${comment.username}-${comment.body.slice(0, 20)}`}
                      className="flex gap-3"
                      data-testid={`comment-${comment.username}`}
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 btn-gradient">
                        {comment.username[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1 app-card-muted rounded-xl px-3 py-2.5">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <p className="text-xs font-bold text-[var(--app-text)] truncate">
                            @{comment.username}
                          </p>
                          <p className="text-[10px] text-[var(--app-muted)] flex-shrink-0">
                            {commentTimeAgo(comment.hoursAgo)}
                          </p>
                        </div>
                        <p className="text-sm text-[var(--app-text)] leading-relaxed">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-[var(--app-border)]">
                <div className="flex gap-2">
                  <input
                    data-testid="input-comment"
                    placeholder="Write a reply..."
                    className="flex-1 app-input rounded-xl px-3 py-2.5 text-sm outline-none min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        toast({
                          title: "Comments coming soon",
                          description: "Replies will be available in a future update.",
                        });
                      }
                    }}
                  />
                  <button
                    type="button"
                    data-testid="button-send-comment"
                    onClick={() =>
                      toast({
                        title: "Comments coming soon",
                        description: "Replies will be available in a future update.",
                      })
                    }
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white btn-gradient active:scale-95 transition-transform"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PhoneShell>
  );
}
