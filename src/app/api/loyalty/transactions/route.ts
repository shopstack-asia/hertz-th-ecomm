import { cookies } from "next/headers";
import { getLocaleFromRequest } from "@/lib/request-locale";
import type { ApiLocale } from "@/lib/request-locale";
import { getSession } from "@/server/mock/session_store";
import type {
  LoyaltyTransactionsResponse,
  PointsTransaction,
  PointsTransactionType,
} from "@/types/loyalty";

const SESSION_COOKIE = "hertz_session";

const MOCK_TRANSACTIONS: PointsTransaction[] = [
  {
    id: "txn1",
    date: "2026-02-23",
    type: "EARN",
    description: "Rental Booking #BK2026001",
    booking_ref: "BK2026001",
    points: 500,
    balance_after: 12500,
  },
  {
    id: "txn2",
    date: "2026-02-25",
    type: "REDEEM",
    description: "300 points → ฿500 discount",
    booking_ref: null,
    points: -300,
    balance_after: 12200,
  },
  {
    id: "txn3",
    date: "2025-12-31",
    type: "EXPIRED",
    description: "Year-end expiry",
    booking_ref: null,
    points: -200,
    balance_after: 12000,
  },
  {
    id: "txn4",
    date: "2026-02-20",
    type: "EARN",
    description: "Rental Booking #BK2026020",
    booking_ref: "BK2026020",
    points: 350,
    balance_after: 12200,
  },
  {
    id: "txn5",
    date: "2026-02-15",
    type: "ADJUSTMENT",
    description: "Points correction",
    booking_ref: null,
    points: 100,
    balance_after: 11850,
    admin_note: "Promotional bonus applied.",
  },
  {
    id: "txn6",
    date: "2026-02-10",
    type: "REDEEM",
    description: "500 points → ฿700 discount",
    booking_ref: null,
    points: -500,
    balance_after: 11750,
  },
];

const TXN_DESCRIPTIONS: Record<string, Record<ApiLocale, { description: string; admin_note?: string }>> = {
  txn1: {
    en: { description: "Rental Booking #BK2026001" },
    th: { description: "การจองเช่ารถ #BK2026001" },
    zh: { description: "租车预订 #BK2026001" },
  },
  txn2: {
    en: { description: "300 points → ฿500 discount" },
    th: { description: "300 คะแนน → ส่วนลด ฿500" },
    zh: { description: "300 积分 → ฿500 折扣" },
  },
  txn3: {
    en: { description: "Year-end expiry" },
    th: { description: "คะแนนหมดอายุสิ้นปี" },
    zh: { description: "年终过期" },
  },
  txn4: {
    en: { description: "Rental Booking #BK2026020" },
    th: { description: "การจองเช่ารถ #BK2026020" },
    zh: { description: "租车预订 #BK2026020" },
  },
  txn5: {
    en: { description: "Points correction", admin_note: "Promotional bonus applied." },
    th: { description: "ปรับคะแนน", admin_note: "โบนัสโปรโมชัน" },
    zh: { description: "积分调整", admin_note: "已应用促销奖励。" },
  },
  txn6: {
    en: { description: "500 points → ฿700 discount" },
    th: { description: "500 คะแนน → ส่วนลด ฿700" },
    zh: { description: "500 积分 → ฿700 折扣" },
  },
};

function getLocalizedTransactions(locale: ApiLocale): PointsTransaction[] {
  return MOCK_TRANSACTIONS.map((t) => {
    const over = TXN_DESCRIPTIONS[t.id]?.[locale];
    if (!over) return { ...t };
    return { ...t, description: over.description, ...(over.admin_note != null && { admin_note: over.admin_note }) };
  });
}

const TYPES: PointsTransactionType[] = [
  "EARN",
  "REDEEM",
  "EXPIRED",
  "ADJUSTMENT",
];

function filterByType(
  list: PointsTransaction[],
  type: string
): PointsTransaction[] {
  if (!type || type === "ALL") return list;
  return list.filter((t) => t.type === type);
}

function sortByDate(
  list: PointsTransaction[],
  order: "newest" | "oldest"
): PointsTransaction[] {
  const copy = [...list];
  copy.sort((a, b) => {
    const d = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === "newest" ? -d : d;
  });
  return copy;
}

function filterByDateRange(
  list: PointsTransaction[],
  dateFrom: string | null,
  dateTo: string | null
): PointsTransaction[] {
  if (!dateFrom && !dateTo) return list;
  return list.filter((t) => {
    const d = t.date;
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  });
}

export async function GET(request: Request) {
  const locale = getLocaleFromRequest(request);
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const listBase = getLocalizedTransactions(locale);
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const type = searchParams.get("type") ?? "ALL";
  const dateFrom = searchParams.get("dateFrom") || null;
  const dateTo = searchParams.get("dateTo") || null;
  const sort = (searchParams.get("sort") === "oldest" ? "oldest" : "newest") as
    | "newest"
    | "oldest";

  let list = filterByType(listBase, type);
  list = filterByDateRange(list, dateFrom, dateTo);
  list = sortByDate(list, sort);

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const pageIndex = Math.min(page - 1, totalPages - 1);
  const start = pageIndex * perPage;
  const data = list.slice(start, start + perPage);

  const result: LoyaltyTransactionsResponse = {
    data,
    pagination: { page: pageIndex + 1, total_pages: totalPages },
  };

  return Response.json(result);
}
