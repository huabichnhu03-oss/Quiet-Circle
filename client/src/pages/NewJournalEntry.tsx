import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { IconArrowLeft } from "@/components/Icons";

const moodOptions = [
  { id: "great", label: "Great", emoji: "😄" },
  { id: "good", label: "Good", emoji: "😊" },
  { id: "okay", label: "Okay", emoji: "😐" },
  { id: "not_great", label: "Not Great", emoji: "😕" },
  { id: "bad", label: "Bad", emoji: "😔" },
];

const FORMAT_FONTS = ["Default", "Serif", "Mono"];
const FORMAT_STYLES = ["B", "I", "U"];
const FORMAT_ALIGNS = ["≡", "≡", "≡"];
const FORMAT_COLORS = ["#1f2937", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

export default function NewJournalEntry() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("good");
  const [activeFont, setActiveFont] = useState(0);
  const [activeStyle, setActiveStyle] = useState<number[]>([]);
  const [activeAlign, setActiveAlign] = useState(0);
  const [activeColor, setActiveColor] = useState(0);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const saveMutation = useMutation({
    mutationFn: (publish: boolean) =>
      apiRequest("POST", "/api/journal-entries", { title, content, mood }),
    onSuccess: (_, publish) => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({
        title: publish ? "Entry published! 📓" : "Draft saved! ✏️",
        description: "Your thoughts are safe here.",
      });
      setLocation("/journals");
    },
  });

  return (
    <div className="flex flex-col min-h-full pb-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-5 mb-4">
        <button
          data-testid="button-back"
          onClick={() => setLocation("/journals")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white border border-slate-300"
        >
          <IconArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-slate-900">New Entry</h1>
      </div>

      {/* Date */}
      <div className="px-5 mb-3">
        <p className="text-xs text-slate-600 font-medium">{today}</p>
      </div>

      {/* Mood selector */}
      <div className="px-5 mb-4">
        <p className="text-xs font-semibold text-slate-600 mb-2">How are you feeling?</p>
        <div className="flex gap-2 flex-wrap">
          {moodOptions.map((m) => (
            <button
              key={m.id}
              data-testid={`mood-${m.id}`}
              onClick={() => setMood(m.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                mood === m.id
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white text-gray-700 border-slate-300"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="px-5 mb-3">
        <input
          data-testid="input-journal-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="w-full text-xl font-bold text-slate-900 bg-white rounded-xl border border-slate-300 px-4 py-2 outline-none placeholder-gray-400"
        />
      </div>

      {/* Body */}
      <div className="px-5 flex-1 mb-4">
        <textarea
          data-testid="input-journal-body"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write freely. This is just for you..."
          className="w-full min-h-[200px] text-sm text-slate-900 bg-white rounded-2xl border border-slate-300 p-4 outline-none resize-none placeholder-gray-400 leading-relaxed"
        />
      </div>

      {/* Formatting toolbar */}
      <div className="px-5 mb-5">
        <div className="bg-white rounded-2xl border border-slate-300 p-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Font */}
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
            {FORMAT_FONTS.map((f, i) => (
              <button
                key={f}
                data-testid={`fmt-font-${i}`}
                onClick={() => setActiveFont(i)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  activeFont === i ? "bg-gray-900 text-white" : "text-slate-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          {/* Style */}
          {FORMAT_STYLES.map((s, i) => (
            <button
              key={s + i}
              data-testid={`fmt-style-${i}`}
              onClick={() =>
                setActiveStyle((prev) =>
                  prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                )
              }
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                activeStyle.includes(i) ? "bg-gray-900 text-white" : "text-slate-600"
              } ${i === 0 ? "font-black" : i === 1 ? "italic" : "underline"}`}
            >
              {s}
            </button>
          ))}
          {/* Align */}
          <div className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-1">
            {["Left", "Center", "Right"].map((a, i) => (
              <button
                key={a}
                data-testid={`fmt-align-${i}`}
                onClick={() => setActiveAlign(i)}
                className={`w-7 h-7 rounded-lg text-xs flex-shrink-0 transition-all ${
                  activeAlign === i ? "bg-gray-900 text-white" : "text-slate-600"
                }`}
              >
                {FORMAT_ALIGNS[i]}
              </button>
            ))}
          </div>
          {/* Color */}
          <div className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-1">
            {FORMAT_COLORS.map((c, i) => (
              <button
                key={c}
                data-testid={`fmt-color-${i}`}
                onClick={() => setActiveColor(i)}
                className={`w-5 h-5 rounded-full flex-shrink-0 transition-all ${
                  activeColor === i ? "ring-2 ring-offset-1 ring-gray-400" : ""
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 flex gap-2">
        <button
          data-testid="button-discard"
          onClick={() => setLocation("/journals")}
          className="flex-1 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-600 bg-white active:scale-95 transition-transform"
        >
          Discard
        </button>
        <button
          data-testid="button-save-draft"
          onClick={() => saveMutation.mutate(false)}
          disabled={!title || !content || saveMutation.isPending}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-violet-600 bg-violet-50 border border-violet-200 disabled:opacity-50 active:scale-95 transition-transform"
        >
          Save
        </button>
        <button
          data-testid="button-publish-journal"
          onClick={() => saveMutation.mutate(true)}
          disabled={!title || !content || saveMutation.isPending}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white shadow-md disabled:opacity-50 active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)" }}
        >
          {saveMutation.isPending ? "Saving..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
