function parseApiError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const match = error.message.match(/^\d+:\s*(.+)$/s);
  const body = match?.[1]?.trim() ?? error.message;

  try {
    const parsed = JSON.parse(body) as {
      error?: unknown;
      message?: string;
    };

    if (typeof parsed.message === "string" && parsed.message && parsed.message !== "Internal Server Error") {
      return parsed.message;
    }

    if (typeof parsed.error === "string" && parsed.error) {
      return parsed.error;
    }

    if (parsed.error && typeof parsed.error === "object") {
      const fieldErrors = (parsed.error as { fieldErrors?: Record<string, string[]> })
        .fieldErrors;
      if (fieldErrors) {
        const first = Object.values(fieldErrors).flat()[0];
        if (first) return first;
      }
    }
  } catch {
    if (body.includes("Unauthorized") || body.includes("401")) {
      return "Your session expired. Please sign in again.";
    }
    if (body.includes("relation") && body.includes("contacts")) {
      return "Contacts database is not set up yet. Run npm run db:push on the server.";
    }
    if (body.length < 180) return body;
  }

  return "Please check your details and try again.";
}

export { parseApiError };
