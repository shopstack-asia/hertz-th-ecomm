/**
 * Session store: in-memory (dev) or stateless signed cookie (production/Vercel).
 * On Vercel, in-memory is not shared across instances, so set AUTH_SECRET to use stateless sessions.
 */

import {
  createStatelessToken,
  verifyStatelessToken,
} from "@/server/mock/stateless_session";

const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/** Consent persisted with user record (audit/compliance). */
export interface UserConsent {
  terms_version: string;
  privacy_version: string;
  marketing_opt_in: boolean;
  consent_timestamp: string;
}

export interface SessionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  loyalty_tier?: string;
  consent?: UserConsent;
}

export interface Session {
  session_id: string;
  user: SessionUser;
  created_at: number;
  expires_at: number;
}

/** Use stateless (signed cookie) on Vercel or when AUTH_SECRET is set. */
function shouldUseStatelessSession(): boolean {
  if (process.env.VERCEL === "1") return true;
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET;
  return Boolean(secret && secret.length >= 16);
}

function isStatelessToken(sessionId: string): boolean {
  return sessionId.includes(".");
}

const globalForSession = globalThis as unknown as { __hertzSessionStore?: Map<string, Session> };
const sessions = globalForSession.__hertzSessionStore ?? new Map<string, Session>();
if (process.env.NODE_ENV !== "production") {
  globalForSession.__hertzSessionStore = sessions;
}

function generateSessionId(): string {
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function isExpired(session: Session): boolean {
  return Date.now() > session.expires_at;
}

function cleanupExpired(): void {
  for (const [id, session] of sessions.entries()) {
    if (isExpired(session)) sessions.delete(id);
  }
}

/**
 * Create a new session for the user.
 * With AUTH_SECRET set, returns session_id as signed token (stateless).
 */
export function createSession(user: SessionUser): Session {
  if (shouldUseStatelessSession()) {
    const session_id = createStatelessToken(user);
    const now = Date.now();
    return {
      session_id,
      user,
      created_at: now,
      expires_at: now + TTL_MS,
    };
  }
  cleanupExpired();
  const session_id = generateSessionId();
  const now = Date.now();
  const session: Session = {
    session_id,
    user,
    created_at: now,
    expires_at: now + TTL_MS,
  };
  sessions.set(session_id, session);
  return session;
}

/**
 * Get session by id (or by stateless token). Returns null if not found or expired.
 */
export function getSession(sessionId: string): Session | null {
  if (shouldUseStatelessSession() && isStatelessToken(sessionId)) {
    const payload = verifyStatelessToken(sessionId);
    if (!payload) return null;
    return {
      session_id: sessionId,
      user: payload.user,
      created_at: payload.iat,
      expires_at: payload.exp,
    };
  }
  cleanupExpired();
  const session = sessions.get(sessionId) ?? null;
  if (!session || isExpired(session)) {
    if (session) sessions.delete(sessionId);
    return null;
  }
  return session;
}

/**
 * Delete a session (e.g. on logout). No-op for stateless; caller clears cookie.
 */
export function deleteSession(sessionId: string): void {
  if (shouldUseStatelessSession() && isStatelessToken(sessionId)) return;
  sessions.delete(sessionId);
}

/**
 * Update user data on an existing session (e.g. after profile update).
 * In stateless mode returns a new Session with new session_id; caller must set cookie.
 */
export function updateSessionUser(
  sessionId: string,
  updates: Partial<SessionUser>
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  const updatedUser = { ...session.user, ...updates };
  if (shouldUseStatelessSession() && isStatelessToken(sessionId)) {
    return createSession(updatedUser);
  }
  session.user = updatedUser;
  return session;
}
