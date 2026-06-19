import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";

const PASTEL_BG = "linear-gradient(160deg, #ede9fe 0%, #fce7f3 60%, #dbeafe 100%)";

export default function AuthVerify() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setErrorMsg("No token found in this link. Please request a new one.");
      setStatus("error");
      return;
    }

    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) {
          setErrorMsg(data.error || "Invalid or expired link.");
          setStatus("error");
          return;
        }
        // Store user info
        localStorage.setItem("user_email", data.email);
        if (data.name) localStorage.setItem("user_name", data.name);

        if (data.isNewUser) {
          // New users go through onboarding
          navigate("/onboarding");
        } else {
          // Existing users skip onboarding if already done
          localStorage.setItem("onboarded", "true");
          navigate("/");
        }
      })
      .catch(() => {
        setErrorMsg("Network error. Please try again.");
        setStatus("error");
      });
  }, [token, navigate]);

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-6"
      style={{ background: PASTEL_BG }}
    >
      <div className="w-full max-w-[380px] text-center animate-fade-up">
        <div
          className="w-16 h-16 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)" }}
        >
          {status === "loading" ? (
            <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
            </svg>
          )}
        </div>

        <h1
          className="text-2xl font-bold text-gray-800 mb-2"
          style={{ fontFamily: "'Khand', sans-serif" }}
        >
          {status === "loading" ? "Signing you in…" : "Link problem"}
        </h1>

        {status === "loading" && (
          <p className="text-sm text-slate-500">Just a moment while we verify your link.</p>
        )}

        {status === "error" && (
          <>
            <p className="text-sm text-slate-500 mb-6">{errorMsg}</p>
            <button
              data-testid="button-back-to-login"
              onClick={() => navigate("/login")}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white shadow-md active:scale-95 transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
            >
              Back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
