import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/react";
import { BarChart3, BookOpen, Users, Wind } from "lucide-react";
import { markOnboarded } from "@/lib/auth-fetch";
import { PhoneShell } from "@/components/PhoneShell";
import { useUserProfile } from "@/hooks/use-user-profile";
import { IconMood, type MoodLevel } from "@/components/Icons";
import {
  IllustrationCommunity,
  IllustrationPlan,
  IllustrationRelax,
} from "@/components/Illustrations";

const TOPICS = [
  { id: "anxiety", label: "Anxiety" },
  { id: "depression", label: "Depression" },
  { id: "lgbtq", label: "LGBTQ+ Support" },
  { id: "grief", label: "Grief" },
  { id: "relationships", label: "Relationships" },
  { id: "wellness", label: "General Wellness" },
];

const MOODS: { level: MoodLevel; label: string; value: number }[] = [
  { level: "struggling", label: "Struggling", value: 1 },
  { level: "low", label: "Low", value: 2 },
  { level: "okay", label: "Okay", value: 3 },
  { level: "good", label: "Good", value: 4 },
  { level: "great", label: "Great", value: 5 },
];

const FEATURES = [
  { icon: BookOpen, color: "#ec4899", text: "Journal your thoughts anytime" },
  { icon: Wind, color: "#7c3aed", text: "Guided breathing exercises" },
  { icon: BarChart3, color: "#3b82f6", text: "Track your mood over time" },
  { icon: Users, color: "#10b981", text: "Connect with a caring community" },
];

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { userId } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(profile.onboardingTopics);
  const [selectedMood, setSelectedMood] = useState<number | null>(profile.onboardingMood);

  useEffect(() => {
    setSelectedTopics(profile.onboardingTopics);
    setSelectedMood(profile.onboardingMood);
  }, [profile.onboardingTopics, profile.onboardingMood]);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    if (userId) {
      markOnboarded(userId);
      localStorage.setItem(
        `onboarding_data_${userId}`,
        JSON.stringify({ topics: selectedTopics, mood: selectedMood }),
      );
      await updateProfile({
        onboardingTopics: selectedTopics,
        onboardingMood: selectedMood,
      });
    }
    navigate("/");
  };

  return (
    <PhoneShell scrollable>
      <div
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 app-surface"
        style={{ paddingTop: "calc(2rem + var(--app-safe-top))" }}
      >
      {/* Decorative blobs */}
      <div
        className="pointer-events-none fixed top-[-80px] right-[-40px] w-64 h-64 rounded-full opacity-30 animate-float"
        style={{ background: "radial-gradient(circle, #a5f3fc 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-60px] left-[-40px] w-56 h-56 rounded-full opacity-30 animate-float-delay"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--app-accent) 35%, transparent) 0%, transparent 70%)" }}
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
                  ? "var(--app-gradient-primary)"
                  : s < step
                  ? "var(--app-accent)"
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
                <IllustrationPlan size={56} />
              </div>
              <h1
                className="text-2xl font-bold text-[var(--app-text)] app-brand"
                data-testid="text-step1-title"
              >
                What brings you here today?
              </h1>
              <p className="text-sm text-[var(--app-muted)] mt-2">
                Select all that apply — we'll personalise your experience.
              </p>
            </div>

            <div className="rounded-3xl p-6 mb-6 glass-card">
              <div className="flex flex-wrap gap-2.5 justify-center">
                {TOPICS.map(({ id, label }) => {
                  const active = selectedTopics.includes(id);
                  return (
                    <button
                      key={id}
                      data-testid={`pill-${id}`}
                      onClick={() => toggleTopic(id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95 border ${
                        active ? "pill-active border-transparent" : "pill-inactive"
                      }`}
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
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200 btn-gradient"
            >
              Continue
            </button>
            <button
              data-testid="button-skip-step1"
              onClick={() => setStep(2)}
              className="w-full py-2 mt-2 text-xs font-medium text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors"
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
                <IllustrationRelax size={56} />
              </div>
              <h1
                className="text-2xl font-bold text-[var(--app-text)] app-brand"
                data-testid="text-step2-title"
              >
                How are you feeling right now?
              </h1>
              <p className="text-sm text-[var(--app-muted)] mt-2">
                No right or wrong answer — just be honest with yourself.
              </p>
            </div>

            <div className="rounded-3xl p-6 mb-6 glass-card">
              <div className="flex items-center justify-between gap-1">
                {MOODS.map(({ level, label, value }) => {
                  const active = selectedMood === value;
                  return (
                    <button
                      key={value}
                      data-testid={`mood-${value}`}
                      onClick={() => setSelectedMood(value)}
                      className={`flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all duration-200 active:scale-90 border ${
                        active
                          ? "app-tag border-[var(--app-primary)]"
                          : "border-transparent"
                      }`}
                    >
                      <IconMood
                        level={level}
                        size={28}
                        color={active ? "var(--app-primary)" : "var(--app-muted)"}
                      />
                      <span
                        className={`text-[9px] font-semibold ${
                          active ? "text-[var(--app-primary)]" : "text-[var(--app-muted)]"
                        }`}
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
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-[var(--app-text)] pill-inactive active:scale-95 transition-all duration-200"
              >
                Back
              </button>
              <button
                data-testid="button-next-step2"
                onClick={() => setStep(3)}
                className="flex-[2] py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200 btn-gradient"
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
              <IllustrationCommunity size={88} />
            </div>
            <h1
              className="text-3xl font-bold text-[var(--app-text)] mb-3 app-brand"
              data-testid="text-step3-title"
            >
              You're all set!
            </h1>
            <p className="text-sm text-[var(--app-muted)] leading-relaxed mb-2">
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
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white btn-gradient"
                    >
                      {topic?.label}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="rounded-3xl p-5 mt-6 mb-6 text-left glass-card">
              <div className="flex flex-col gap-3.5">
                {FEATURES.map(({ icon: FeatureIcon, color, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `color-mix(in srgb, ${color} 14%, transparent)` }}
                    >
                      <FeatureIcon size={18} strokeWidth={1.75} color={color} />
                    </div>
                    <span className="text-sm text-[var(--app-muted)] font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              data-testid="button-get-started"
              onClick={handleFinish}
              className="w-full py-4 rounded-2xl text-sm font-bold text-white shadow-lg active:scale-95 transition-all duration-200 btn-gradient"
            >
              Let's get started
            </button>
          </div>
        )}
      </div>
      </div>
    </PhoneShell>
  );
}
