import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireApiAuth(req: Request, res: Response, next: NextFunction) {
  const auth = getAuth(req);
  if (!auth.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function getClerkStatus() {
  return {
    configured: Boolean(process.env.CLERK_SECRET_KEY),
    secretKeySet: Boolean(process.env.CLERK_SECRET_KEY),
  };
}
