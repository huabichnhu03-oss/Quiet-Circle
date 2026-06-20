import "dotenv/config";
import { clerkClient } from "@clerk/express";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@moodmind.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "MoodMindPreview2026!";

async function main() {
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY is not set in .env");
    process.exit(1);
  }

  const existing = await clerkClient.users.getUserList({
    emailAddress: [ADMIN_EMAIL],
  });

  if (existing.data.length > 0) {
    const user = existing.data[0];
    await clerkClient.users.updateUser(user.id, {
      publicMetadata: { ...user.publicMetadata, role: "admin" },
      bypassClientTrust: true,
    });
    console.log("Admin account already exists — updated to bypass device verification.");
    console.log(`Email:    ${ADMIN_EMAIL}`);
    console.log(`Password: (unchanged — use existing password or reset in Clerk dashboard)`);
    console.log(`User ID:  ${user.id}`);
    return;
  }

  const user = await clerkClient.users.createUser({
    emailAddress: [ADMIN_EMAIL],
    password: ADMIN_PASSWORD,
    firstName: "Admin",
    lastName: "Preview",
    publicMetadata: { role: "admin" },
    bypassClientTrust: true,
    skipPasswordChecks: true,
  });

  console.log("Admin preview account created.");
  console.log(`Email:    ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log(`User ID:  ${user.id}`);
  console.log("\nSign in at http://localhost:5000/login");
}

main().catch((err) => {
  console.error("Failed to create admin account:", err?.errors ?? err?.message ?? err);
  process.exit(1);
});
