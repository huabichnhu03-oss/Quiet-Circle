import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft } from "@/components/Icons";

const COMMUNITIES = ["Trans Experiences", "Toronto", "AskLGBT", "General"];
const TAGS = ["Milestone", "Events", "Advice", "Support", "Discussion"];

export default function NewPost() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [community, setCommunity] = useState(COMMUNITIES[0]);
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      apiRequest("POST", "/api/community-posts", {
        username: "you",
        community,
        body,
        tag: tag || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
      toast({ title: "Post published! 🎉", description: "Your community can see it now." });
      setLocation("/community");
    },
  });

  return (
    <div className="flex flex-col min-h-full px-5 pt-5 pb-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 mb-6">
        <button
          data-testid="button-back"
          onClick={() => setLocation("/community")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white border border-slate-300"
        >
          <IconArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">Create Post</h1>
      </div>

      {/* Community selector */}
      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2 block">
          Community
        </label>
        <div className="flex gap-2 flex-wrap">
          {COMMUNITIES.map((c) => (
            <button
              key={c}
              data-testid={`community-${c.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setCommunity(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                community === c
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-700 border border-slate-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Post body */}
      <div className="mb-5 flex-1">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2 block">
          What's on your mind?
        </label>
        <textarea
          data-testid="input-post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share something with your community..."
          rows={8}
          className="w-full bg-white rounded-2xl border border-slate-300 p-4 text-sm text-slate-900 outline-none resize-none placeholder-gray-400 leading-relaxed"
        />
      </div>

      {/* Tag */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-2 block">
          Tag (optional)
        </label>
        <div className="flex gap-2 flex-wrap">
          {TAGS.map((t) => (
            <button
              key={t}
              data-testid={`tag-${t.toLowerCase()}`}
              onClick={() => setTag(tag === t ? "" : t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                tag === t
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-slate-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Publish button */}
      <button
        data-testid="button-publish"
        onClick={() => mutation.mutate()}
        disabled={!body.trim() || mutation.isPending}
        className="w-full py-4 rounded-2xl text-white font-bold text-sm shadow-md active:scale-95 transition-transform disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)" }}
      >
        {mutation.isPending ? "Publishing..." : "Publish Post"}
      </button>
    </div>
  );
}
