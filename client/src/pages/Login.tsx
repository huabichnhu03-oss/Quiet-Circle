import { useState } from "react";

const PASTEL_BG = "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-6"
      style={{ background: PASTEL_BG }}
    >
      <div
        className="pointer-events-none fixed top-[-80px] left-[-60px] w-64 h-64 rounded-full opacity-40 animate-float"
        style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[-60px] right-[-40px] w-56 h-56 rounded-full opacity-30 animate-float-delay"
        style={{ background: "radial-gradient(circle, #fbcfe8 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-[380px] animate-fade-up">
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 6C16 6 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 6 16 6Z" fill="white" opacity="0.9" />
              <circle cx="16" cy="18" r="4" fill="white" opacity="0.6" />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold text-gray-800"
            style={{ fontFamily: "'Khand', sans-serif" }}
            data-testid="text-login-title"
          >
            MoodMind
          </h1>
          <p className="text-sm text-slate-500 mt-1">Your mental wellness journey</p>
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
          {sent ? (
            <div className="text-center">
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: "rgba(124, 58, 237, 0.12)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="3" stroke="#7c3aed" strokeWidth="2" />
                  <path d="M3 7l9 6 9-6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-2">Check your email</h2>
              <p className="text-sm text-slate-500 mb-6">
                We sent a sign-in link to{" "}
                <span className="font-semibold text-gray-700">{email}</span>.
                Click the link in the email to continue.
              </p>
              <button
                type="button"
                data-testid="button-back-to-form"
                onClick={() => setSent(false)}
                className="text-sm font-semibold text-violet-600 hover:text-violet-700"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Sign in with email</h2>
                <p className="text-sm text-slate-500">
                  No password needed — we'll email you a secure link.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1" htmlFor="auth-email">
                  Email address
                </label>
                <input
                  id="auth-email"
                  data-testid="input-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm bg-white border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                />
              </div>

              {error && (
                <p data-testid="text-auth-error" className="text-xs text-red-500 text-center">
                  {error}
                </p>
              )}

              <button
                data-testid="button-submit"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:scale-100"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                {loading ? "Sending link…" : "Email me a sign-in link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
