/**
 * Client-side fetch wrapper for Next.js API routes.
 * Handles JSON, errors, and typed responses.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function proxyFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!res.ok) {
    const body = isJson ? await res.json().catch(() => null) : await res.text();
    throw new ApiError(res.statusText, res.status, body);
  }

  if (isJson) {
    return res.json() as Promise<T>;
  }
  return undefined as unknown as T;
}
