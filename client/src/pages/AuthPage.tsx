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
        className="flex-1 w-full overflow-x-hidden flex items-start sm:items-center justify-center px-4 py-6 sm:px-6 sm:py-10 box-border app-surface"
        style={{ paddingTop: "calc(1.5rem + var(--app-safe-top))" }}
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

        <div className="w-full max-w-[min(100%,24rem)] min-w-0 mx-auto animate-fade-up box-border">
          <div className="text-center mb-5 sm:mb-8">
            <div
              className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-lg btn-gradient"
            >
              <Heart size={28} color="white" strokeWidth={1.75} />
            </div>
            <h1
              className="text-3xl font-bold text-[var(--app-text)] app-brand"
              data-testid="text-login-title"
            >
              {brandName}
            </h1>
            <p className="text-sm text-[var(--app-muted)] mt-1">
              Your mental wellness journey
            </p>
          </div>

          <div className="w-full min-w-0 rounded-3xl shadow-xl p-4 sm:p-6 box-border glass-card">
            <div className="flex rounded-2xl p-1 mb-4 sm:mb-5 app-card-muted">
              <button
                type="button"
                data-testid="tab-signin"
                onClick={() => navigate("/login")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === "signup"
                    ? "app-card text-[var(--app-primary)] shadow-sm"
                    : "text-[var(--app-muted)]"
                }`}
              >
                Sign up
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[var(--app-text)] mb-1">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--app-muted)] mb-4">
              {mode === "signin"
                ? "Sign in to continue your wellness journey."
                : "Join a supportive space for your mental health."}
            </p>

            {clerkUnavailable ? (
              <p
                className="text-sm text-[var(--app-muted)] text-center py-8 leading-relaxed"
                data-testid="text-auth-error"
              >
                {clerkError}
              </p>
            ) : mode === "signin" ? (
              <div className="auth-clerk-embed">
                <SignIn
                  routing="path"
                  path="/login"
                  signUpUrl="/sign-up"
                  appearance={getEmbeddedClerkAppearance(theme)}
                />
              </div>
            ) : (
              <div className="auth-clerk-embed">
                <SignUp
                  routing="path"
                  path="/sign-up"
                  signInUrl="/login"
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
