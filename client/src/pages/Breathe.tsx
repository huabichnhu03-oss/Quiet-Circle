import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { IconArrowLeft } from "@/components/Icons";

const phases = [
  { label: "Breathe In", duration: 4, scale: 1.4, color: "#8b5cf6" },
  { label: "Hold", duration: 4, scale: 1.4, color: "#a78bfa" },
  { label: "Breathe Out", duration: 6, scale: 1.0, color: "#6d28d9" },
  { label: "Hold", duration: 2, scale: 1.0, color: "#7c3aed" },
];

const totalCycle = phases.reduce((s, p) => s + p.duration, 0);

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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
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
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)" }}>
      <div className="px-6 pt-10 pb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1">Calm your mind</p>
          <h1 className="text-2xl font-bold text-gray-900">Breathe 🌬️</h1>
          <p className="text-sm text-slate-600 mt-1">Box breathing for stress relief</p>
        </div>
        <button
          data-testid="button-breathe-back"
          onClick={() => setLocation("/")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl mt-1 flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 8px 32px rgba(0,0,0,0.07)" }}
          aria-label="Back to home"
        >
          <IconArrowLeft size={18} color="#4b5563" />
        </button>
      </div>

      {/* Breathing circle */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        <div className="relative flex items-center justify-center" style={{ width: 240, height: 240 }}>
          {/* Outer ring */}
          <svg width={240} height={240} className="absolute inset-0" viewBox="0 0 240 240">
            <circle cx={120} cy={120} r={110} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth={8} />
            <circle
              cx={120} cy={120} r={110}
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

          {/* Pulsing circle */}
          <div
            data-testid="breathe-circle"
            className="rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
            style={{
              width: 160,
              height: 160,
              background: `radial-gradient(circle at 40% 35%, ${phase.color}cc, ${phase.color})`,
              transform: `scale(${running ? phase.scale : 1})`,
              transition: `transform ${phase.duration}s ease-in-out, background 0.5s`,
              boxShadow: `0 0 40px ${phase.color}55`,
            }}
          >
            <span className="text-2xl font-bold">{secondsLeft}</span>
            <span className="text-[11px] font-medium opacity-80 mt-0.5">{running ? phase.label : "Ready"}</span>
          </div>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-2">
          {phases.map((p, i) => (
            <div
              key={i}
              data-testid={`phase-indicator-${i}`}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: phaseIndex === i && running ? phase.color : "rgba(255,255,255,0.6)",
                color: phaseIndex === i && running ? "#fff" : "#6b7280",
              }}
            >
              {p.label}
            </div>
          ))}
        </div>

        {/* Cycles counter */}
        {cycles > 0 && (
          <div data-testid="cycles-count" className="bg-white rounded-2xl px-6 py-3 text-center border border-slate-200">
            <p className="text-2xl font-bold text-violet-700">{cycles}</p>
            <p className="text-xs text-slate-600">cycle{cycles !== 1 ? "s" : ""} completed</p>
          </div>
        )}

        {/* Start/Stop button */}
        <button
          data-testid="button-breathe-toggle"
          onClick={handleToggle}
          className="w-full max-w-[280px] py-4 rounded-2xl text-sm font-bold transition-all active:scale-95 shadow-lg"
          style={{
            background: running ? "#ef4444" : "linear-gradient(135deg, #8b5cf6, #a855f7)",
            color: "white",
            boxShadow: running ? "0 8px 20px rgba(239,68,68,0.3)" : "0 8px 20px rgba(139,92,246,0.3)",
          }}
        >
          {running ? "Stop Session" : "Start Breathing"}
        </button>

        {/* Stop & Exit */}
        <button
          data-testid="button-breathe-stop-exit"
          onClick={handleStopAndExit}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-gray-900 transition-colors px-4 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.9)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          {running ? "Stop & Exit" : "← Back to Home"}
        </button>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 w-full max-w-[320px]">
          <h3 className="text-xs font-bold text-gray-700 mb-3">4-4-6-2 Box Breathing</h3>
          <div className="space-y-2">
            {phases.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{p.label}</span>
                <span className="text-xs font-semibold text-violet-600">{p.duration}s</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
