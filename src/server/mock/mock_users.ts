/**
 * Mock users for login (presentation/testing).
 * Replace with real auth/CS integration in production.
 */

import type { SessionUser } from "./session_store";

export interface MockUserCredentials {
  user: SessionUser;
  /** Mock: plain password for testing. */
  password: string;
}

const MOCK_USERS: MockUserCredentials[] = [
  {
    user: {
      id: "u_001",
      first_name: "Prakasit",
      last_name: "Kitrakham",
      email: "sit@mail.com",
      phone: "+66812345678",
    },
    password: "demo",
  },
  {
    user: {
      id: "u_002",
      first_name: "Siri",
      last_name: "Wattana",
      email: "siri@example.com",
      phone: "+66887654321",
    },
    password: "demo",
  },
];

export function findMockUserByEmail(email: string): MockUserCredentials | undefined {
  const normalized = email?.trim().toLowerCase();
  if (!normalized) return undefined;
  return MOCK_USERS.find((m) => m.user.email === normalized);
}

export function validateMockLogin(email: string, password: string): SessionUser | null {
  const creds = findMockUserByEmail(email);
  if (!creds || String(password).trim() !== creds.password) return null;
  return creds.user;
}
