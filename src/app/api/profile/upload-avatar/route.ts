import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession, updateSessionUser } from "@/server/mock/session_store";
import { getProfile, updateProfile } from "@/server/mock/profile_store";

const SESSION_COOKIE = "hertz_session";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png"];

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file" }, { status: 400 });
  }

  if (!ALLOWED.includes(file.type)) {
    return Response.json({ error: "JPG or PNG only" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Max size 5MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  const userId = session.user.id;
  const existing = getProfile(userId) ?? {
    id: userId,
    email: session.user.email,
    firstName: session.user.first_name,
    lastName: session.user.last_name,
    phone: session.user.phone,
  };

  const updated = updateProfile(userId, { ...existing, avatar_url: dataUrl }, existing);
  updateSessionUser(sessionId, { avatar_url: dataUrl });

  return Response.json({ avatar_url: dataUrl });
}
