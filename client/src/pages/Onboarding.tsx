import { useState } from "react";
import { useLocation } from "wouter";

const PASTEL_BG = "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)";

const TOPICS = [
  { id: "anxiety", label: "Anxiety" },
  { id: "depression", label: "Depression" },
  { id: "lgbtq", label: "LGBTQ+ Support" },
  { id: "grief", label: "Grief" },
  { id: "relationships", label: "Relationships" },
  { id: "wellness", label: "General Wellness" },
];

const MOODS = [
  { emoji: "😔", label: "Struggling", value: 1 },
  { emoji: "😕", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

function IllustrationMind({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="4" y="4" width="48" height="48" rx="16" fill="#ede9fe" />
      <ellipse cx="28" cy="27" rx="13" ry="12" fill="#c4b5fd" opacity="0.6" />
      <circle cx="28" cy="19" r="5" fill="#7c3aed" opacity="0.5" />
      <path d="M21 27 Q24 22 28 25 Q32 22 35 27" stroke="#7c3aed" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="24" r="2" fill="#a78bfa" opacity="0.7" />
      <circle cx="34" cy="24" r="2" fill="#a78bfa" opacity="0.7" />
      <rect x="23" y="35" width="10" height="2.5" rx="1.25" fill="#c4b5fd" opacity="0.8" />
      <rect x="25" y="39" width="6" height="2" rx="1" fill="#c4b5fd" opacity="0.5" />
      <circle cx="40" cy="14" r="3" fill="#ddd6fe" />
      <circle cx="44" cy="18" r="2" fill="#ddd6fe" opacity="0.6" />
    </svg>
  );
}

function IllustrationMoodCheck({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <rect x="4" y="4" width="48" height="48" rx="16" fill="#fce7f3" />
      <circle cx="28" cy="28" r="14" fill="#fbcfe8" opacity="0.7" />
      <circle cx="22" cy="24" r="2.5" fill="#be185d" opacity="0.5" />
      <circle cx="34" cy="24" r="2.5" fill="#be185d" opacity="0.5" />
      <path d="M20 32 Q28 40 36 32" stroke="#be185d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="16" r="3" fill="#fda4af" opacity="0.5" />
      <circle cx="42" cy="16" r="3" fill="#fda4af" opacity="0.5" />
      <circle cx="12" cy="36" r="2" fill="#fda4af" opacity="0.4" />
      <circle cx="44" cy="36" r="2" fill="#fda4af" opacity="0.4" />
    </svg>
  );
}

function IllustrationWelcome({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" fill="none">
      <circle cx="44" cy="44" r="40" fill="#ede9fe" />
      <circle cx="44" cy="44" r="28" fill="#c4b5fd" opacity="0.35" />
      <circle cx="44" cy="44" r="16" fill="#a78bfa" opacity="0.45" />
      <path d="M44 30 L47 38 L56 38 L49 43 L52 52 L44 47 L36 52 L39 43 L32 38 L41 38 Z" fill="#7c3aed" opacity="0.7" />
      <circle cx="22" cy="22" r="4" fill="#ddd6fe" opacity="0.8" />
      <circle cx="66" cy="22" r="3" fill="#fce7f3" opacity="0.8" />
      <circle cx="68" cy="64" r="4" fill="#ddd6fe" opacity="0.6" />
      <circle cx="20" cy="66" r="3" fill="#fce7f3" opacity="0.7" />
    </svg>
  );
}

function IconFeatureJournal({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="3" y="2" width="14" height="18" rx="3" fill="#fbcfe8" />
      <rect x="3" y="2" width="3" height="18" rx="2" fill="#f9a8d4" />
      <rect x="7" y="7" width="8" height="1.5" rx="0.75" fill="#be185d" opacity="0.5" />
      <rect x="7" y="10" width="6" height="1.5" rx="0.75" fill="#be185d" opacity="0.4" />
      <rect x="7" y="13" width="7" height="1.5" rx="0.75" fill="#be185d" opacity="0.4" />
    </svg>
  );
}

function IconFeatureBreathe({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" fill="#c4b5fd" opacity="0.4" />
      <circle cx="11" cy="11" r="5" fill="#a78bfa" opacity="0.5" />
      <path d="M11 5 Q13 8 11 10" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M17 11 Q14 13 12 11" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M11 17 Q9 14 11 12" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M5 11 Q8 9 10 11" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IconFeatureMood({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="2" width="18" height="18" rx="5" fill="#bfdbfe" opacity="0.6" />
      <rect x="5" y="14" width="3" height="4" rx="1.5" fill="#3b82f6" opacity="0.6" />
      <rect x="9.5" y="11" width="3" height="7" rx="1.5" fill="#3b82f6" opacity="0.7" />
      <rect x="14" y="12" width="3" height="6" rx="1.5" fill="#3b82f6" opacity="0.6" />
      <path d="M6.5 13 L11 9 L15.5 11" stroke="#1d4ed8" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFeatureCommunity({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" fill="#a7f3d0" opacity="0.5" />
      <circle cx="11" cy="9" r="2.5" fill="#059669" opacity="0.6" />
      <circle cx="7" cy="11" r="1.8" fill="#059669" opacity="0.4" />
      <circle cx="15" cy="11" r="1.8" fill="#059669" opacity="0.4" />
      <path d="M6 17 C6 14.5 8 13 11 13 C14 13 16 14.5 16 17" fill="#059669" opacity="0.3" />
    </svg>
  );
}

export default function Onboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    localStorage.setItem("onboarded", "true");
    localStorage.setItem(
      "onboarding_data",
      JSON.stringify({ topics: selectedTopics, mood: selectedMood })
    );
    navigate("/");
  };

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-6"
      style={{ background: PASTEL_BG }}
    >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed top-[-80px] right-[-40px] w-64 h-64 rounded-full opacity-30 animate-float"
        style={{ background: "radial-gradient(circle, #a5f3fc 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-60px] left-[-40px] w-56 h-56 rounded-full opacity-30 animate-float-delay"
        style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-[380px]">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              data-testid={`step-indicator-${s}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: s === step ? 28 : 8,
                height: 8,
                background: s === step
                  ? "linear-gradient(90deg, #7c3aed, #a855f7)"
                  : s < step
                  ? "#a855f7"
                  : "rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>

        {/* Step 1: Topics */}
        {step === 1 && (
          <div className="animate-fade-up">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <IllustrationMind size={56} />
              </div>
              <h1
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "'Khand', sans-serif" }}
                data-testid="text-step1-title"
              >
                What brings you here today?
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                Select all that apply — we'll personalise your experience.
              </p>
            </div>

            <div
              className="rounded-3xl p-6 mb-6"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              <div className="flex flex-wrap gap-2.5 justify-center">
                {TOPICS.map(({ id, label }) => {
                  const active = selectedTopics.includes(id);
                  return (
                    <button
                      key={id}
                      data-testid={`pill-${id}`}
                      onClick={() => toggleTopic(id)}
                      className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 border"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                          : "rgba(255,255,255,0.9)",
                        color: active ? "white" : "#64748b",
                        borderColor: active ? "transparent" : "rgba(0,0,0,0.1)",
                        boxShadow: active ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              data-testid="button-next-step1"
              onClick={() => setStep(2)}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Continue
            </button>
            <button
              data-testid="button-skip-step1"
              onClick={() => setStep(2)}
              className="w-full py-2 mt-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 2: Current mood */}
        {step === 2 && (
          <div className="animate-fade-up">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <IllustrationMoodCheck size={56} />
              </div>
              <h1
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "'Khand', sans-serif" }}
                data-testid="text-step2-title"
              >
                How are you feeling right now?
              </h1>
              <p className="text-sm text-slate-500 mt-2">
                No right or wrong answer — just be honest with yourself.
              </p>
            </div>

            <div
              className="rounded-3xl p-6 mb-6"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              <div className="flex items-center justify-between gap-1">
                {MOODS.map(({ emoji, label, value }) => {
                  const active = selectedMood === value;
                  return (
                    <button
                      key={value}
                      data-testid={`mood-${value}`}
                      onClick={() => setSelectedMood(value)}
                      className="flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all duration-200 active:scale-90"
                      style={{
                        background: active
                          ? "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.12))"
                          : "transparent",
                        border: active ? "1.5px solid rgba(124,58,237,0.3)" : "1.5px solid transparent",
                      }}
                    >
                      <span className="text-3xl leading-none">{emoji}</span>
                      <span
                        className="text-[9px] font-semibold"
                        style={{ color: active ? "#7c3aed" : "#94a3b8" }}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                data-testid="button-back-step2"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-slate-600 border border-gray-200 bg-white active:scale-95 transition-all duration-200"
              >
                Back
              </button>
              <button
                data-testid="button-next-step2"
                onClick={() => setStep(3)}
                className="flex-[2] py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Welcome confirmation */}
        {step === 3 && (
          <div className="animate-fade-up text-center">
            <div className="flex justify-center mb-5">
              <IllustrationWelcome size={88} />
            </div>
            <h1
              className="text-3xl font-bold text-gray-800 mb-3"
              style={{ fontFamily: "'Khand', sans-serif" }}
              data-testid="text-step3-title"
            >
              You're all set!
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-2">
              Welcome to your safe space. We're here to support your mental
              wellness journey — one day at a time.
            </p>
            {selectedTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-4 mb-2">
                {selectedTopics.map((id) => {
                  const topic = TOPICS.find((t) => t.id === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
                    >
                      {topic?.label}
                    </span>
                  );
                })}
              </div>
            )}

            <div
              className="rounded-3xl p-5 mt-6 mb-6 text-left"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
            >
              <div className="flex flex-col gap-3.5">
                {[
                  { Icon: IconFeatureJournal, text: "Journal your thoughts anytime" },
                  { Icon: IconFeatureBreathe, text: "Guided breathing exercises" },
                  { Icon: IconFeatureMood, text: "Track your mood over time" },
                  { Icon: IconFeatureCommunity, text: "Connect with a caring community" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Icon size={22} />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              data-testid="button-get-started"
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Let's get started
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
