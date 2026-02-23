/**
 * Mock OAuth user profiles. Replace with real provider user lookup in production.
 */

import type { SessionUser } from "./session_store";

export const MOCK_GOOGLE_USERS: Record<string, SessionUser> = {
  MOCK_GOOGLE_PRAKASIT: {
    id: "oauth_google_1",
    email: "prakasit.user@gmail.com",
    first_name: "Prakasit",
    last_name: "User",
    avatar_url: "https://ui-avatars.com/api/?name=Prakasit+User&background=e5e7eb&color=374151",
  },
  MOCK_GOOGLE_JANE: {
    id: "oauth_google_2",
    email: "jane.doe@gmail.com",
    first_name: "Jane",
    last_name: "Doe",
    avatar_url: "https://ui-avatars.com/api/?name=Jane+Doe&background=e5e7eb&color=374151",
  },
};

export const MOCK_APPLE_USERS: Record<string, SessionUser> = {
  MOCK_APPLE_DEMO: {
    id: "oauth_apple_1",
    email: "demo.partner@icloud.com",
    first_name: "Demo",
    last_name: "Partner",
    avatar_url: "https://ui-avatars.com/api/?name=Demo+Partner&background=e5e7eb&color=374151",
  },
  MOCK_APPLE_JOHN: {
    id: "oauth_apple_2",
    email: "john.apple@icloud.com",
    first_name: "John",
    last_name: "Apple",
    avatar_url: "https://ui-avatars.com/api/?name=John+Apple&background=e5e7eb&color=374151",
  },
};

export function getGoogleUserByCode(code: string): SessionUser | null {
  return MOCK_GOOGLE_USERS[code] ?? null;
}

export function getAppleUserByCode(code: string): SessionUser | null {
  return MOCK_APPLE_USERS[code] ?? null;
}
