import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { type Contact } from "@shared/schema";
import {
  clearActiveSignal,
  contactInitials,
  getActiveSignal,
  getContactRouteInfo,
} from "@/lib/signal-map";
import { SignalMapView } from "@/components/SignalMapView";
import { IconArrowLeft } from "@/components/Icons";

export default function CompanionAlert() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/companion/alert/:contactId");
  const contactId = params?.contactId;
  const activeSignal = getActiveSignal();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const contact = contacts.find((c) => c.id === contactId);

  useEffect(() => {
    if (!contactId) {
      setLocation("/emergency");
    }
  }, [contactId, setLocation]);

  if (!contactId || !contact) {
    return (
      <div className="flex items-center justify-center min-h-full text-sm text-[var(--app-muted)]">
        Loading alert…
      </div>
    );
  }

  const routeInfo = getContactRouteInfo(contact);
  const personInNeed = activeSignal?.contactName
    ? "Someone in your circle"
    : "Circle member";

  const handleCancel = () => {
    clearActiveSignal();
    setLocation("/emergency");
  };

  return (
    <div className="flex flex-col min-h-full">
      <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-4 flex items-center gap-3 pointer-events-none">
        <button
          type="button"
          data-testid="button-back"
          onClick={() => setLocation(`/emergency/active/${contact.id}`)}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white/90 border border-[var(--app-border)] pointer-events-auto shadow-sm"
        >
          <IconArrowLeft size={18} />
        </button>
        <div className="flex-1 text-center">
          <span className="app-brand text-[13px] font-semibold text-[var(--app-primary)] bg-white/85 px-3 py-0.5 rounded-full shadow-sm">
            Companion
          </span>
        </div>
        <div className="w-9" />
      </div>

      <div data-testid="companion-alert-map" className="flex-1">
        <SignalMapView
          routeInfo={routeInfo}
          userLabel="Help"
          userPinText="!"
          contactLabel="You"
          contactPinText={contactInitials(contact.firstName, contact.lastName)}
          bottomSheet={
            <>
              <div className="rounded-xl px-3 py-2 mb-3 flex items-center gap-2 bg-red-50 border border-red-100">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-[11px] font-semibold text-red-700">
                  {personInNeed} needs help nearby
                </p>
              </div>

              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[15px] font-bold text-[var(--app-text)]">
                    Navigate to them
                  </p>
                  <p className="text-[11px] text-[var(--app-muted)]">
                    Follow the route to reach them safely
                  </p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  data-testid="button-call-contact"
                  className="w-11 h-11 rounded-full bg-[var(--app-primary)] flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6.5 2H17.5C18.3 2 19 2.7 19 3.5V20.5C19 21.3 18.3 22 17.5 22H6.5C5.7 22 5 21.3 5 20.5V3.5C5 2.7 5.7 2 6.5 2Z"
                      fill="white"
                      opacity="0.2"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </svg>
                </a>
              </div>

              <div className="flex gap-3 my-3">
                <div className="flex-1 app-card-muted rounded-xl px-3 py-2 text-center">
                  <p className="text-[18px] font-extrabold text-[var(--app-primary)]">
                    {routeInfo.distance}
                  </p>
                  <p className="text-[10px] text-[var(--app-muted)]">Distance</p>
                </div>
                <div className="flex-1 app-card-muted rounded-xl px-3 py-2 text-center">
                  <p className="text-[18px] font-extrabold text-[var(--app-accent)]">
                    {routeInfo.eta}
                  </p>
                  <p className="text-[10px] text-[var(--app-muted)]">Walk time</p>
                </div>
              </div>

              <p className="text-[11px] text-[var(--app-muted)] mb-3 leading-relaxed">
                The dashed route shows the best path to reach them. Stay on main streets and keep
                your phone accessible.
              </p>

              <button
                type="button"
                data-testid="button-cancel-companion-alert"
                onClick={handleCancel}
                className="w-full border border-[var(--app-primary)] text-[var(--app-primary)] text-[13px] font-semibold py-2.5 rounded-xl"
              >
                Cancel Alert
              </button>
            </>
          }
        />
      </div>
    </div>
  );
}
