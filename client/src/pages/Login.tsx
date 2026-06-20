import { useState } from "react";
import { useLocation } from "wouter";

const PASTEL_BG = "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)";

type Mode = "signin" | "signup";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            name: name.trim(),
          }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Something went wrong.");
          return;
        }

        sessionStorage.setItem("pending_email", email.trim());
        navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification) {
          sessionStorage.setItem("pending_email", data.email);
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }
        setError(data.error || "Something went wrong.");
        return;
      }

      localStorage.setItem("user_email", data.email);
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("onboarded", "true");
      navigate("/");
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
          <div className="flex rounded-2xl p-1 mb-5 bg-violet-50">
            <button
              type="button"
              data-testid="tab-signin"
              onClick={() => { setMode("signin"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === "signin"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              data-testid="tab-signup"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-slate-500">
                {mode === "signin"
                  ? "Sign in with your email and password."
                  : "We'll send a 6-digit code to verify your email."}
              </p>
            </div>

            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1" htmlFor="auth-name">
                  Name
                </label>
                <input
                  id="auth-name"
                  data-testid="input-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl px-4 py-3 text-sm bg-white border border-gray-200 text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-violet-300 transition-all"
                />
              </div>
            )}

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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600 ml-1" htmlFor="auth-password">
                Password
              </label>
              <input
                id="auth-password"
                data-testid="input-password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading
                ? mode === "signup"
                  ? "Creating account…"
                  : "Signing in…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
