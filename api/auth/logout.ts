import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildLogoutCookie } from "../_lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    res.setHeader("Set-Cookie", buildLogoutCookie());
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[logout] unhandled error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
