/**
 * In-memory session store (mock).
 * Replace with Redis/DB in production.
 * Uses globalThis so sessions survive Next.js dev hot reload / refresh.
 */

const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

export interface SessionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
}

export interface Session {
  session_id: string;
  user: SessionUser;
  created_at: number;
  expires_at: number;
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
 */
export function createSession(user: SessionUser): Session {
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
 * Get session by id. Returns null if not found or expired.
 */
export function getSession(sessionId: string): Session | null {
  cleanupExpired();
  const session = sessions.get(sessionId) ?? null;
  if (!session || isExpired(session)) {
    if (session) sessions.delete(sessionId);
    return null;
  }
  return session;
}

/**
 * Delete a session (e.g. on logout).
 */
export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}

/**
 * Update user data on an existing session (e.g. after profile update).
 */
export function updateSessionUser(
  sessionId: string,
  updates: Partial<SessionUser>
): Session | null {
  const session = getSession(sessionId);
  if (!session) return null;
  session.user = { ...session.user, ...updates };
  return session;
}
