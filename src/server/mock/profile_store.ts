/**
 * In-memory profile store (mock).
 * Keyed by user id. Used to persist profile fields and avatar_url.
 */

import type { AccountProfile } from "@/types/account";

const globalForProfile = globalThis as unknown as {
  __hertzProfileStore?: Map<string, AccountProfile>;
};
const profiles = globalForProfile.__hertzProfileStore ?? new Map<string, AccountProfile>();
if (process.env.NODE_ENV !== "production") {
  globalForProfile.__hertzProfileStore = profiles;
}

export function getProfile(userId: string): AccountProfile | null {
  return profiles.get(userId) ?? null;
}

export function setProfile(userId: string, profile: AccountProfile): AccountProfile {
  profiles.set(userId, profile);
  return profile;
}

export function updateProfile(
  userId: string,
  updates: Partial<AccountProfile>,
  existing: AccountProfile
): AccountProfile {
  const updated: AccountProfile = { ...existing, ...updates };
  profiles.set(userId, updated);
  return updated;
}
