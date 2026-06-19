import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type JournalEntry } from "@shared/schema";
import { IconPen, IconChevronRight } from "@/components/Icons";
import { IllustrationJournal } from "@/components/Illustrations";

const moodColor: Record<string, { bg: string; dot: string }> = {
  great: { bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
  good: { bg: "rgba(139,92,246,0.12)", dot: "#8b5cf6" },
  okay: { bg: "rgba(251,191,36,0.12)", dot: "#f59e0b" },
  not_great: { bg: "rgba(251,146,60,0.12)", dot: "#f97316" },
  bad: { bg: "rgba(239,68,68,0.12)", dot: "#ef4444" },
};

export default function Journals() {
  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal-entries"],
  });

  return (
    <div className="flex flex-col">
      {/* Header gradient */}
      <div
        className="px-6 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, rgba(255,255,255,0) 100%)" }}
      >
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Your space</p>
        <div className="flex items-center gap-3 mb-1">
          <IllustrationJournal size={44} />
          <h1
            className="text-[26px] font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "'Khand', sans-serif" }}
          >
            Journals
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">Write freely. This is just for you.</p>
      </div>

      <div className="px-5 -mt-4">
        {/* New entry button */}
        <Link href="/journals/new">
          <button
            data-testid="button-new-journal"
            className="w-full bg-violet-600 text-white rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold shadow-md shadow-violet-200 active:scale-95 transition-transform mb-5"
          >
            <IconPen size={16} />
            New Entry
          </button>
        </Link>

        {/* Entries list */}
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-gray-50 animate-pulse" />
            ))
          ) : entries.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-journals">
              <div className="flex justify-center mb-3">
                <IllustrationJournal size={56} />
              </div>
              <p className="text-sm text-slate-600 font-medium">No journal entries yet.</p>
              <p className="text-xs text-slate-600 mt-1">Start writing to capture your thoughts.</p>
            </div>
          ) : (
            entries.map((entry) => {
              const style = moodColor[entry.mood ?? ""] ?? { bg: "rgba(139,92,246,0.08)", dot: "#8b5cf6" };
              return (
                <div
                  key={entry.id}
                  data-testid={`journal-entry-${entry.id}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: style.bg }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: style.dot }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-gray-800 truncate leading-tight">{entry.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-0.5">{entry.content}</p>
                    <p className="text-[10px] text-slate-600 mt-2">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <IconChevronRight size={16} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
