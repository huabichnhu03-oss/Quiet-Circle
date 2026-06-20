import type { Response } from "express";
import { DEMO_CLERK_ID } from "@shared/constants";

type OwnedResource = { clerkId: string };

export function isDemoResource(resource: OwnedResource): boolean {
  return resource.clerkId === DEMO_CLERK_ID;
}

export function requireOwner(
  resource: OwnedResource | undefined,
  userId: string,
  res: Response,
): resource is OwnedResource {
  if (!resource) {
    res.status(404).json({ error: "Not found" });
    return false;
  }
  if (resource.clerkId !== userId) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  return true;
}

export function isReactionOnlyPatch(body: Record<string, unknown>): boolean {
  const keys = Object.keys(body);
  return keys.length > 0 && keys.every((key) => key === "likesCount" || key === "savesCount");
}
