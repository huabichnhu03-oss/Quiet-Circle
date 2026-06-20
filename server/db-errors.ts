export function isDbConnectionError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;

  const code = (err as { code?: string }).code;
  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT") {
    return true;
  }

  if (err instanceof AggregateError) {
    return err.errors.some((nested) => isDbConnectionError(nested));
  }

  return false;
}

export function formatDbError(err: unknown): string {
  if (isDbConnectionError(err)) {
    return "Database is not reachable. Check DATABASE_URL or remove it to use local memory storage.";
  }

  const code = err && typeof err === "object" ? (err as { code?: string }).code : undefined;
  if (code === "42P01") {
    return 'Contacts table is missing. Run "npm run db:push" against your database.';
  }

  if (err instanceof AggregateError) {
    const nested = err.errors.find((e) => e instanceof Error && e.message);
    if (nested instanceof Error && nested.message) return nested.message;
  }

  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }

  return "Failed to save to the database.";
}
