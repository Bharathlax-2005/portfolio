import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test CJS interop at runtime
    let jwtOk = false;
    let bcryptOk = false;

    try {
      const jwtMod = await import("jsonwebtoken");
      const jwt = (jwtMod as any).default ?? jwtMod;
      jwtOk = typeof jwt.sign === "function";
    } catch { /* ignore */ }

    try {
      const bcryptMod = await import("bcryptjs");
      const bcrypt = (bcryptMod as any).default ?? bcryptMod;
      bcryptOk = typeof bcrypt.compare === "function";
    } catch { /* ignore */ }

    return res.status(200).json({
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
      passwordHashValid: /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(
        process.env.ADMIN_PASSWORD_HASH ?? ""
      ),
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV ?? "",
      vercelEnv: process.env.VERCEL_ENV ?? "",
      jwtImportOk: jwtOk,
      bcryptImportOk: bcryptOk,
    });
  } catch (error) {
    console.error("/api/debug/env error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
