import "dotenv/config";
import { getResendStatus, sendTestEmail } from "../server/email";

const to = process.argv[2] || process.env.RESEND_TEST_TO;

async function main() {
  const status = getResendStatus();
  console.log("Resend status:", status);

  if (!status.configured) {
    console.error("\nRESEND_API_KEY is missing.");
    console.error("1. Sign up at https://resend.com/api-keys");
    console.error("2. Create an API key");
    console.error("3. Add RESEND_API_KEY=re_... to your .env file");
    process.exit(1);
  }

  if (!to) {
    console.error("\nUsage: npm run test:resend -- you@example.com");
    console.error("Or set RESEND_TEST_TO in .env");
    process.exit(1);
  }

  const result = await sendTestEmail(to);
  if (!result.ok) {
    console.error("\nSend failed:", result.error);
    process.exit(1);
  }

  console.log(`\nTest email sent to ${to} (id: ${result.id})`);
}

main();
