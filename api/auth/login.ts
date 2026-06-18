import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildSessionCookie, signSession, verifyPassword } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    return res.status(500).json({ error: "Admin credentials aren't configured on the server yet." });
  }

  if (String(email).toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const valid = await verifyPassword(password, adminPasswordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signSession(adminEmail);
  res.setHeader("Set-Cookie", buildSessionCookie(token));
  return res.status(200).json({ success: true });
}
