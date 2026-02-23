import { NextRequest } from "next/server";
import { createState, validateNext } from "@/server/mock/oauth_state_store";

/** Redirect ไป Apple OAuth จริง ด้วย client_id แบบ mock เพื่อให้เห็นหน้า error ของ Apple */
const APPLE_AUTH_URL = "https://appleid.apple.com/auth/authorize";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const nextParam = searchParams.get("next") ?? "";
  const next = validateNext(nextParam) ? (nextParam || "/") : "/";

  const state = createState(next, "APPLE");
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/oauth/apple/callback`;

  const params = new URLSearchParams({
    client_id: "MOCK_INVALID_CLIENT",
    redirect_uri: redirectUri,
    response_type: "code id_token",
    scope: "email name",
    response_mode: "query",
    state,
  });

  const redirectUrl = `${APPLE_AUTH_URL}?${params.toString()}`;
  return Response.redirect(redirectUrl, 302);
}
