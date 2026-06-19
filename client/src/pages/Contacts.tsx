import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { type Contact } from "@shared/schema";
import { IconPlus } from "@/components/Icons";

const RELATION_COLORS: Record<string, string> = {
  Partner: "bg-pink-100 text-pink-700",
  Friend: "bg-violet-100 text-violet-700",
  Family: "bg-amber-100 text-amber-700",
  Therapist: "bg-emerald-100 text-emerald-700",
  Other: "bg-gray-100 text-gray-600",
};

export default function Contacts() {
  const { data: contacts = [], isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  return (
    <div className="flex flex-col min-h-full relative">
      {/* Header */}
      <div className="px-5 pt-10 pb-6">
        <p className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-1">Safety</p>
        <h1 className="text-2xl font-bold text-gray-900">Safety Circle</h1>
        <p className="text-sm text-slate-600 mt-1">People who have your back.</p>
      </div>

      {/* List */}
      <div className="px-5 pb-24 flex flex-col gap-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/50 animate-pulse" />
          ))
        ) : contacts.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-contacts">
            <div className="text-5xl mb-4">🫂</div>
            <p className="text-sm text-slate-600 font-medium">No contacts yet.</p>
            <p className="text-xs text-slate-600 mt-1">Add someone you trust to your circle.</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              data-testid={`contact-${contact.id}`}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-4"
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)" }}
              >
                {contact.firstName[0]}{contact.lastName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-800">
                    {contact.firstName} {contact.lastName}
                  </p>
                  {contact.isPrimary && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                      Primary
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{contact.phone}</p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${
                    RELATION_COLORS[contact.relationship] ?? "bg-gray-100 text-gray-600"
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
                  <path d="M6.5 2H17.5C18.3 2 19 2.7 19 3.5V20.5C19 21.3 18.3 22 17.5 22H6.5C5.7 22 5 21.3 5 20.5V3.5C5 2.7 5.7 2 6.5 2Z" fill="#10b981" opacity="0.15" stroke="#10b981" strokeWidth="1.5" />
                  <circle cx="12" cy="19" r="1" fill="#10b981" />
                  <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill="#10b981" />
                </svg>
              </a>
            </div>
          ))
        )}
      </div>

      {/* Emergency SOS banner */}
      <div className="px-5 pb-4">
        <Link href="/emergency">
          <button
            data-testid="button-emergency"
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-bold text-sm shadow-lg active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg, #ef4444, #f87171)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <circle cx="12" cy="12" r="10" fill="white" opacity="0.2" />
              <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="white">SOS</text>
            </svg>
            Trigger Emergency Alert
          </button>
        </Link>
      </div>

      {/* FAB */}
      <Link href="/contacts/new">
        <button
          data-testid="button-add-contact"
          className="absolute bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)" }}
        >
          <IconPlus size={22} />
        </button>
      </Link>
    </div>
  );
}
