import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { type JournalEntry } from "@shared/schema";
import { IconPen, IconChevronRight } from "@/components/Icons";
import { IllustrationJournal } from "@/components/Illustrations";
import { PageHeader } from "@/components/PageHeader";
import { ItemActions } from "@/components/ItemActions";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const moodColor: Record<string, { bg: string; dot: string }> = {
  great: { bg: "rgba(16,185,129,0.12)", dot: "#10b981" },
  good: { bg: "color-mix(in srgb, var(--app-accent) 12%, transparent)", dot: "var(--app-accent)" },
  okay: { bg: "rgba(251,191,36,0.12)", dot: "#f59e0b" },
  not_great: { bg: "rgba(251,146,60,0.12)", dot: "#f97316" },
  bad: { bg: "rgba(239,68,68,0.12)", dot: "#ef4444" },
};

export default function Journals() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal-entries"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/journal-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({ title: "Entry deleted" });
    },
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Your space"
        title="Journals"
        subtitle="Write freely. This is just for you."
        illustration={<IllustrationJournal size={44} />}
      />

      <div className="px-4 sm:px-5 -mt-2">
        <Link href="/journals/new">
          <button
            data-testid="button-new-journal"
            className="w-full btn-primary rounded-2xl py-4 flex items-center justify-center gap-2 text-sm font-bold shadow-md active:scale-95 transition-transform mb-5"
          >
            <IconPen size={16} />
            New Entry
          </button>
        </Link>

        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl app-card-muted animate-pulse" />
            ))
          ) : entries.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-journals">
              <div className="flex justify-center mb-3">
                <IllustrationJournal size={56} />
              </div>
              <p className="text-sm text-[var(--app-muted)] font-medium">
                No journal entries yet.
              </p>
              <p className="text-xs text-[var(--app-muted)] mt-1">
                Start writing to capture your thoughts.
              </p>
            </div>
          ) : (
            entries.map((entry) => {
              const style = moodColor[entry.mood ?? ""] ?? {
                bg: "color-mix(in srgb, var(--app-accent) 8%, transparent)",
                dot: "var(--app-accent)",
              };
              return (
                <div
                  key={entry.id}
                  data-testid={`journal-entry-${entry.id}`}
                  className="app-card rounded-2xl shadow-sm p-4 flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: style.bg }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: style.dot }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-[var(--app-text)] truncate leading-tight">
                      {entry.title}
                    </h4>
                    <p className="text-xs text-[var(--app-muted)] line-clamp-2 leading-relaxed mt-0.5">
                      {entry.content}
                    </p>
                    <p className="text-[10px] text-[var(--app-muted)] mt-2">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <ItemActions
                    onEdit={() => setLocation(`/journals/${entry.id}/edit`)}
                    onDelete={() => deleteMutation.mutate(entry.id)}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
