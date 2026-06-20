import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { IconArrowLeft } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";

const phases = [
  { label: "Breathe In", duration: 4, scale: 1.4, color: "var(--app-accent)" },
  { label: "Hold", duration: 4, scale: 1.4, color: "var(--app-primary)" },
  { label: "Breathe Out", duration: 6, scale: 1.0, color: "var(--app-primary-dark)" },
  { label: "Hold", duration: 2, scale: 1.0, color: "var(--app-accent)" },
];

export default function Breathe() {
  const [running, setRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setPhaseIndex((pi) => {
            const next = (pi + 1) % phases.length;
            if (next === 0) setCycles((c) => c + 1);
            setSecondsLeft(phases[next].duration);
            return next;
          });
          return phases[(phaseIndex + 1) % phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, phaseIndex]);

  const handleToggle = () => {
    if (running) {
      setRunning(false);
      setPhaseIndex(0);
      setSecondsLeft(phases[0].duration);
      setCycles(0);
    } else {
      setRunning(true);
    }
  };

  const handleStopAndExit = () => {
    setRunning(false);
    setLocation("/");
  };

  const phase = phases[phaseIndex];
  const progress = 1 - secondsLeft / phase.duration;

  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow="Calm your mind"
        title="Breathe"
        subtitle="Box breathing for stress relief"
        action={
          <button
            data-testid="button-breathe-back"
            onClick={() => setLocation("/")}
            className="w-9 h-9 flex items-center justify-center rounded-2xl app-card text-[var(--app-text)] flex-shrink-0"
            aria-label="Back to home"
          >
            <IconArrowLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 gap-8">
        <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
          <svg width={240} height={240} className="absolute inset-0" viewBox="0 0 240 240">
            <circle
              cx={120}
              cy={120}
              r={110}
              fill="none"
              stroke="color-mix(in srgb, var(--app-accent) 12%, transparent)"
              strokeWidth={8}
            />
            <circle
              cx={120}
              cy={120}
              r={110}
              fill="none"
              stroke={phase.color}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 110}`}
              strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress)}`}
              transform="rotate(-90 120 120)"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
            />
          </svg>

          <div
            data-testid="breathe-circle"
            className="rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
            style={{
              width: 160,
              height: 160,
              background: `radial-gradient(circle at 40% 35%, color-mix(in srgb, ${phase.color} 80%, white), ${phase.color})`,
              transform: `scale(${running ? phase.scale : 1})`,
              transition: `transform ${phase.duration}s ease-in-out, background 0.5s`,
              boxShadow: `0 0 40px color-mix(in srgb, ${phase.color} 33%, transparent)`,
            }}
          >
            <span className="text-2xl font-bold">{secondsLeft}</span>
            <span className="text-[11px] font-medium opacity-80 mt-0.5">
              {running ? phase.label : "Ready"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {phases.map((p, i) => (
            <div
              key={i}
              data-testid={`phase-indicator-${i}`}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                phaseIndex === i && running ? "pill-active" : "pill-inactive"
              }`}
            >
              {p.label}
            </div>
          ))}
        </div>

        {cycles > 0 ? (
          <div data-testid="cycles-count" className="app-card rounded-2xl px-6 py-3 text-center">
            <p className="text-2xl font-bold text-[var(--app-primary)]">{cycles}</p>
            <p className="text-xs text-[var(--app-muted)]">
              cycle{cycles !== 1 ? "s" : ""} completed
            </p>
          </div>
        ) : null}

        <button
          data-testid="button-breathe-toggle"
          onClick={handleToggle}
          className={`w-full max-w-[280px] py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg text-white ${
            running ? "" : "btn-gradient"
          }`}
          style={
            running
              ? { background: "#ef4444", boxShadow: "0 8px 20px rgba(239,68,68,0.3)" }
              : { boxShadow: "0 8px 20px color-mix(in srgb, var(--app-accent) 30%, transparent)" }
          }
        >
          {running ? "Stop Session" : "Start Breathing"}
        </button>

        <button
          data-testid="button-breathe-stop-exit"
          onClick={handleStopAndExit}
          className="flex items-center gap-2 text-sm font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] transition-colors px-4 py-2 rounded-xl app-card"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
          {running ? "Stop & Exit" : "← Back to Home"}
        </button>

        <div className="app-card rounded-2xl p-4 w-full max-w-[320px]">
          <h3 className="text-xs font-bold text-[var(--app-text)] mb-3">4-4-6-2 Box Breathing</h3>
          <div className="space-y-2">
            {phases.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-[var(--app-muted)]">{p.label}</span>
                <span className="text-xs font-semibold text-[var(--app-accent)]">
                  {p.duration}s
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
