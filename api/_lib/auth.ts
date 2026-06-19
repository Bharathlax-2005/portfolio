/**
 * Auth utilities for Vercel serverless functions.
 *
 * IMPORTANT: jsonwebtoken and bcryptjs are CommonJS packages.
 * With `"type": "module"` in package.json, default imports may break
 * in Vercel's Node.js runtime. We use namespace imports + a `.default`
 * fallback pattern to guarantee CJS interop in every environment.
 */
import * as jwtModule from "jsonwebtoken";
import * as bcryptModule from "bcryptjs";

// CJS interop: in ESM runtimes the CJS `module.exports` object may appear
// at `.default` or directly on the namespace – handle both.
const jwt = (jwtModule as any).default ?? jwtModule;
const bcrypt = (bcryptModule as any).default ?? bcryptModule;

export const COOKIE_NAME = "admin_session";

export function startupDiagnostics() {
  console.log("[auth] startup diagnostics", {
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    passwordHashPrefix: process.env.ADMIN_PASSWORD_HASH?.substring(0, 7) ?? "(unset)",
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    jwtType: typeof jwt.sign,
    bcryptType: typeof bcrypt.compare,
  });
}

export function validateSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable.");
  }
  return secret;
}

export function validatePasswordHash(hash: string): void {
  if (!hash || typeof hash !== "string") {
    throw new Error("ADMIN_PASSWORD_HASH must be a valid bcrypt hash string.");
  }

  const bcryptRegex = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
  if (!bcryptRegex.test(hash)) {
    throw new Error(
      `ADMIN_PASSWORD_HASH is not a valid bcrypt hash. ` +
      `Received (first 10 chars): "${hash.substring(0, 10)}…"`
    );
  }
}

export function signSession(email: string): string {
  const secret = validateSecret();
  console.log("[auth] signSession: jwt.sign type =", typeof jwt.sign);
  return jwt.sign({ email }, secret, { expiresIn: "7d" });
}

export function verifySession(token: string): { email: string } | null {
  try {
    const secret = validateSecret();
    return jwt.verify(token, secret) as { email: string };
  } catch (error) {
    console.error("[auth] verifySession failed:", error);
    return null;
  }
}

export function parseCookies(header?: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx === -1) return;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  });
  return out;
}

export function buildSessionCookie(token: string): string {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${7 * 24 * 60 * 60}`,
  ];
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function buildLogoutCookie(): string {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  validatePasswordHash(hash);
  console.log("[auth] verifyPassword: bcrypt.compare type =", typeof bcrypt.compare);
  return bcrypt.compare(plain, hash);
}
