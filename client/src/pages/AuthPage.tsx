import { Heart } from "lucide-react";
import { SignIn, SignUp } from "@clerk/react";
import { useLocation } from "wouter";
import { getEmbeddedClerkAppearance } from "@/lib/clerk-appearance";
import { useClerkReady } from "@/hooks/use-clerk-ready";
import { useTheme } from "@/hooks/use-theme";
import { getThemeBrandName } from "@/lib/theme";
import { PhoneShell } from "@/components/PhoneShell";

type AuthMode = "signin" | "signup";

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const [, navigate] = useLocation();
  const { clerkUnavailable, clerkError } = useClerkReady();
  const { theme } = useTheme();
  const brandName = getThemeBrandName(theme);

  return (
    <PhoneShell scrollable>
      <div
        className="w-full min-h-min flex flex-col items-center justify-start px-3 py-4 sm:px-5 sm:py-6 box-border app-surface"
        style={{
          paddingTop: "calc(0.75rem + var(--app-safe-top))",
          paddingBottom: "calc(1rem + var(--app-safe-bottom))",
        }}
      >
        <div
          className="pointer-events-none fixed top-[-80px] left-[-60px] w-64 h-64 rounded-full opacity-40 animate-float"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--app-accent) 40%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none fixed bottom-[-60px] right-[-40px] w-56 h-56 rounded-full opacity-30 animate-float-delay"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--app-primary) 30%, transparent) 0%, transparent 70%)",
          }}
        />

        <div className="w-full max-w-[min(100%,22rem)] min-w-0 mx-auto animate-fade-up box-border">
          <div className="text-center mb-3 sm:mb-4">
            <div className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center shadow-md btn-gradient">
              <Heart size={22} color="white" strokeWidth={1.75} />
            </div>
            <h1
              className="text-2xl font-bold text-[var(--app-text)] app-brand"
              data-testid="text-login-title"
            >
              {brandName}
            </h1>
            <p className="text-xs text-[var(--app-muted)] mt-0.5">
              Your mental wellness journey
            </p>
          </div>

          <div className="w-full min-w-0 rounded-2xl shadow-xl px-5 py-4 sm:px-6 sm:py-5 box-border glass-card overflow-visible">
            <div className="flex rounded-xl p-0.5 mb-2.5 app-card-muted">
              <button
                type="button"
                data-testid="tab-signin"
                onClick={() => navigate("/login")}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  mode === "signin"
                    ? "app-card text-[var(--app-primary)] shadow-sm"
                    : "text-[var(--app-muted)]"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                data-testid="tab-signup"
                onClick={() => navigate("/sign-up")}
                className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  mode === "signup"
                    ? "app-card text-[var(--app-primary)] shadow-sm"
                    : "text-[var(--app-muted)]"
                }`}
              >
                Sign up
              </button>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-[var(--app-text)] mb-0.5">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs text-[var(--app-muted)] mb-2.5">
              {mode === "signin"
                ? "Sign in to continue your wellness journey."
                : "Join a supportive space for your mental health."}
            </p>

            {clerkUnavailable ? (
              <p
                className="text-xs text-[var(--app-muted)] text-center py-4 leading-relaxed"
                data-testid="text-auth-error"
              >
                {clerkError}
              </p>
            ) : mode === "signin" ? (
              <div className="auth-clerk-embed auth-clerk-embed--compact">
                <SignIn
                  routing="path"
                  path="/login"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/"
                  signUpFallbackRedirectUrl="/sign-up"
                  appearance={getEmbeddedClerkAppearance(theme)}
                />
              </div>
            ) : (
              <div className="auth-clerk-embed auth-clerk-embed--compact">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/login"
                  fallbackRedirectUrl="/onboarding"
                  signInFallbackRedirectUrl="/login"
                  appearance={getEmbeddedClerkAppearance(theme)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}
