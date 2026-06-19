function IconHome({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10.5L12 3L21 10.5V21H15V15H9V21H3V10.5Z" fill={c} rx="2" />
      <path d="M3 10.5L12 3L21 10.5V21H15V15H9V21H3V10.5Z" fill={c} />
    </svg>
  );
}

function IconJournal({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="14" height="20" rx="3" fill={c} />
      <rect x="7" y="7" width="8" height="1.5" rx="0.75" fill={active ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.6)"} />
      <rect x="7" y="11" width="8" height="1.5" rx="0.75" fill={active ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.6)"} />
      <rect x="7" y="15" width="5" height="1.5" rx="0.75" fill={active ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.6)"} />
      <rect x="2" y="4" width="3" height="16" rx="1.5" fill={active ? "rgba(255,255,255,0.4)" : "#d1d5db"} />
    </svg>
  );
}

function IconCommunity({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" fill={c} />
      <circle cx="5" cy="10" r="2.5" fill={c} opacity="0.7" />
      <circle cx="19" cy="10" r="2.5" fill={c} opacity="0.7" />
      <path d="M3 20C3 16.7 7 14 12 14C17 14 21 16.7 21 20" stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M1 20C1 18 3.5 16.5 6 16.2" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M23 20C23 18 20.5 16.5 18 16.2" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function IconResources({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="2.5" fill={c} />
      <rect x="13" y="3" width="8" height="8" rx="2.5" fill={c} opacity="0.7" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" fill={c} opacity="0.7" />
      <rect x="13" y="13" width="8" height="8" rx="2.5" fill={c} />
    </svg>
  );
}

function IconSafety({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={c} />
      <circle cx="12" cy="12" r="6" fill={active ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.5)"} />
      <text x="12" y="16" textAnchor="middle" fontSize="7" fontWeight="bold" fill={active ? "white" : "#6b7280"}>SOS</text>
    </svg>
  );
}

function IconProfile({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4.5" fill={c} />
      <path d="M3 21C3 17.1 7 14 12 14C17 14 21 17.1 21 21" stroke={c} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function IconCheckIn({ size = 20, active = false }: { size?: number; active?: boolean }) {
  const c = active ? "white" : "#9ca3af";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={c} />
      <circle cx="9" cy="10" r="1.5" fill={active ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)"} />
      <circle cx="15" cy="10" r="1.5" fill={active ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)"} />
      <path d="M8 15 Q12 19 16 15" stroke={active ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.7)"} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus({ size = 20, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function IconArrowLeft({ size = 20, color = "#374151" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSearch({ size = 18, color = "#9ca3af" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke={color} strokeWidth="2" />
      <path d="M15.5 15.5L20 20" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function IconPhone({ size = 16, color = "#10b981" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6.5 2H17.5C18.3 2 19 2.7 19 3.5V20.5C19 21.3 18.3 22 17.5 22H6.5C5.7 22 5 21.3 5 20.5V3.5C5 2.7 5.7 2 6.5 2Z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="19" r="1" fill={color} />
      <rect x="9" y="5" width="6" height="1.5" rx="0.75" fill={color} />
    </svg>
  );
}

function IconHeart({ size = 14, color = "#ef4444" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21C12 21 3 14 3 8C3 5.2 5.2 3 8 3C9.6 3 11 3.8 12 5C13 3.8 14.4 3 16 3C18.8 3 21 5.2 21 8C21 14 12 21 12 21Z" />
    </svg>
  );
}

function IconMenu({ size = 18, color = "#4b5563" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="2.2" rx="1.1" fill={color} />
      <rect x="3" y="11" width="14" height="2.2" rx="1.1" fill={color} />
      <rect x="3" y="16" width="18" height="2.2" rx="1.1" fill={color} />
    </svg>
  );
}

function IconBell({ size = 18, color = "#4b5563" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 10C6 7.2 8.7 5 12 5C15.3 5 18 7.2 18 10V16H6V10Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <path d="M4 16H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M10 16V18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconBed({ size = 20, color = "#6366f1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="12" width="20" height="7" rx="2" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5" />
      <path d="M2 12V8C2 7 2.7 6 4 6H20C21.3 6 22 7 22 8V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="8" width="8" height="4" rx="1.5" fill={color} opacity="0.35" />
      <path d="M2 17V20M22 17V20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronRight({ size = 16, color = "#d1d5db" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPen({ size = 16, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20L8.5 19L19 8.5C19.8 7.7 19.8 6.4 19 5.6L18.4 5C17.6 4.2 16.3 4.2 15.5 5L5 15.5L4 20Z" fill={color} opacity="0.9" />
      <path d="M15.5 5L19 8.5" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function IconPlay({ size = 14, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M6 4L20 12L6 20V4Z" />
    </svg>
  );
}

function IconPause({ size = 14, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <rect x="5" y="3" width="5" height="18" rx="2" />
      <rect x="14" y="3" width="5" height="18" rx="2" />
    </svg>
  );
}

function IconVolume({ size = 14, color = "#9ca3af" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9H3C2.4 9 2 9.4 2 10V14C2 14.6 2.4 15 3 15H6L11 19V5L6 9Z" fill={color} />
      <path d="M16 9C17.2 10 18 11 18 12C18 13 17.2 14 16 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19 6C21.2 7.8 22.5 9.8 22.5 12C22.5 14.2 21.2 16.2 19 18" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IconSkipBack({ size = 12, color = "#9ca3af" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M19 20L9 12L19 4V20Z" />
      <rect x="4" y="4" width="3" height="16" rx="1" />
    </svg>
  );
}

function IconSkipForward({ size = 12, color = "#9ca3af" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M5 4L15 12L5 20V4Z" />
      <rect x="17" y="4" width="3" height="16" rx="1" />
    </svg>
  );
}

function IconStar({ size = 16, color = "#fbbf24" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2L15.1 8.3L22 9.3L17 14.1L18.2 21L12 17.8L5.8 21L7 14.1L2 9.3L8.9 8.3L12 2Z" />
    </svg>
  );
}

function IconAlert({ size = 20, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L22 20H2L12 2Z" fill={color} opacity="0.2" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="11" y="9" width="2" height="5" rx="1" fill={color} />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  );
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
};
