import { useState } from "react";
import { useLocation } from "wouter";
import { BookMarked, MapPin, Search } from "lucide-react";
import { EditToggle } from "@/components/ItemActions";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";
import type { ResourceItem } from "@shared/profile-data";

export default function Resources() {
  const [, setLocation] = useLocation();
  const { profile, updateProfile, isSaving } = useUserProfile();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ResourceItem[]>(profile.resources);

  const scrollToRecentlyAdded = () => {
    document.getElementById("recently-added")?.scrollIntoView({ behavior: "smooth" });
  };

  const startEditing = () => {
    setDraft(profile.resources);
    setEditing(true);
  };

  const saveResources = async () => {
    try {
      await updateProfile({ resources: draft });
      toast({ title: "Resources updated" });
      setEditing(false);
    } catch {
      toast({ title: "Could not save resources", variant: "destructive" });
    }
  };

  const resources = editing ? draft : profile.resources;

  const updateResource = (index: number, patch: Partial<ResourceItem>) => {
    setDraft((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="flex flex-col min-h-full px-4 pb-6">
      <div className="flex items-center justify-between mb-4 pt-1">
        <h2 className="text-[18px] font-bold text-[var(--app-text)]">Resource Hub</h2>
        <EditToggle
          editing={editing}
          onToggle={() => (editing ? setEditing(false) : startEditing())}
          onSave={saveResources}
          isSaving={isSaving}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            type="button"
            data-testid="resource-browse"
            onClick={scrollToRecentlyAdded}
            className="w-[calc(50%-6px)] aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 text-white"
            style={{ background: "var(--app-primary-dark)" }}
          >
            <Search className="w-10 h-10 opacity-80" />
            <span className="text-[13px] font-semibold text-center leading-tight px-2">
              Browse Resources
            </span>
          </button>

          <button
            type="button"
            data-testid="resource-services"
            onClick={() => setLocation("/crisis")}
            className="w-[calc(50%-6px)] aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 text-white shadow-lg"
            style={{ background: "var(--app-primary)" }}
          >
            <MapPin className="w-10 h-10" />
            <span className="text-[13px] font-semibold text-center leading-tight px-2">
              Find Local Services
            </span>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            data-testid="resource-tutorials"
            onClick={() => setLocation("/breathe")}
            className="w-[calc(50%-6px)] aspect-square app-card-muted rounded-2xl flex flex-col items-center justify-center gap-3"
          >
            <BookMarked className="w-8 h-8 text-[var(--app-accent)]" />
            <span className="text-[13px] font-semibold text-[var(--app-text)]">
              Tutorials
            </span>
          </button>
        </div>
      </div>

      <div id="recently-added" className="mt-6 space-y-3 scroll-mt-4">
        <p className="text-[13px] font-bold text-[var(--app-text)]">
          Recently added
        </p>
        {resources.map((resource, index) => (
          editing ? (
            <div key={resource.id} className="app-card rounded-xl px-4 py-3 space-y-2">
              <input
                value={resource.title}
                onChange={(e) => updateResource(index, { title: e.target.value })}
                className="w-full app-input rounded-lg px-3 py-2 text-sm font-bold"
              />
              <input
                value={resource.description}
                onChange={(e) => updateResource(index, { description: e.target.value })}
                className="w-full app-input rounded-lg px-3 py-2 text-xs"
              />
              <input
                value={resource.tag}
                onChange={(e) => updateResource(index, { tag: e.target.value })}
                className="w-full app-input rounded-lg px-3 py-2 text-xs"
              />
              <input
                value={resource.href}
                onChange={(e) => updateResource(index, { href: e.target.value })}
                className="w-full app-input rounded-lg px-3 py-2 text-xs"
                placeholder="/breathe"
              />
            </div>
          ) : (
            <button
              key={resource.id}
              type="button"
              data-testid={`resource-${resource.id}`}
              onClick={() => setLocation(resource.href)}
              className="w-full text-left app-card rounded-xl px-4 py-3 active:scale-[0.98] transition-transform"
            >
              <p className="text-[13px] font-bold text-[var(--app-text)]">{resource.title}</p>
              <p className="text-[11px] text-[var(--app-muted)]">{resource.description}</p>
              <span className="inline-block mt-2 text-[10px] app-tag px-2.5 py-0.5 rounded-full font-medium">
                {resource.tag}
              </span>
            </button>
          )
        ))}
      </div>
    </div>
  );
}
