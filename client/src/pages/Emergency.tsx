import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { type Contact } from "@shared/schema";
import { IconArrowLeft } from "@/components/Icons";

type EmergencyState = "idle" | "notifying" | "done";

export default function Emergency() {
  const [state, setState] = useState<EmergencyState>("idle");
  const [, setLocation] = useLocation();

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const handleSOS = () => {
    if (state !== "idle") return;
    setState("notifying");
    setTimeout(() => setState("done"), 3000);
  };

  return (
    <div className="flex flex-col min-h-full relative">
      {/* Back */}
      <div className="flex items-center gap-3 px-5 pt-5 mb-2">
        <button
          data-testid="button-back"
          onClick={() => setLocation("/")}
          className="w-9 h-9 flex items-center justify-center rounded-2xl bg-white border border-slate-300"
        >
          <IconArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Emergency Alert</h1>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* SOS Button */}
        <div className="relative mb-8">
          {/* Pulse rings when notifying */}
          {state === "notifying" && (
            <>
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "rgba(239,68,68,0.2)" }}
              />
              <div
                className="absolute -inset-4 rounded-full animate-ping"
                style={{ background: "rgba(239,68,68,0.1)", animationDelay: "0.3s" }}
              />
            </>
          )}
          <button
            data-testid="button-sos"
            onClick={handleSOS}
            disabled={state !== "idle"}
            className="w-40 h-40 rounded-full flex flex-col items-center justify-center shadow-2xl active:scale-95 transition-all duration-300 relative z-10"
            style={{
              background:
                state === "done"
                  ? "linear-gradient(135deg, #10b981, #34d399)"
                  : "linear-gradient(135deg, #ef4444, #f87171)",
              boxShadow:
                state === "notifying"
                  ? "0 0 60px rgba(239,68,68,0.6), 0 20px 60px rgba(239,68,68,0.4)"
                  : "0 12px 40px rgba(239,68,68,0.35)",
            }}
          >
            {state === "done" ? (
              <>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M12 24L20 32L36 16" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white font-bold text-sm mt-1">Sent!</span>
              </>
            ) : (
              <>
                <span className="text-white font-black text-3xl leading-none">SOS</span>
                <span className="text-white/80 text-xs font-medium mt-1">
                  {state === "notifying" ? "Sending..." : "Hold to alert"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Status message */}
        <div className="text-center mb-8">
          {state === "idle" && (
            <p className="text-sm text-slate-600 leading-relaxed max-w-[240px]">
              Tap to immediately notify your safety circle that you need help.
            </p>
          )}
          {state === "notifying" && (
            <p className="text-sm font-semibold text-red-500 animate-pulse">
              Notifying your circle…
            </p>
          )}
          {state === "done" && (
            <p className="text-sm font-semibold text-emerald-600">
              Your circle has been notified. Help is on the way. 💚
            </p>
          )}
        </div>

        {/* Contact list */}
        {contacts.length > 0 && (
          <div className="w-full">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mb-3 text-center">
              {state === "idle" ? "Your safety circle" : "Being notified"}
            </p>
            <div className="flex flex-col gap-2">
              {contacts.map((contact, i) => (
                <div
                  key={contact.id}
                  data-testid={`alert-contact-${contact.id}`}
                  className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-300"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)" }}
                  >
                    {contact.firstName[0]}{contact.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-xs text-slate-600">{contact.phone}</p>
                  </div>
                  {state === "notifying" && (
                    <div
                      className="w-5 h-5 rounded-full border-2 border-red-400 border-t-transparent animate-spin"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  )}
                  {state === "done" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.15" />
                      <path d="M8 12L11 15L16 9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {contacts.length === 0 && state === "idle" && (
          <div className="text-center bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="text-xs text-amber-700 font-medium">
              No contacts in your safety circle yet.{" "}
              <a href="/contacts/new" className="underline font-bold">Add someone now.</a>
            </p>
          </div>
        )}
      </div>

      {/* Cancel if notifying */}
      {state === "notifying" && (
        <div className="px-8 pb-8">
          <button
            data-testid="button-cancel-alert"
            onClick={() => setState("idle")}
            className="w-full py-3 rounded-2xl border border-slate-300 text-sm font-medium text-slate-600 bg-white"
          >
            Cancel Alert
          </button>
        </div>
      )}
    </div>
  );
}
