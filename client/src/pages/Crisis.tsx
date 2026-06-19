const HOTLINES = [
  {
    name: "Trans Lifeline",
    description: "Peer support run by and for trans people",
    number: "877-565-8860",
    available: "24/7",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to start a conversation",
    number: "741741",
    available: "Text anytime",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.08)",
  },
  {
    name: "Trevor Project",
    description: "Crisis intervention for LGBTQ+ youth",
    number: "1-866-488-7386",
    available: "24/7",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "Call or text for immediate support",
    number: "988",
    available: "24/7",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    name: "PFLAG Canada",
    description: "Local support for LGBTQ+ people and families",
    number: "1-888-530-6777",
    available: "Mon–Fri 9am–5pm EST",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
  },
];

export default function Crisis() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div
        className="px-5 pt-10 pb-8 text-center"
        style={{ background: "linear-gradient(160deg, #fde4d8 0%, #fce7f3 60%, rgba(255,255,255,0) 100%)" }}
      >
        <div className="text-4xl mb-3">🤝</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're not alone.</h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-[280px] mx-auto">
          Reaching out takes courage. These lines are staffed by people who care and understand.
        </p>
      </div>

      {/* Hotline cards */}
      <div className="px-5 pb-8 flex flex-col gap-3">
        {HOTLINES.map((line) => (
          <div
            key={line.name}
            data-testid={`hotline-${line.name.replace(/\s+/g, "-").toLowerCase()}`}
            className="rounded-2xl border border-slate-200 shadow-sm p-4"
            style={{ background: line.bg }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-800 mb-0.5">{line.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{line.description}</p>
                <p className="text-[10px] font-semibold text-slate-600">{line.available}</p>
              </div>
              <a
                href={line.number.replace(/\D/g, "").length <= 6 ? `sms:${line.number}` : `tel:${line.number}`}
                data-testid={`call-${line.name.replace(/\s+/g, "-").toLowerCase()}`}
                className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl active:scale-95 transition-transform"
                style={{ background: line.color, color: "white" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M6.6 10.8C7.8 13.2 9.8 15.2 12.2 16.4L14 14.6C14.3 14.3 14.7 14.2 15 14.4C16.1 14.8 17.3 15 18.5 15C19.3 15 20 15.7 20 16.5V19.5C20 20.3 19.3 21 18.5 21C9.9 21 3 14.1 3 5.5C3 4.7 3.7 4 4.5 4H7.5C8.3 4 9 4.7 9 5.5C9 6.7 9.2 7.9 9.6 9C9.8 9.3 9.7 9.7 9.4 10L7.6 11.8C7.6 11.4 7.1 11.1 6.6 10.8Z" />
                </svg>
                <span className="text-[9px] font-bold">{line.number}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
