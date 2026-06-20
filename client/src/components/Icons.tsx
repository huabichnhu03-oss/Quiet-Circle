import {
  Angry,
  ArrowLeft,
  Bed,
  Bell,
  Bookmark,
  Bot,
  ChevronRight,
  Frown,
  Headphones,
  Heart,
  Home,
  Laugh,
  LayoutGrid,
  Meh,
  Menu,
  MessageCircle,
  Moon,
  Pause,
  PenLine,
  Phone,
  Play,
  Plus,
  Search,
  Shield,
  SkipBack,
  SkipForward,
  Smile,
  Sparkles,
  Star,
  Sun,
  TriangleAlert,
  User,
  Users,
  Volume2,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

type IconProps = {
  size?: number;
  color?: string;
  active?: boolean;
  filled?: boolean;
  className?: string;
};

const STROKE = 1.75;
const INACTIVE = "#9ca3af";

function resolveColor(active: boolean | undefined, color: string | undefined, inactive = INACTIVE) {
  if (color) return color;
  return active ? "white" : inactive;
}

function LineIcon({
  icon: Icon,
  size = 20,
  color,
  active,
  filled,
  inactiveColor = INACTIVE,
  className,
}: IconProps & { icon: LucideIcon; inactiveColor?: string }) {
  const resolved = resolveColor(active, color, inactiveColor);
  return (
    <Icon
      size={size}
      strokeWidth={STROKE}
      color={resolved}
      fill={filled ? resolved : "none"}
      className={className}
    />
  );
}

export type MoodLevel = "struggling" | "low" | "okay" | "good" | "great";

const MOOD_ICONS: Record<MoodLevel, LucideIcon> = {
  struggling: Angry,
  low: Frown,
  okay: Meh,
  good: Smile,
  great: Laugh,
};

function IconMood({
  level,
  size = 24,
  color = "var(--app-text)",
  className,
}: {
  level: MoodLevel;
  size?: number;
  color?: string;
  className?: string;
}) {
  const Icon = MOOD_ICONS[level];
  return <Icon size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconHome(props: IconProps) {
  return <LineIcon icon={Home} {...props} />;
}

function IconJournal(props: IconProps) {
  return <LineIcon icon={BookOpen} {...props} />;
}

function IconCommunity(props: IconProps) {
  return <LineIcon icon={Users} {...props} />;
}

function IconResources(props: IconProps) {
  return <LineIcon icon={LayoutGrid} {...props} />;
}

function IconSafety(props: IconProps) {
  return <LineIcon icon={Shield} {...props} />;
}

function IconProfile(props: IconProps) {
  return <LineIcon icon={User} {...props} />;
}

function IconCheckIn(props: IconProps) {
  return <LineIcon icon={Smile} {...props} />;
}

function IconPlus({ size = 20, color = "white", className }: IconProps) {
  return <Plus size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconArrowLeft({ size = 20, color = "#374151", className }: IconProps) {
  return <ArrowLeft size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconSearch({ size = 18, color = INACTIVE, className }: IconProps) {
  return <Search size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconPhone({ size = 16, color = "#10b981", className }: IconProps) {
  return <Phone size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconHeart({ size = 14, color = "#ef4444", filled = false, className }: IconProps) {
  return (
    <Heart
      size={size}
      strokeWidth={STROKE}
      color={color}
      fill={filled ? color : "none"}
      className={className}
    />
  );
}

function IconMenu({ size = 18, color = "#4b5563", className }: IconProps) {
  return <Menu size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconBell({ size = 18, color = "#4b5563", className }: IconProps) {
  return <Bell size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconBed({ size = 20, color = "#6366f1", className }: IconProps) {
  return <Bed size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconChevronRight({ size = 16, color = "#d1d5db", className }: IconProps) {
  return <ChevronRight size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconPen({ size = 16, color = "white", className }: IconProps) {
  return <PenLine size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconPlay({ size = 14, color = "white", className }: IconProps) {
  return <Play size={size} strokeWidth={STROKE} color={color} fill={color} className={className} />;
}

function IconPause({ size = 14, color = "white", className }: IconProps) {
  return <Pause size={size} strokeWidth={STROKE} color={color} fill={color} className={className} />;
}

function IconVolume({ size = 14, color = INACTIVE, className }: IconProps) {
  return <Volume2 size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconSkipBack({ size = 12, color = INACTIVE, className }: IconProps) {
  return <SkipBack size={size} strokeWidth={STROKE} color={color} fill={color} className={className} />;
}

function IconSkipForward({ size = 12, color = INACTIVE, className }: IconProps) {
  return <SkipForward size={size} strokeWidth={STROKE} color={color} fill={color} className={className} />;
}

function IconStar({ size = 16, color = "#fbbf24", className }: IconProps) {
  return <Star size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconAlert({ size = 20, color = "white", className }: IconProps) {
  return <TriangleAlert size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconBookmark({ size = 16, color = "var(--app-accent)", filled = false, className }: IconProps) {
  return (
    <Bookmark
      size={size}
      strokeWidth={STROKE}
      color={color}
      fill={filled ? color : "none"}
      className={className}
    />
  );
}

function IconMessageCircle({ size = 16, color = "var(--app-text)", className }: IconProps) {
  return <MessageCircle size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconUser({ size = 20, color = "var(--app-muted)", className }: IconProps) {
  return <User size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconSun({ size = 20, color = "#f59e0b", className }: IconProps) {
  return <Sun size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconHeadphones({ size = 24, color = "var(--app-accent)", className }: IconProps) {
  return <Headphones size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconMoon({ size = 16, color = "#10b981", className }: IconProps) {
  return <Moon size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconSparkles({ size = 16, color = "#ec4899", className }: IconProps) {
  return <Sparkles size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconBot({ size = 18, color = "var(--app-accent)", className }: IconProps) {
  return <Bot size={size} strokeWidth={STROKE} color={color} className={className} />;
}

function IconUsersGroup({ size = 40, color = "var(--app-accent)", className }: IconProps) {
  return <Users size={size} strokeWidth={STROKE} color={color} className={className} />;
}

export {
  IconHome,
  IconJournal,
  IconCommunity,
  IconResources,
  IconSafety,
  IconProfile,
  IconCheckIn,
  IconPlus,
  IconArrowLeft,
  IconSearch,
  IconPhone,
  IconHeart,
  IconMenu,
  IconBell,
  IconBed,
  IconChevronRight,
  IconPen,
  IconPlay,
  IconPause,
  IconVolume,
  IconSkipBack,
  IconSkipForward,
  IconStar,
  IconAlert,
  IconBookmark,
  IconMessageCircle,
  IconUser,
  IconSun,
  IconHeadphones,
  IconMoon,
  IconSparkles,
  IconBot,
  IconUsersGroup,
  IconMood,
};
