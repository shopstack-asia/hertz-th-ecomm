/**
 * Stateless session (signed cookie) for serverless (e.g. Vercel).
 * Session data is stored in the cookie and verified with HMAC; no server-side store.
 * Set AUTH_SECRET in Vercel env for production.
 */

import { createHmac, timingSafeEqual } from "crypto";
import type { SessionUser } from "./session_store";

const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function getSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  // Fallback for dev only; production should set AUTH_SECRET
  return process.env.NODE_ENV === "production"
    ? "hertz-fallback-please-set-AUTH_SECRET"
    : "hertz-dev-secret-min-16";
}

function b64urlEncode(buf: Buffer): string {
  return buf.toString("base64url");
}

function b64urlDecode(str: string): Buffer | null {
  try {
    return Buffer.from(str, "base64url");
  } catch {
    return null;
  }
}

export interface StatelessPayload {
  user: SessionUser;
  exp: number;
  iat: number;
}

function sign(payload: StatelessPayload): string {
  const secret = getSecret();
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(Buffer.from(payloadJson, "utf8"));
  const sig = createHmac("sha256", secret).update(payloadB64).digest();
  const sigB64 = b64urlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyStatelessToken(token: string): StatelessPayload | null {
  const i = token.indexOf(".");
  if (i <= 0) return null;
  const payloadB64 = token.slice(0, i);
  const sigB64 = token.slice(i + 1);
  const payloadBuf = b64urlDecode(payloadB64);
  const sigBuf = b64urlDecode(sigB64);
  if (!payloadBuf || !sigBuf) return null;

  const expectedSig = createHmac("sha256", getSecret()).update(payloadB64).digest();
  if (expectedSig.length !== sigBuf.length || !timingSafeEqual(expectedSig, sigBuf)) return null;

  try {
    const payload: StatelessPayload = JSON.parse(payloadBuf.toString("utf8"));
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    if (!payload.user || typeof payload.user.id !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

export function createStatelessToken(user: SessionUser): string {
  const now = Date.now();
  const payload: StatelessPayload = {
    user,
    exp: now + TTL_MS,
    iat: now,
  };
  return sign(payload);
}
