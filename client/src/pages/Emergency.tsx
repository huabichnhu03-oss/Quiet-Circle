import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronRight, Plus, Search } from "lucide-react";
import { type Contact } from "@shared/schema";
import { contactInitials, contactTags, setActiveSignal } from "@/lib/signal-map";
import { hasDemoContacts, isDemoContact } from "@/lib/demo-contacts";
import { IconArrowLeft } from "@/components/Icons";

export default function Emergency() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");

  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q),
    );
  }, [contacts, search]);

  const handleSelectContact = (contact: Contact) => {
    setActiveSignal({
      contactId: contact.id,
      contactName: `${contact.firstName} ${contact.lastName}`,
      startedAt: new Date().toISOString(),
    });
    setLocation(`/emergency/active/${contact.id}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex items-center gap-3 px-5 pt-5 mb-2">
        <button
          type="button"
          data-testid="button-back"
          onClick={() => setLocation("/")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl app-card"
        >
          <IconArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-[var(--app-text)]">Signal for Help</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <p className="text-[12px] text-[var(--app-muted)] mb-3">
          Who would you like to notify?
        </p>

        {hasDemoContacts(contacts) && (
          <div className="app-card-muted rounded-xl px-3 py-2.5 mb-3 text-[11px] text-[var(--app-muted)] leading-relaxed">
            Demo contacts are loaded for prototyping. Tap one to try the signal map flow.
          </div>
        )}

        <div className="flex items-center gap-2 app-card rounded-xl px-3 py-2.5 mb-4">
          <Search className="w-4 h-4 text-[var(--app-muted)] flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts"
            data-testid="input-signal-search"
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--app-muted)] text-[var(--app-text)]"
          />
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl app-card animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center app-card-muted rounded-2xl p-6 mb-4 space-y-4">
            <p className="text-sm text-[var(--app-muted)]">
              {contacts.length === 0
                ? "No emergency contacts yet."
                : "No contacts match your search."}
            </p>
            {contacts.length === 0 && (
              <button
                type="button"
                data-testid="button-add-signal-contact-empty"
                onClick={() => setLocation("/contacts/new?from=signal")}
                className="btn-primary text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                Add Emergency Contact
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {filtered.map((contact) => (
              <button
                key={contact.id}
                type="button"
                data-testid={`signal-contact-${contact.id}`}
                onClick={() => handleSelectContact(contact)}
                className="w-full app-card rounded-xl px-3 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--app-primary)] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {contactInitials(contact.firstName, contact.lastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--app-text)]">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-[11px] text-[var(--app-muted)]">{contact.phone}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {isDemoContact(contact) && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800">
                        Demo
                      </span>
                    )}
                    {contactTags(contact).map((tag) => (
                      <span key={tag} className="app-tag text-[10px] px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--app-muted)] flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          data-testid="button-add-signal-contact"
          onClick={() => setLocation("/contacts/new?from=signal")}
          className="flex items-center gap-2 text-[var(--app-primary)] text-[13px] font-semibold"
        >
          <div className="w-6 h-6 rounded-full border-2 border-[var(--app-primary)] flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </div>
          Add Emergency Contact
        </button>
      </div>
    </div>
  );
}
