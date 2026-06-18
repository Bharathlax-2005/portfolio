import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const COOKIE_NAME = "admin_session";

export function startupDiagnostics() {
  console.log({
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    hasPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
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
    throw new Error("ADMIN_PASSWORD_HASH is not a valid bcrypt hash.");
  }
}

export function signSession(email: string): string {
  return jwt.sign({ email }, validateSecret(), { expiresIn: "7d" });
}

export function verifySession(token: string): { email: string } | null {
  try {
    return jwt.verify(token, validateSecret()) as { email: string };
  } catch (error) {
    console.error("verifySession failed:", error);
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
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  validatePasswordHash(hash);
  return bcrypt.compare(plain, hash);
}
