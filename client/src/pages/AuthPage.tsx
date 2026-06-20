import { SignIn, SignUp } from "@clerk/react";
import { useLocation } from "wouter";
import { embeddedClerkAppearance } from "@/lib/clerk-appearance";

const PASTEL_BG = "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)";

type AuthMode = "signin" | "signup";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-6 py-10"
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
              <path
                d="M16 6C16 6 8 10 8 18C8 22.4 11.6 26 16 26C20.4 26 24 22.4 24 18C24 10 16 6 16 6Z"
                fill="white"
                opacity="0.9"
              />
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
              onClick={() => navigate("/login")}
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
              onClick={() => navigate("/sign-up")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === "signin"
                ? "Sign in to continue your wellness journey."
                : "Join MoodMind — a safe space for mental wellness."}
            </p>
          </div>

          {mode === "signin" ? (
            <SignIn
              routing="path"
              path="/login"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
              appearance={embeddedClerkAppearance}
            />
          ) : (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/login"
              fallbackRedirectUrl="/"
              appearance={embeddedClerkAppearance}
            />
          )}
        </div>
      </div>
    </div>
  );
}
