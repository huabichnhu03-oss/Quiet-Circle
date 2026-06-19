import { useLocation } from "wouter";

const CATEGORIES = [
  {
    id: "mental-health",
    title: "Mental Health",
    desc: "Articles, guides, and tools for emotional wellbeing",
    items: ["Understanding anxiety", "Mindfulness basics", "Managing depression"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#ddd6fe" />
        <path d="M10 16C10 12.7 12.7 10 16 10C19.3 10 22 12.7 22 16" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M10 16C10 18 11.2 19.8 13 20.7L13 23H19V20.7C20.8 19.8 22 18 22 16" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="13" y="23" width="6" height="1.5" rx="0.75" fill="#8b5cf6" />
      </svg>
    ),
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.07)",
  },
  {
    id: "self-care",
    title: "Self-Care Tools",
    desc: "Breathing exercises, grounding techniques, and routines",
    items: ["4-7-8 breathing", "Body scan meditation", "Gratitude journaling"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#fce7f3" />
        <path d="M16 22C16 22 9 18 9 13C9 10.8 10.8 9 13 9C14.2 9 15.3 9.5 16 10.4C16.7 9.5 17.8 9 19 9C21.2 9 23 10.8 23 13C23 18 16 22 16 22Z" fill="#ec4899" opacity="0.7" />
      </svg>
    ),
    color: "#ec4899",
    bg: "rgba(236,72,153,0.07)",
  },
  {
    id: "lgbtq",
    title: "LGBTQ+ Resources",
    desc: "Community support, identity guides, and advocacy",
    items: ["Coming out guide", "Pronoun resources", "Legal name change guide"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#fef3c7" />
        <path d="M8 20 L16 8 L24 20Z" fill="#f59e0b" opacity="0.8" />
        <circle cx="16" cy="21" r="3" fill="#f59e0b" opacity="0.6" />
      </svg>
    ),
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
  },
  {
    id: "crisis",
    title: "Crisis Support",
    desc: "Immediate resources when you need urgent help",
    items: ["Trans Lifeline: 877-565-8860", "Crisis Text Line: Text HOME to 741741", "Trevor Project: 1-866-488-7386"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#dcfce7" />
        <path d="M16 8V24M8 16H24" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    color: "#10b981",
    bg: "rgba(16,185,129,0.07)",
  },
  {
    id: "community",
    title: "Community",
    desc: "Forums, peer support groups, and local connections",
    items: ["Find local groups", "Online forums", "Peer mentorship"],
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" fill="#e0e7ff" />
        <circle cx="16" cy="12" r="3.5" fill="#6366f1" opacity="0.8" />
        <circle cx="9" cy="14" r="2.5" fill="#6366f1" opacity="0.5" />
        <circle cx="23" cy="14" r="2.5" fill="#6366f1" opacity="0.5" />
        <path d="M8 24C8 20.7 11.6 18 16 18C20.4 18 24 20.7 24 24" stroke="#6366f1" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    ),
    color: "#6366f1",
    bg: "rgba(99,102,241,0.07)",
  },
];

export default function Resources() {
  const [, setLocation] = useLocation();
  return (
    <div className="flex flex-col min-h-full relative">
      {/* AI Chat FAB */}
      <button
        data-testid="button-ai-chat"
        onClick={() => setLocation("/ai-chat")}
        className="fixed bottom-[84px] right-4 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
          boxShadow: "0 4px 20px rgba(139,92,246,0.45)",
        }}
        aria-label="Open Wellness Consultant"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.5 2 2 5.9 2 10.8C2 14.1 3.9 17 6.8 18.5L6 22L10.1 19.8C10.7 19.9 11.3 20 12 20C17.5 20 22 16.1 22 10.8C22 5.9 17.5 2 12 2Z" fill="white" opacity="0.9" />
          <circle cx="8.5" cy="11" r="1.2" fill="#8b5cf6" />
          <circle cx="12" cy="11" r="1.2" fill="#8b5cf6" />
          <circle cx="15.5" cy="11" r="1.2" fill="#8b5cf6" />
        </svg>
      </button>

      {/* Header */}
      <div className="px-5 pt-10 pb-5">
        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-1">Explore</p>
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-sm text-slate-600 mt-1">Tools and support, curated for you.</p>
      </div>

      {/* Category cards */}
      <div className="px-5 pb-8 flex flex-col gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            data-testid={`resource-${cat.id}`}
            className="rounded-3xl border border-slate-200 shadow-sm p-5"
            style={{ background: cat.bg }}
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="flex-shrink-0">{cat.icon}</div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">{cat.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {cat.items.map((item) => (
                <button
                  key={item}
                  className="flex items-center gap-2 text-left group"
                  data-testid={`resource-item-${item.substring(0, 10).replace(/\s+/g, "-").toLowerCase()}`}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">{item}</span>
                </button>
              ))}
            </div>
            <button
              className="mt-3 text-xs font-bold"
              style={{ color: cat.color }}
              data-testid={`explore-${cat.id}`}
            >
              Explore →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
