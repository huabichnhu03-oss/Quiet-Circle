import { useQuery } from "@tanstack/react-query";
import { type MoodEntry } from "@shared/schema";
import { IllustrationMilestone } from "@/components/Illustrations";

const moodLabel: Record<string, string> = {
  great: "Great", good: "Good", okay: "Okay", not_great: "Not Great", bad: "Bad",
};

const moodStyle: Record<string, { bg: string; text: string; dot: string }> = {
  great: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "#10b981" },
  good: { bg: "bg-violet-50", text: "text-violet-700", dot: "#8b5cf6" },
  okay: { bg: "bg-amber-50", text: "text-amber-700", dot: "#f59e0b" },
  not_great: { bg: "bg-orange-50", text: "text-orange-700", dot: "#f97316" },
  bad: { bg: "bg-rose-50", text: "text-rose-700", dot: "#ef4444" },
};

function groupByDate(entries: MoodEntry[]) {
  const groups: Record<string, MoodEntry[]> = {};
  entries.forEach((e) => {
    const day = new Date(e.createdAt).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
    if (!groups[day]) groups[day] = [];
    groups[day].push(e);
  });
  return groups;
}

function MoodDot({ mood }: { mood: string }) {
  const dot = moodStyle[mood]?.dot ?? "#9ca3af";
  return (
    <div
      className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={dot} opacity="0.2" />
        <circle cx="12" cy="12" r="6" fill={dot} opacity="0.5" />
        <circle cx="12" cy="12" r="3" fill={dot} />
      </svg>
    </div>
  );
}

export default function Entries() {
  const { data: entries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
  });

  const grouped = groupByDate(entries);

  return (
    <div className="flex flex-col">
      <div
        className="px-6 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #fff 100%)" }}
      >
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">History</p>
        <div className="flex items-center gap-3 mb-1">
          <IllustrationMilestone size={44} />
          <h1
            className="text-[26px] font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "'Khand', sans-serif" }}
          >
            Mood Entries
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          {entries.length} check-in{entries.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      <div className="px-5 -mt-4">
        {isLoading ? (
          <div className="space-y-3 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-entries">
            <div className="flex justify-center mb-3">
              <IllustrationMilestone size={56} />
            </div>
            <p className="text-sm text-slate-600 font-medium">No mood entries yet.</p>
            <p className="text-xs text-slate-600 mt-1">Go to Home to log your first mood!</p>
          </div>
        ) : (
          <div className="space-y-6 mt-2">
            {Object.entries(grouped).map(([day, dayEntries]) => (
              <div key={day} data-testid={`entry-group-${day}`}>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 px-1">{day}</p>
                <div className="space-y-2">
                  {dayEntries.map((entry) => {
                    const style = moodStyle[entry.mood] ?? { bg: "bg-gray-50", text: "text-gray-700", dot: "#9ca3af" };
                    return (
                      <div
                        key={entry.id}
                        data-testid={`mood-entry-${entry.id}`}
                        className={`rounded-2xl p-4 flex items-center gap-4 ${style.bg} border border-white`}
                      >
                        <MoodDot mood={entry.mood} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-[15px] font-bold ${style.text}`}>
                              {moodLabel[entry.mood] ?? entry.mood}
                            </p>
                            <p className="text-[10px] text-slate-600 flex-shrink-0">
                              {new Date(entry.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-slate-600 mt-0.5 truncate">{entry.note}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
}
