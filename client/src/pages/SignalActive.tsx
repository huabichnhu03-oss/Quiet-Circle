import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { type Contact } from "@shared/schema";
import {
  clearActiveSignal,
  contactInitials,
  getContactRouteInfo,
} from "@/lib/signal-map";
import { SignalMapView } from "@/components/SignalMapView";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SignalActive() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/emergency/active/:contactId");
  const contactId = params?.contactId;
  const [showSentModal, setShowSentModal] = useState(true);
  const [show911, setShow911] = useState(false);

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
        Loading signal…
      </div>
    );
  }

  const routeInfo = getContactRouteInfo(contact);
  const fullName = `${contact.firstName} ${contact.lastName}`;

  const handleCancel = () => {
    setShowSentModal(false);
    setShow911(false);
    clearActiveSignal();
    setLocation("/emergency");
  };

  return (
    <>
      <div data-testid="signal-active-map" className="min-h-full">
        <SignalMapView
          routeInfo={routeInfo}
          userLabel="You"
          userPinText="ME"
          contactLabel={contact.firstName}
          contactPinText={contactInitials(contact.firstName, contact.lastName)}
          bottomSheet={
            <>
              <div className="app-tag rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--app-primary)] animate-pulse" />
                <p className="text-[11px] font-semibold text-[var(--app-primary)]">
                  Signal sent to {fullName}
                </p>
              </div>

              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[15px] font-bold text-[var(--app-text)]">{fullName}</p>
                  <p className="text-[11px] text-[var(--app-muted)]">{routeInfo.location}</p>
                </div>
                <button
                  type="button"
                  data-testid="button-call-911"
                  onClick={() => setShow911(true)}
                  className="w-11 h-11 rounded-full bg-[var(--app-primary)] flex items-center justify-center shadow-lg flex-shrink-0"
                >
                  <span className="text-white text-[11px] font-bold">911</span>
                </button>
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
                  <p className="text-[10px] text-[var(--app-muted)]">ETA</p>
                </div>
              </div>

              <button
                type="button"
                data-testid="button-cancel-alert"
                onClick={handleCancel}
                className="w-full border border-[var(--app-primary)] text-[var(--app-primary)] text-[13px] font-semibold py-2.5 rounded-xl mb-2"
              >
                Cancel Signal
              </button>

              <button
                type="button"
                data-testid="button-companion-preview"
                onClick={() => setLocation(`/companion/alert/${contact.id}`)}
                className="w-full text-[11px] font-medium text-[var(--app-muted)] py-1"
              >
                Preview companion view →
              </button>
            </>
          }
        />
      </div>

      <AlertDialog open={showSentModal} onOpenChange={setShowSentModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Signal Sent!</AlertDialogTitle>
            <AlertDialogDescription>
              {fullName} has been notified. If they do not respond, please find safety or contact
              emergency services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction data-testid="button-signal-sent-ok">I understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={show911} onOpenChange={setShow911}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You&apos;re about to call 911</AlertDialogTitle>
            <AlertDialogDescription>Are you sure?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Exit</AlertDialogCancel>
            <AlertDialogAction asChild>
              <a href="tel:911">Yes, call 911</a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
