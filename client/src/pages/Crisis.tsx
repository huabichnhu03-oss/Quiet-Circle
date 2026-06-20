import { useState } from "react";
import { MessageSquare, Phone } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EditToggle } from "@/components/ItemActions";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";
import type { HotlineItem } from "@shared/profile-data";

export default function Crisis() {
  const { profile, updateProfile, isSaving } = useUserProfile();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<HotlineItem[]>(profile.hotlines);

  const startEditing = () => {
    setDraft(profile.hotlines);
    setEditing(true);
  };

  const saveHotlines = async () => {
    try {
      await updateProfile({ hotlines: draft });
      toast({ title: "Hotlines updated" });
      setEditing(false);
    } catch {
      toast({ title: "Could not save hotlines", variant: "destructive" });
    }
  };

  const hotlines = editing ? draft : profile.hotlines;

  const updateLine = (index: number, patch: Partial<HotlineItem>) => {
    setDraft((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow="Support"
        title="You're not alone"
        subtitle="Reaching out takes courage. These lines are staffed by people who care and understand."
        action={
          <EditToggle
            editing={editing}
            onToggle={() => (editing ? setEditing(false) : startEditing())}
            onSave={saveHotlines}
            isSaving={isSaving}
          />
        }
      />

      <div className="px-4 sm:px-5 pb-8 flex flex-col gap-3">
        {hotlines.map((line, index) => (
          <article
            key={line.id}
            data-testid={`hotline-${line.id}`}
            className="app-card rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-4 pt-4 pb-3 space-y-2">
              {editing ? (
                <>
                  <input
                    value={line.name}
                    onChange={(e) => updateLine(index, { name: e.target.value })}
                    className="w-full app-input rounded-xl px-3 py-2 text-sm font-bold"
                  />
                  <input
                    value={line.description}
                    onChange={(e) => updateLine(index, { description: e.target.value })}
                    className="w-full app-input rounded-xl px-3 py-2 text-xs"
                  />
                  <div className="flex gap-2">
                    <input
                      value={line.number}
                      onChange={(e) => updateLine(index, { number: e.target.value })}
                      className="flex-1 app-input rounded-xl px-3 py-2 text-xs"
                    />
                    <input
                      value={line.available}
                      onChange={(e) => updateLine(index, { available: e.target.value })}
                      className="flex-1 app-input rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-[15px] font-bold text-[var(--app-text)] leading-snug">
                      {line.name}
                    </h3>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${line.accent} 14%, transparent)`,
                        color: line.accent,
                      }}
                    >
                      {line.available}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--app-muted)] leading-relaxed">
                    {line.description}
                  </p>
                </>
              )}
            </div>

            {!editing ? (
              <a
                href={line.href}
                data-testid={`call-${line.id}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 text-sm font-bold text-white active:scale-[0.98] transition-transform"
                style={{ background: line.accent }}
              >
                {line.action === "text" ? (
                  <MessageSquare className="w-4 h-4 flex-shrink-0" aria-hidden />
                ) : (
                  <Phone className="w-4 h-4 flex-shrink-0" aria-hidden />
                )}
                {line.action === "text" ? `Text ${line.number}` : `Call ${line.number}`}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
