import type { VercelRequest, VercelResponse } from "@vercel/node";
import { COOKIE_NAME, parseCookies, verifySession } from "./auth";

export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  const payload = token ? verifySession(token) : null;

  if (!payload) {
    res.status(401).json({ error: "Unauthorized. Please sign in again." });
    return false;
  }

  return true;
}
