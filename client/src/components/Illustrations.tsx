import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Leaf,
  Shield,
  Trophy,
  Users,
  Wind,
  type LucideIcon,
} from "lucide-react";

const STROKE = 1.75;

function FlatIconBadge({
  icon: Icon,
  color,
  size = 40,
}: {
  icon: LucideIcon;
  color: string;
  size?: number;
}) {
  const iconSize = Math.round(size * 0.45);
  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
      }}
    >
      <Icon size={iconSize} strokeWidth={STROKE} color={color} />
    </div>
  );
}

function makeIllustration(icon: LucideIcon, color: string) {
  return function Illustration({ size = 40 }: { size?: number }) {
    return <FlatIconBadge icon={icon} color={color} size={size} />;
  };
}

const IllustrationPlan = makeIllustration(ClipboardList, "#7c3aed");
const IllustrationRelax = makeIllustration(Leaf, "#10b981");
const IllustrationMilestone = makeIllustration(Trophy, "#f59e0b");
const IllustrationBreathe = makeIllustration(Wind, "#7c3aed");
const IllustrationJournal = makeIllustration(BookOpen, "#ec4899");
const IllustrationInsights = makeIllustration(BarChart3, "#3b82f6");
const IllustrationCommunity = makeIllustration(Users, "#10b981");
const IllustrationSafety = makeIllustration(Shield, "#ef4444");

export {
  IllustrationPlan,
  IllustrationRelax,
  IllustrationMilestone,
  IllustrationBreathe,
  IllustrationJournal,
  IllustrationInsights,
  IllustrationCommunity,
  IllustrationSafety,
};
