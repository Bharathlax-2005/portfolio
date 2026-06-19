import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  buildSessionCookie,
  signSession,
  validatePasswordHash,
  verifyPassword,
  startupDiagnostics,
} from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    startupDiagnostics();

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
      console.error("[login] Missing env vars:", {
        hasAdminEmail: !!adminEmail,
        hasPasswordHash: !!adminPasswordHash,
      });
      return res.status(500).json({ error: "Admin credentials aren't configured on the server yet." });
    }

    try {
      validatePasswordHash(adminPasswordHash);
    } catch (validationError) {
      console.error("[login] Invalid ADMIN_PASSWORD_HASH:", validationError);
      return res.status(500).json({
        error: validationError instanceof Error ? validationError.message : String(validationError),
      });
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
  } catch (error) {
    console.error("[login] unhandled error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
