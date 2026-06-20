import { Resend } from "resend";

let resendClient: Resend | null = null;

function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export function getResendFromEmail() {
  return process.env.RESEND_FROM_EMAIL ?? "MoodMind <onboarding@resend.dev>";
}

export function getResendStatus() {
  const configured = Boolean(process.env.RESEND_API_KEY);
  return {
    configured,
    from: getResendFromEmail(),
    mode: configured ? ("live" as const) : ("console-fallback" as const),
  };
}

export function getAppUrl(req?: { get: (name: string) => string | undefined }) {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const host = req?.get("host");
  if (host?.includes("localhost")) {
    return `http://${host}`;
  }
  if (host) {
    return `https://${host}`;
  }
  return "http://localhost:5000";
}

export async function sendVerificationCodeEmail(
  to: string,
  code: string,
) {
  const from = getResendFromEmail();
  const resend = getResendClient();

  if (!resend) {
    console.log(`[auth] RESEND_API_KEY not set — verification code for ${to}: ${code}`);
    return { ok: true as const, mode: "console-fallback" as const };
  }

  const { data, error } = await resend.emails.send(
    {
      from,
      to,
      subject: "Your MoodMind verification code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #7c3aed; font-size: 24px;">Verify your email</h1>
          <p style="color: #475569; line-height: 1.6;">
            Enter this code in MoodMind to confirm your account. It expires in 15 minutes.
          </p>
          <div style="margin: 32px 0; padding: 20px; background: #f5f3ff; border-radius: 16px; text-align: center;">
            <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #7c3aed;">
              ${code}
            </span>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">
            If you didn't create a MoodMind account, you can safely ignore this email.
          </p>
        </div>
      `,
    },
    { idempotencyKey: `verify-email/${to}/${code}` },
  );

  if (error) {
    console.error("Resend error:", error.message);
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, mode: "live" as const, id: data?.id };
}

export async function sendTestEmail(to: string) {
  const from = getResendFromEmail();
  const resend = getResendClient();

  if (!resend) {
    return {
      ok: false as const,
      error: "RESEND_API_KEY is not set. Add it to your .env file.",
    };
  }

  const { data, error } = await resend.emails.send(
    {
      from,
      to,
      subject: "MoodMind — Resend test",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #7c3aed;">Resend is working</h1>
          <p style="color: #475569;">Your MoodMind app can send emails successfully.</p>
        </div>
      `,
    },
    { idempotencyKey: `test-email/${to}` },
  );

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, id: data?.id };
}
