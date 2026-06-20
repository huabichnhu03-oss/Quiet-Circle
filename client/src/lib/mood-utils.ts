export const CHECKIN_MOOD_MAP: Record<string, string> = {
  sad: "bad",
  happy: "good",
  neutral: "okay",
};

export const MOOD_OPTIONS = [
  { id: "great", label: "Great" },
  { id: "good", label: "Good" },
  { id: "okay", label: "Okay" },
  { id: "not_great", label: "Not Great" },
  { id: "bad", label: "Bad" },
  { id: "sad", label: "Sadness" },
  { id: "happy", label: "Happies" },
  { id: "neutral", label: "Neutral" },
] as const;

export function moodDisplayLabel(mood: string) {
  return MOOD_OPTIONS.find((m) => m.id === mood)?.label ?? mood.replace("_", " ");
}
