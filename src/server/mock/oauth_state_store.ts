/**
 * In-memory OAuth state store (CSRF protection).
 * Replace with Redis in production. TTL 5 minutes.
 */

const STATE_TTL_MS = 5 * 60 * 1000;

export type OAuthProvider = "GOOGLE" | "APPLE";

export interface OAuthStateEntry {
  next: string;
  provider: OAuthProvider;
  created_at: number;
}

const globalForOAuthState = globalThis as unknown as {
  __hertzOauthStateStore?: Map<string, OAuthStateEntry>;
};
const store = globalForOAuthState.__hertzOauthStateStore ?? new Map<string, OAuthStateEntry>();
if (process.env.NODE_ENV !== "production") {
  globalForOAuthState.__hertzOauthStateStore = store;
}

function isExpired(entry: OAuthStateEntry): boolean {
  return Date.now() > entry.created_at + STATE_TTL_MS;
}

function cleanup(): void {
  for (const [k, v] of store.entries()) {
    if (isExpired(v)) store.delete(k);
  }
}

function generateState(): string {
  return `st_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 16)}`;
}

export function createState(next: string, provider: OAuthProvider): string {
  cleanup();
  const state = generateState();
  store.set(state, { next, provider, created_at: Date.now() });
  return state;
}

export function consumeState(state: string): OAuthStateEntry | null {
  cleanup();
  const entry = store.get(state) ?? null;
  if (!entry || isExpired(entry)) {
    if (entry) store.delete(state);
    return null;
  }
  store.delete(state);
  return entry;
}

export function validateNext(next: string): boolean {
  if (!next || typeof next !== "string") return true;
  const decoded = decodeURIComponent(next);
  return decoded.startsWith("/") && !decoded.startsWith("//");
}
