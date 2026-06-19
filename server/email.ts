import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

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

export async function sendMagicLinkEmail(
  to: string,
  link: string,
  req?: { get: (name: string) => string | undefined },
) {
  const from =
    process.env.RESEND_FROM_EMAIL ?? "MoodMind <onboarding@resend.dev>";

  if (!resend) {
    console.log(`[auth] RESEND_API_KEY not set — magic link for ${to}:`);
    console.log(link);
    return;
  }

  await resend.emails.send({
    from,
    to,
    subject: "Your MoodMind sign-in link",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #7c3aed; font-size: 24px;">Sign in to MoodMind</h1>
        <p style="color: #475569; line-height: 1.6;">
          Tap the button below to sign in. This link expires in 15 minutes.
        </p>
        <a href="${link}"
           style="display: inline-block; margin: 24px 0; padding: 14px 28px;
                  background: linear-gradient(135deg, #7c3aed, #a855f7);
                  color: white; text-decoration: none; border-radius: 16px;
                  font-weight: 600;">
          Sign in to MoodMind
        </a>
        <p style="color: #94a3b8; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}
