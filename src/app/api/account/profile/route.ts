import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession, updateSessionUser } from "@/server/mock/session_store";
import { getProfile, setProfile, updateProfile } from "@/server/mock/profile_store";
import type { AccountProfile } from "@/types/account";

const SESSION_COOKIE = "hertz_session";

function toProfile(sessionUser: { id: string; email: string; first_name: string; last_name: string; phone?: string; avatar_url?: string }): AccountProfile {
  return {
    id: sessionUser.id,
    email: sessionUser.email,
    firstName: sessionUser.first_name,
    lastName: sessionUser.last_name,
    phone: sessionUser.phone,
    avatar_url: sessionUser.avatar_url,
  };
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let profile = getProfile(session.user.id);
  if (!profile) {
    profile = toProfile(session.user);
    setProfile(session.user.id, profile);
  }

  return Response.json(profile);
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const userId = session.user.id;
  const existing = getProfile(userId) ?? toProfile(session.user);

  const updates: Partial<AccountProfile> = {};
  if (typeof body.firstName === "string") updates.firstName = body.firstName;
  if (typeof body.lastName === "string") updates.lastName = body.lastName;
  if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url === "" || body.avatar_url == null ? undefined : body.avatar_url;
  // email and phone are updated only via verify-otp flow

  const profile = updateProfile(userId, updates, existing);
  updateSessionUser(sessionId, {
    first_name: profile.firstName,
    last_name: profile.lastName,
    phone: profile.phone,
    avatar_url: profile.avatar_url,
  });

  return Response.json(profile);
}
