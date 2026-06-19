import { useState } from "react";
import { Link, useLocation } from "wouter";
import { IconMenu, IconBell, IconPlay, IconPause, IconVolume, IconSkipBack, IconSkipForward } from "@/components/Icons";
import { IllustrationPlan, IllustrationRelax, IllustrationMilestone } from "@/components/Illustrations";
import { NavDrawer } from "@/components/NavDrawer";

const DAYS = [
  { label: "S", color: "#f87171", face: "sad" },
  { label: "M", color: "#a78bfa", face: "slightly-sad" },
  { label: "T", color: "#6ee7b7", face: "neutral" },
  { label: "W", color: "#d1d5db", face: "neutral" },
  { label: "T", color: "#fbbf24", face: "happy" },
  { label: "F", color: "#fb923c", face: "content" },
  { label: "S", color: "#34d399", face: "happy" },
];

function MoodFace({ face, color }: { face: string; color: string }) {
  const eyeY = 11;
  const mouthY = 17;
  return (
    <svg viewBox="0 0 32 32" width="32" height="32">
      <circle cx="16" cy="16" r="15" fill={color} />
      <circle cx="11" cy={eyeY} r="2" fill="rgba(0,0,0,0.25)" />
      <circle cx="21" cy={eyeY} r="2" fill="rgba(0,0,0,0.25)" />
      {face === "happy" && (
        <path d="M10 17 Q16 24 22 17" stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
      {face === "content" && (
        <path d="M10 18 Q16 22 22 18" stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
      {face === "neutral" && (
        <line x1="10" y1={mouthY} x2="22" y2={mouthY} stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" strokeLinecap="round" />
      )}
      {face === "slightly-sad" && (
        <path d="M10 20 Q16 16 22 20" stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
      {face === "sad" && (
        <path d="M10 21 Q16 15 22 21" stroke="rgba(0,0,0,0.3)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

const tasks = [
  { id: "meditation", label: "Morning meditation", done: true },
  { id: "walk", label: "Nature walk", done: false },
  { id: "tea", label: "Tea Break", done: false },
];

const milestones = [true, true, false, true, true];

export const Home = (): JSX.Element => {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.done]))
  );
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleTask = (id: string) =>
    setCheckedTasks((prev) => ({ ...prev, [id]: !prev[id] }));

  const stopRelax = () => {
    setPlaying(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col min-h-full px-5 pt-3 pb-6 relative">
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          data-testid="button-menu"
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card"
        >
          <IconMenu size={18} />
        </button>
        <button data-testid="button-bell" className="w-9 h-9 flex items-center justify-center rounded-2xl glass-card">
          <IconBell size={18} />
        </button>
      </div>

      {/* Headline */}
      <div className="text-center mb-5">
        <h1
          data-testid="headline"
          className="text-[26px] font-bold text-gray-800 leading-snug"
          style={{ fontFamily: "'Khand', sans-serif" }}
        >
          Tracking mood provides<br />consistent scoring insights.
        </h1>

        {/* Period selector */}
        <div className="mt-4 inline-flex items-center rounded-full p-1 glass-card gap-0.5">
          {(["Daily", "Weekly", "Monthly"] as const).map((p) => (
            <button
              key={p}
              data-testid={`period-${p.toLowerCase()}`}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                period === p
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-gray-900"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Day mood circles */}
      <div className="flex items-center justify-between mb-5 px-1">
        {DAYS.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <MoodFace face={day.face} color={day.color} />
            <span className="text-[11px] font-semibold text-slate-600">{day.label}</span>
          </div>
        ))}
      </div>

      {/* Cards row: Today's plan + Relax mode */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Today's plan */}
        <div className="glass-card rounded-3xl p-4 flex flex-col gap-3" data-testid="card-todays-plan">
          <div className="flex items-center gap-2">
            <IllustrationPlan size={40} />
            <h3 className="text-[16px] font-bold text-gray-800 leading-tight">Today's plan</h3>
          </div>
          <p className="text-[10px] text-slate-600 -mt-1 leading-snug">Take small steps to build lasting confidence.</p>
          <div className="flex flex-col gap-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                data-testid={`task-${task.id}`}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-2 text-left group"
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    checkedTasks[task.id]
                      ? "bg-violet-500 border-violet-500"
                      : "border-gray-300"
                  }`}
                >
                  {checkedTasks[task.id] && (
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium transition-all duration-300 ${
                    checkedTasks[task.id] ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {task.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Relax mode */}
        <div className="glass-card rounded-3xl p-4 flex flex-col gap-3" data-testid="card-relax-mode">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IllustrationRelax size={40} />
              <h3 className="text-[16px] font-bold text-gray-800 leading-tight">Relax mode</h3>
            </div>
            {(playing || progress > 0) && (
              <button
                data-testid="button-relax-stop"
                onClick={stopRelax}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:bg-red-50"
                style={{ background: "rgba(239,68,68,0.1)" }}
                aria-label="Stop player"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-600 -mt-1 leading-snug">Embrace relaxation for peace and rejuvenation.</p>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #10b981, #34d399)",
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button data-testid="button-volume" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
              <IconVolume size={14} />
            </button>
            <div className="flex items-center gap-2">
              <button data-testid="button-skip-back" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
                <IconSkipBack size={12} />
              </button>
              <button
                data-testid="button-play-pause"
                onClick={() => setPlaying((p) => !p)}
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95"
                style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)" }}
              >
                {playing ? (
                  <IconPause size={14} />
                ) : (
                  <IconPlay size={14} />
                )}
              </button>
              <button data-testid="button-skip-forward" className="text-gray-400 hover:text-gray-600 transition-colors duration-300">
                <IconSkipForward size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Quick Access */}
      <Link href="/emergency">
        <button
          data-testid="button-sos-home"
          className="w-full mb-3 py-3 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-xs shadow-md active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #ef4444, #f87171)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="12" r="10" fill="white" opacity="0.25" />
            <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">SOS</text>
          </svg>
          Emergency Alert
        </button>
      </Link>

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

      {/* Milestones Achieved */}
      <div className="glass-card rounded-3xl p-5" data-testid="card-milestones">
        <div className="flex items-center gap-3 mb-2">
          <IllustrationMilestone size={44} />
          <div>
            <h3 className="text-[17px] font-bold text-gray-800 leading-tight">Milestones Achieved</h3>
            <p className="text-[10px] text-slate-600 leading-snug">
              Monitor progress and celebrate accomplishments.
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="relative flex items-center justify-between px-1 mt-4">
          <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 rounded-full" />
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 h-[2px] rounded-full transition-all duration-500"
            style={{
              width: "60%",
              background: "linear-gradient(90deg, #10b981, #a3e635)",
            }}
          />
          {milestones.map((done, i) => (
            <div
              key={i}
              data-testid={`milestone-${i}`}
              className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                done
                  ? "bg-white border-emerald-400"
                  : "bg-white border-gray-200"
              }`}
            >
              {done ? (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1.5 4L4 6.5L8.5 1.5" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
