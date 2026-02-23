/**
 * Loyalty API client.
 * Frontend calls Next.js API routes only (proxy pattern).
 * Profile loyalty = spending-based qualification; My Points = points summary/transactions.
 */

import type { LoyaltyProfile } from "@/types/account";
import type {
  LoyaltySummary,
  LoyaltyTransactionsResponse,
  PointsTransactionType,
} from "@/types/loyalty";

/** Spending-based qualification (My Profile header). */
export async function getLoyaltyProfile(): Promise<LoyaltyProfile | null> {
  const res = await fetch("/api/loyalty/profile", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

export interface GetTransactionsParams {
  page?: number;
  type?: "ALL" | PointsTransactionType;
  dateFrom?: string | null;
  dateTo?: string | null;
  sort?: "newest" | "oldest";
}

export async function getPointsSummary(): Promise<LoyaltySummary> {
  const res = await fetch("/api/loyalty/summary", { credentials: "include" });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to load points summary");
  }
  return res.json();
}

export async function getPointsTransactions(
  params: GetTransactionsParams = {}
): Promise<LoyaltyTransactionsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("type", params.type ?? "ALL");
  if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) searchParams.set("dateTo", params.dateTo);
  searchParams.set("sort", params.sort ?? "newest");

  const res = await fetch(
    `/api/loyalty/transactions?${searchParams.toString()}`,
    { credentials: "include" }
  );
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error("Failed to load point transactions");
  }
  return res.json();
}
