import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { type Contact } from "@shared/schema";
import { IconPlus, IconUsersGroup } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { ItemActions } from "@/components/ItemActions";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { hasDemoContacts, isDemoContact } from "@/lib/demo-contacts";

const RELATION_COLORS: Record<string, string> = {
  Partner: "bg-pink-100 text-pink-700",
  Friend: "app-tag",
  Family: "bg-amber-100 text-amber-700",
  Therapist: "bg-emerald-100 text-emerald-700",
  Other: "app-card-muted text-[var(--app-muted)]",
};

export default function Contacts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Contact removed" });
    },
  });

  return (
    <div className="flex flex-col min-h-full relative">
      <PageHeader
        eyebrow="Safety"
        title="Safety Circle"
        subtitle="People who have your back."
      />

      <div className="px-4 sm:px-5 pb-24 flex flex-col gap-3">
        {hasDemoContacts(contacts) && (
          <div className="app-card-muted rounded-xl px-3 py-2.5 text-[11px] text-[var(--app-muted)] leading-relaxed">
            Sample safety circle contacts for prototyping. Signal, map, and companion views work with these demos.
          </div>
        )}
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl app-card-muted animate-pulse" />
          ))
        ) : contacts.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-contacts">
            <div className="flex justify-center mb-4">
              <IconUsersGroup size={48} color="var(--app-accent)" />
            </div>
            <p className="text-sm text-[var(--app-muted)] font-medium">No contacts yet.</p>
            <p className="text-xs text-[var(--app-muted)] mt-1">
              Add someone you trust to your circle.
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              data-testid={`contact-${contact.id}`}
              className="app-card rounded-2xl shadow-sm p-4 flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm btn-gradient overflow-hidden"
              >
                {contact.imageUrl ? (
                  <img src={contact.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <>
                    {contact.firstName[0]}
                    {contact.lastName[0]}
                  </>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-[var(--app-text)]">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.isPrimary ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                      Primary
                    </span>
                  ) : null}
                  {isDemoContact(contact) && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Demo
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--app-muted)] mt-0.5">{contact.phone}</p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                    RELATION_COLORS[contact.relationship] ??
                    "app-card-muted text-[var(--app-muted)]"
                  }`}
                >
                  {contact.relationship}
                </span>
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                data-testid={`call-${contact.id}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.5 2H17.5C18.3 2 19 2.7 19 3.5V20.5C19 21.3 18.3 22 17.5 22H6.5C5.7 22 5 21.3 5 20.5V3.5C5 2.7 5.7 2 6.5 2Z"
                    fill="#10b981"
                    opacity="0.15"
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <circle cx="12" cy="19" r="1" fill="#10b981" />
                  <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill="#10b981" />
                </svg>
              </a>
              <ItemActions
                onEdit={() => setLocation(`/contacts/${contact.id}/edit`)}
                onDelete={() => deleteMutation.mutate(contact.id)}
              />
            </div>
          ))
        )}
      </div>

      <div className="px-4 sm:px-5 pb-4">
        <Link href="/emergency">
          <button
            data-testid="button-emergency"
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #ef4444, #f87171)" }}
          >
            Signal for Help
          </button>
        </Link>
      </div>

      <button
        type="button"
        data-testid="button-add-contact"
        onClick={() => setLocation("/contacts/new")}
        className="absolute bottom-24 right-4 sm:right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform btn-gradient text-white"
        style={{ bottom: "calc(6rem + var(--app-safe-bottom))" }}
      >
        <IconPlus size={22} />
      </button>
    </div>
  );
}
