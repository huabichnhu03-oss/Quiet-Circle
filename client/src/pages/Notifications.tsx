import { Link } from "wouter";
import { IconBell } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";

export default function Notifications() {
  return (
    <div className="flex flex-col min-h-full">
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        subtitle="Stay in the loop with your circle."
      />

      <div className="px-4 sm:px-5 pb-6 flex flex-col items-center text-center py-16" data-testid="empty-notifications">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 app-card-muted"
        >
          <IconBell size={28} />
        </div>
        <p className="text-sm text-[var(--app-muted)] font-medium">You&apos;re all caught up.</p>
        <p className="text-xs text-[var(--app-muted)] mt-1 max-w-[240px]">
          Check-ins, community replies, and safety circle alerts will show up here.
        </p>
        <Link href="/">
          <button
            type="button"
            data-testid="button-notifications-home"
            className="mt-6 btn-primary text-sm font-semibold px-5 py-2.5 rounded-full"
          >
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
