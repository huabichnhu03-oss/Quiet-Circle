import { useQuery } from "@tanstack/react-query";
import { type MoodEntry } from "@shared/schema";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { IllustrationInsights, IllustrationBreathe, IllustrationRelax } from "@/components/Illustrations";
import { PageHeader } from "@/components/PageHeader";
import { useTheme } from "@/hooks/use-theme";
import { THEME_CHART_ACCENT } from "@/lib/theme";
import { useUserProfile } from "@/hooks/use-user-profile";

const moodScore: Record<string, number> = {
  great: 5,
  good: 4,
  okay: 3,
  not_great: 2,
  bad: 1,
  happy: 4,
  neutral: 3,
  sad: 1,
};

const moodDot: Record<string, string> = {
  great: "#10b981",
  good: "var(--app-accent)",
  okay: "#f59e0b",
  not_great: "#f97316",
  bad: "#ef4444",
};

function formatDay(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function Insights() {
  const { theme } = useTheme();
  const chartAccent = THEME_CHART_ACCENT[theme];
  const { profile } = useUserProfile();

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
    return (
      <circle cx={cx} cy={cy} r={4} fill={chartAccent} stroke="white" strokeWidth={2} />
    );
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        eyebrow="Your progress"
        title="Insights"
        subtitle="Understanding your emotional patterns"
        illustration={<IllustrationInsights size={44} />}
      />

      <div className="px-4 sm:px-5 -mt-2 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div data-testid="avg-mood-card" className="app-card rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <IllustrationBreathe size={32} />
              <p className="text-[13px] font-bold text-[var(--app-text)]">Avg. Mood</p>
            </div>
            <p className="text-3xl font-bold text-[var(--app-primary)]">{avgMood ?? "—"}</p>
            <p className="text-[10px] text-[var(--app-muted)] mt-1">out of 5.0</p>
          </div>
          <div data-testid="top-mood-card" className="app-card rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <IllustrationRelax size={32} />
              <p className="text-[13px] font-bold text-[var(--app-text)]">Most Common</p>
            </div>
            {topMood ? (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: moodDot[topMood] ?? "var(--app-muted)" }}
                />
                <p className="text-sm font-bold text-[var(--app-text)] capitalize">
                  {topMood.replace("_", " ")}
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-[var(--app-muted)] mt-1">No data</p>
            )}
          </div>
        </div>

        <div className="app-card rounded-2xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <IllustrationInsights size={28} />
            <h3 className="text-[15px] font-bold text-[var(--app-text)]">
              Mood Trend (last 7 days)
            </h3>
          </div>
          {isLoading ? (
            <div className="h-36 app-card-muted rounded-xl animate-pulse" />
          ) : chartData.length === 0 ? (
            <div data-testid="no-chart-data" className="h-36 flex items-center justify-center">
              <p className="text-sm text-[var(--app-muted)]">
                Log your mood to see trends here
              </p>
            </div>
          ) : (
            <div data-testid="mood-chart" style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartAccent} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chartAccent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--app-border)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "var(--app-muted)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[1, 5]}
                    tick={{ fontSize: 10, fill: "var(--app-muted)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--app-card-bg)",
                      border: "1px solid var(--app-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v}`, "Mood"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke={chartAccent}
                    strokeWidth={2.5}
                    fill="url(#moodGrad)"
                    dot={<CustomDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="app-card rounded-2xl shadow-sm p-5">
          <h3 className="text-[15px] font-bold text-[var(--app-text)] mb-4">Mood Breakdown</h3>
          {Object.keys(moodCounts).length === 0 ? (
            <p className="text-sm text-[var(--app-muted)] text-center py-4">No data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(moodCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([mood, count]) => (
                  <div key={mood} data-testid={`breakdown-${mood}`} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `color-mix(in srgb, ${moodDot[mood] ?? "var(--app-muted)"} 18%, transparent)`,
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ background: moodDot[mood] ?? "var(--app-muted)" }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-[var(--app-text)] capitalize">
                          {mood.replace("_", " ")}
                        </span>
                        <span className="text-xs text-[var(--app-muted)]">{count}</span>
                      </div>
                      <div className="h-1.5 app-card-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / entries.length) * 100}%`,
                            background: moodDot[mood] ?? chartAccent,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-5 app-insight-panel">
          <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-80">
            Daily Insight
          </p>
          <p className="text-sm font-medium leading-relaxed">
            {profile.dailyInsight}
          </p>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}
