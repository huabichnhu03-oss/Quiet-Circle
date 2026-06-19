import { useQuery } from "@tanstack/react-query";
import { type MoodEntry } from "@shared/schema";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { IllustrationInsights, IllustrationBreathe, IllustrationRelax } from "@/components/Illustrations";

const moodScore: Record<string, number> = {
  great: 5, good: 4, okay: 3, not_great: 2, bad: 1,
};

const moodColor: Record<string, string> = {
  great: "bg-emerald-100 text-emerald-700",
  good: "bg-violet-100 text-violet-700",
  okay: "bg-amber-100 text-amber-700",
  not_great: "bg-orange-100 text-orange-700",
  bad: "bg-rose-100 text-rose-700",
};

const moodDot: Record<string, string> = {
  great: "#10b981", good: "#8b5cf6", okay: "#f59e0b", not_great: "#f97316", bad: "#ef4444",
};

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Insights() {
  const { data: entries = [], isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
  });

  const chartData = (() => {
    const byDay: Record<string, number[]> = {};
    entries.forEach((e) => {
      const day = formatDay(new Date(e.createdAt));
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(moodScore[e.mood] ?? 3);
    });
    return Object.entries(byDay)
      .slice(-7)
      .map(([day, scores]) => ({
        day,
        mood: +(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
      }));
  })();

  const moodCounts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.mood] = (acc[e.mood] ?? 0) + 1;
    return acc;
  }, {});

  const avgMood = entries.length
    ? (entries.reduce((s, e) => s + (moodScore[e.mood] ?? 3), 0) / entries.length).toFixed(1)
    : null;

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const CustomDot = (props: { cx?: number; cy?: number; value?: number }) => {
    const { cx, cy } = props;
    if (cx == null || cy == null) return null;
    return <circle cx={cx} cy={cy} r={4} fill="#8b5cf6" stroke="white" strokeWidth={2} />;
  };

  return (
    <div className="flex flex-col">
      <div
        className="px-6 pt-10 pb-8"
        style={{ background: "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #fff 100%)" }}
      >
        <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Your progress</p>
        <div className="flex items-center gap-3 mb-1">
          <IllustrationInsights size={44} />
          <h1
            className="text-[26px] font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "'Khand', sans-serif" }}
          >
            Insights
          </h1>
        </div>
        <p className="text-sm text-slate-600 mt-1">Understanding your emotional patterns</p>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div data-testid="avg-mood-card" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <IllustrationBreathe size={32} />
              <p className="text-[13px] font-bold text-gray-700">Avg. Mood</p>
            </div>
            <p className="text-3xl font-bold text-violet-600">{avgMood ?? "—"}</p>
            <p className="text-[10px] text-slate-600 mt-1">out of 5.0</p>
          </div>
          <div data-testid="top-mood-card" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <IllustrationRelax size={32} />
              <p className="text-[13px] font-bold text-gray-700">Most Common</p>
            </div>
            {topMood ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ background: moodDot[topMood] ?? "#9ca3af" }} />
                <p className="text-sm font-bold text-gray-800 capitalize">{topMood.replace("_", " ")}</p>
              </div>
            ) : (
              <p className="text-[10px] text-slate-600 mt-1">No data</p>
            )}
          </div>
        </div>

        {/* Mood trend chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <IllustrationInsights size={28} />
            <h3 className="text-[15px] font-bold text-gray-800">Mood Trend (last 7 days)</h3>
          </div>
          {isLoading ? (
            <div className="h-36 bg-gray-50 rounded-xl animate-pulse" />
          ) : chartData.length === 0 ? (
            <div data-testid="no-chart-data" className="h-36 flex items-center justify-center">
              <p className="text-sm text-slate-600">Log your mood to see trends here</p>
            </div>
          ) : (
            <div data-testid="mood-chart" style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #ede9fe", borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => [`${v}`, "Mood"]}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#moodGrad)" dot={<CustomDot />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Mood breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-[15px] font-bold text-gray-800 mb-4">Mood Breakdown</h3>
          {Object.keys(moodCounts).length === 0 ? (
            <p className="text-sm text-slate-600 text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(moodCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div key={mood} data-testid={`breakdown-${mood}`} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${moodDot[mood] ?? "#9ca3af"}18` }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ background: moodDot[mood] ?? "#9ca3af" }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700 capitalize">{mood.replace("_", " ")}</span>
                        <span className="text-xs text-slate-600">{count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${(count / entries.length) * 100}%`, background: moodDot[mood] ?? "#8b5cf6" }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Motivational tip */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, #c4b5fd 0%, #f9a8d4 100%)" }}
        >
          <p className="text-xs font-bold text-violet-900 uppercase tracking-wide mb-1">Daily Insight</p>
          <p className="text-sm text-violet-900 font-medium leading-relaxed">
            "Tracking your mood consistently is the first step to understanding yourself better. You're doing great! 🌟"
          </p>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}
