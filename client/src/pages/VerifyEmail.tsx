import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const PASTEL_BG = "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)";

export default function VerifyEmail() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const email =
    params.get("email") ||
    sessionStorage.getItem("pending_email") ||
    "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Missing email. Please go back and create an account.");
      return;
    }
    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code. Please try again.");
        return;
      }

      sessionStorage.removeItem("pending_email");
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_name", data.name);

      if (data.isNewUser) {
        navigate("/onboarding");
      } else {
        localStorage.setItem("onboarded", "true");
        navigate("/");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setError("");
    setResent(false);

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not resend code.");
        return;
      }

      setResent(true);
      setCode("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-6"
      style={{ background: PASTEL_BG }}
    >
      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="2" />
              <path d="M3 7l9 6 9-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "'Khand', sans-serif" }}
            data-testid="text-verify-title"
          >
            Check your email
          </h1>
          <p className="text-sm text-slate-500">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-gray-700">{email || "your email"}</span>
          </p>
        </div>

        <div
          className="rounded-3xl shadow-xl overflow-hidden p-7"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.6)",
          }}
        >
          <form onSubmit={handleVerify} className="flex flex-col gap-6 items-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              data-testid="input-otp"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="rounded-xl border-gray-200 w-11 h-12" />
                <InputOTPSlot index={1} className="rounded-xl border-gray-200 w-11 h-12" />
                <InputOTPSlot index={2} className="rounded-xl border-gray-200 w-11 h-12" />
                <InputOTPSlot index={3} className="rounded-xl border-gray-200 w-11 h-12" />
                <InputOTPSlot index={4} className="rounded-xl border-gray-200 w-11 h-12" />
                <InputOTPSlot index={5} className="rounded-xl border-gray-200 w-11 h-12" />
              </InputOTPGroup>
            </InputOTP>

            {error && (
              <p data-testid="text-verify-error" className="text-xs text-red-500 text-center">
                {error}
              </p>
            )}

            {resent && (
              <p className="text-xs text-emerald-600 text-center">
                A new code has been sent to your email.
              </p>
            )}

            <button
              type="submit"
              data-testid="button-verify"
              disabled={loading || code.length !== 6}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              {loading ? "Verifying…" : "Verify email"}
            </button>
          </form>

          <div className="mt-5 flex flex-col items-center gap-2">
            <button
              type="button"
              data-testid="button-resend"
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 disabled:opacity-60"
            >
              {resending ? "Sending…" : "Resend code"}
            </button>
            <button
              type="button"
              data-testid="button-back-to-login"
              onClick={() => navigate("/login")}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
