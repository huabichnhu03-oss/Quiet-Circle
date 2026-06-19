function IllustrationPlan({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="6" y="4" width="28" height="32" rx="5" fill="#ede9fe" />
      <rect x="6" y="4" width="28" height="32" rx="5" fill="url(#planGrad)" />
      <defs>
        <linearGradient id="planGrad" x1="6" y1="4" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="11" y="11" width="14" height="2.5" rx="1.25" fill="#7c3aed" opacity="0.7" />
      <rect x="11" y="16" width="11" height="2.5" rx="1.25" fill="#7c3aed" opacity="0.5" />
      <rect x="11" y="21" width="12" height="2.5" rx="1.25" fill="#7c3aed" opacity="0.5" />
      <circle cx="9" cy="12.25" r="2" fill="#8b5cf6" opacity="0.8" />
      <path d="M8 12.25L9 13.5L11 11" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="17.25" r="2" fill="#c4b5fd" opacity="0.6" />
      <circle cx="9" cy="22.25" r="2" fill="#c4b5fd" opacity="0.6" />
      <rect x="10" y="27" width="8" height="1.5" rx="0.75" fill="#7c3aed" opacity="0.3" />
    </svg>
  );
}

function IllustrationRelax({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#d1fae5" />
      <circle cx="20" cy="20" r="16" fill="url(#relaxGrad)" />
      <defs>
        <linearGradient id="relaxGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="22" rx="7" ry="4" fill="#059669" opacity="0.15" />
      <rect x="18" y="12" width="4" height="12" rx="2" fill="#059669" opacity="0.6" />
      <path d="M14 17 Q17 13 20 16" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 17 Q23 13 20 16" stroke="#10b981" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="17" y="24" width="6" height="2" rx="1" fill="#059669" opacity="0.5" />
      <circle cx="13" cy="14" r="1.5" fill="#34d399" opacity="0.7" />
      <circle cx="27" cy="14" r="1.5" fill="#34d399" opacity="0.7" />
    </svg>
  );
}

function IllustrationMilestone({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#fef3c7" />
      <circle cx="20" cy="20" r="16" fill="url(#trophyGrad)" />
      <defs>
        <linearGradient id="trophyGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M14 11 H26 V21 C26 25 23 27 20 27 C17 27 14 25 14 21 Z" fill="#f59e0b" opacity="0.75" />
      <rect x="18" y="27" width="4" height="3" rx="1" fill="#d97706" opacity="0.6" />
      <rect x="15" y="30" width="10" height="2" rx="1" fill="#d97706" opacity="0.5" />
      <path d="M14 14 H10 C10 19 13 21 15 21" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 14 H30 C30 19 27 21 25 21" stroke="#f59e0b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M17 18 L19 21 L23 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IllustrationBreathe({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#ede9fe" />
      <circle cx="20" cy="20" r="16" fill="url(#breatheGrad)" />
      <defs>
        <linearGradient id="breatheGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c3aed" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="7" fill="#8b5cf6" opacity="0.25" />
      <circle cx="20" cy="20" r="4.5" fill="#8b5cf6" opacity="0.5" />
      <path d="M20 11 Q24 15 20 18" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M29 20 Q25 24 22 20" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M20 29 Q16 25 20 22" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M11 20 Q15 16 18 20" stroke="#7c3aed" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function IllustrationJournal({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="7" y="5" width="24" height="30" rx="4" fill="#fce7f3" />
      <rect x="7" y="5" width="24" height="30" rx="4" fill="url(#journalGrad)" />
      <defs>
        <linearGradient id="journalGrad" x1="7" y1="5" x2="31" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbcfe8" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <rect x="7" y="5" width="5" height="30" rx="3" fill="#ec4899" opacity="0.2" />
      <rect x="13" y="12" width="14" height="2" rx="1" fill="#be185d" opacity="0.5" />
      <rect x="13" y="17" width="10" height="2" rx="1" fill="#be185d" opacity="0.4" />
      <rect x="13" y="22" width="12" height="2" rx="1" fill="#be185d" opacity="0.4" />
      <rect x="13" y="27" width="8" height="2" rx="1" fill="#be185d" opacity="0.3" />
      <path d="M25 8 L27 6 L30 9 L28 11 Z" fill="#ec4899" opacity="0.6" />
    </svg>
  );
}

function IllustrationInsights({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="4" y="4" width="32" height="32" rx="8" fill="#dbeafe" />
      <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#insightGrad)" />
      <defs>
        <linearGradient id="insightGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bfdbfe" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="9" y="25" width="4" height="8" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="15" y="19" width="4" height="14" rx="2" fill="#3b82f6" opacity="0.7" />
      <rect x="21" y="22" width="4" height="11" rx="2" fill="#3b82f6" opacity="0.6" />
      <rect x="27" y="14" width="4" height="19" rx="2" fill="#3b82f6" opacity="0.8" />
      <path d="M11 24 L17 18 L23 21 L29 13" stroke="#1d4ed8" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="24" r="1.5" fill="#1d4ed8" />
      <circle cx="17" cy="18" r="1.5" fill="#1d4ed8" />
      <circle cx="23" cy="21" r="1.5" fill="#1d4ed8" />
      <circle cx="29" cy="13" r="1.5" fill="#1d4ed8" />
    </svg>
  );
}

function IllustrationCommunity({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#ecfdf5" />
      <circle cx="20" cy="20" r="16" fill="url(#communityGrad)" />
      <defs>
        <linearGradient id="communityGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a7f3d0" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="15" r="4" fill="#059669" opacity="0.6" />
      <circle cx="12" cy="18" r="3" fill="#059669" opacity="0.45" />
      <circle cx="28" cy="18" r="3" fill="#059669" opacity="0.45" />
      <path d="M10 28 C10 23 14.5 21 20 21 C25.5 21 30 23 30 28" fill="#059669" opacity="0.3" />
      <path d="M6 28 C6 25 8.5 23.5 11 23" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      <path d="M34 28 C34 25 31.5 23.5 29 23" stroke="#059669" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function IllustrationSafety({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="16" fill="#fee2e2" />
      <circle cx="20" cy="20" r="16" fill="url(#safetyGrad)" />
      <defs>
        <linearGradient id="safetyGrad" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fecaca" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M20 10 L28 13.5 L28 20 C28 25 24.5 28.5 20 30 C15.5 28.5 12 25 12 20 L12 13.5 Z" fill="#ef4444" opacity="0.5" />
      <rect x="18.5" y="17" width="3" height="7" rx="1.5" fill="white" />
      <circle cx="20" cy="15.5" r="1.5" fill="white" />
    </svg>
  );
}

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
