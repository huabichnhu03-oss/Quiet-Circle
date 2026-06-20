import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type MoodEntry } from "@shared/schema";
import { IllustrationMilestone } from "@/components/Illustrations";
import { IconMood, type MoodLevel } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { ItemActions } from "@/components/ItemActions";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MOOD_OPTIONS, moodDisplayLabel } from "@/lib/mood-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const moodStyle: Record<string, { bg: string; text: string; dot: string }> = {
  great: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "#10b981" },
  good: {
    bg: "color-mix(in srgb, var(--app-accent) 8%, transparent)",
    text: "text-[var(--app-primary)]",
    dot: "var(--app-accent)",
  },
  okay: { bg: "bg-amber-50", text: "text-amber-700", dot: "#f59e0b" },
  not_great: { bg: "bg-orange-50", text: "text-orange-700", dot: "#f97316" },
  bad: { bg: "bg-rose-50", text: "text-rose-700", dot: "#ef4444" },
  sad: { bg: "bg-rose-50", text: "text-rose-700", dot: "#ef4444" },
  happy: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "#10b981" },
  neutral: { bg: "bg-amber-50", text: "text-amber-700", dot: "#f59e0b" },
};

function groupByDate(entries: MoodEntry[]) {
  const groups: Record<string, MoodEntry[]> = {};
  entries.forEach((e) => {
    const day = new Date(e.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!groups[day]) groups[day] = [];
    groups[day].push(e);
  });
  return groups;
}

const moodLevelMap: Record<string, MoodLevel> = {
  great: "great",
  good: "good",
  okay: "okay",
  not_great: "low",
  bad: "struggling",
  sad: "struggling",
  happy: "great",
  neutral: "okay",
};

function MoodDot({ mood }: { mood: string }) {
  const dot = moodStyle[mood]?.dot ?? "var(--app-muted)";
  const level = moodLevelMap[mood] ?? "okay";
  return (
    <div className="w-12 h-12 rounded-2xl app-card shadow-sm flex items-center justify-center flex-shrink-0">
      <IconMood level={level} size={22} color={dot} />
    </div>
  );
}

export default function Entries() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [editMood, setEditMood] = useState("okay");
  const [editNote, setEditNote] = useState("");

  const { data: entries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/mood-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      toast({ title: "Entry deleted" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      apiRequest("PATCH", `/api/mood-entries/${editingEntry!.id}`, {
        mood: editMood,
        note: editNote.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      toast({ title: "Entry updated" });
      setEditingEntry(null);
    },
  });

  const openEdit = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setEditMood(entry.mood);
    setEditNote(entry.note ?? "");
  };

  const grouped = groupByDate(entries);

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="History"
        title="Mood Entries"
        subtitle={`${entries.length} check-in${entries.length !== 1 ? "s" : ""} recorded`}
        illustration={<IllustrationMilestone size={44} />}
      />

      <div className="px-4 sm:px-5 -mt-2">
        {isLoading ? (
          <div className="space-y-3 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 app-card-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-entries">
            <div className="flex justify-center mb-3">
              <IllustrationMilestone size={56} />
            </div>
            <p className="text-sm text-[var(--app-muted)] font-medium">
              No mood entries yet.
            </p>
            <p className="text-xs text-[var(--app-muted)] mt-1">
              Go to Home to log your first mood!
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-2">
            {Object.entries(grouped).map(([day, dayEntries]) => (
              <div key={day} data-testid={`entry-group-${day}`}>
                <p className="text-xs font-bold text-[var(--app-muted)] uppercase tracking-wider mb-2 px-1">
                  {day}
                </p>
                <div className="space-y-2">
                  {dayEntries.map((entry) => {
                    const style = moodStyle[entry.mood] ?? {
                      bg: "app-card-muted",
                      text: "text-[var(--app-text)]",
                      dot: "var(--app-muted)",
                    };
                    return (
                      <div
                        key={entry.id}
                        data-testid={`mood-entry-${entry.id}`}
                        className={`rounded-2xl p-4 flex items-center gap-4 ${style.bg} app-card`}
                      >
                        <MoodDot mood={entry.mood} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-[15px] font-bold ${style.text}`}>
                              {moodDisplayLabel(entry.mood)}
                            </p>
                            <p className="text-[10px] text-[var(--app-muted)] flex-shrink-0">
                              {new Date(entry.createdAt).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {entry.note ? (
                            <p className="text-xs text-[var(--app-muted)] mt-0.5 truncate">
                              {entry.note}
                            </p>
                          ) : null}
                        </div>
                        <ItemActions
                          onEdit={() => openEdit(entry)}
                          onDelete={() => deleteMutation.mutate(entry.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={Boolean(editingEntry)} onOpenChange={(open) => !open && setEditingEntry(null)}>
        <DialogContent className="app-card border-[var(--app-border)] rounded-2xl max-w-[calc(100%-2rem)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--app-text)]">Edit Mood Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--app-muted)] mb-2">Mood</p>
              <div className="flex flex-wrap gap-2">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setEditMood(m.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      editMood === m.id ? "pill-active" : "pill-inactive"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--app-muted)] mb-2">Note (optional)</p>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="w-full app-input rounded-xl p-3 text-sm outline-none min-h-[80px] resize-none"
                placeholder="Add a note..."
              />
            </div>
            <button
              type="button"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="w-full py-3 rounded-xl text-sm font-bold text-white btn-gradient disabled:opacity-50"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="h-6" />
    </div>
  );
}
