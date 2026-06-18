import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return res.status(200).json({
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV ?? "",
    });
  } catch (error) {
    console.error("/api/debug/env error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
