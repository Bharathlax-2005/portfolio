import type { VercelRequest, VercelResponse } from "@vercel/node";
import { COOKIE_NAME, parseCookies, verifySession } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];

  if (!token) {
    return res.status(200).json({ authenticated: false });
  }

  const payload = verifySession(token);
  if (!payload) {
    return res.status(200).json({ authenticated: false });
  }

  return res.status(200).json({ authenticated: true, email: payload.email });
}
