import "dotenv/config";
import { clerkClient } from "@clerk/express";

async function main() {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY is not set in .env");
    process.exit(1);
  }

  let offset = 0;
  let updated = 0;

  while (true) {
    const page = await clerkClient.users.getUserList({ limit: 100, offset });
    if (page.data.length === 0) break;

    for (const user of page.data) {
      if (user.bypassClientTrust) continue;
      await clerkClient.users.updateUser(user.id, { bypassClientTrust: true });
      updated += 1;
      console.log(`Bypass enabled: ${user.emailAddresses[0]?.emailAddress ?? user.id}`);
    }

    offset += page.data.length;
    if (offset >= page.totalCount) break;
  }

  console.log(`\nDone. Updated ${updated} user(s) to skip new-device verification.`);
}

main().catch((err) => {
  console.error("Failed:", err?.errors ?? err?.message ?? err);
  process.exit(1);
});
