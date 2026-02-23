import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/server/mock/session_store";
import type { VoucherType } from "@/types/voucher";

const SESSION_COOKIE = "hertz_session";

export type VoucherStatus = "ACTIVE" | "USED" | "EXPIRED";

export interface MyVoucher {
  id: string;
  code: string;
  description: string;
  type: VoucherType;
  value?: number;
  benefit?: string;
  minimum_days: number;
  expiry_date: string;
  status: VoucherStatus;
  stackable: boolean;
  applicable_vehicle_classes?: string[];
  issued_at: string;
}

/** Mock dataset - in production this would be DB with 100+ rows */
const MOCK_MY_VOUCHERS: MyVoucher[] = [
  {
    id: "v1",
    code: "WELCOME500",
    description: "500 THB off your rental",
    type: "FIXED",
    value: 500,
    minimum_days: 2,
    expiry_date: "2026-12-31",
    status: "ACTIVE",
    stackable: false,
    issued_at: "2025-01-15T10:00:00Z",
  },
  {
    id: "v2",
    code: "VIP10",
    description: "10% off rental",
    type: "PERCENT",
    value: 10,
    minimum_days: 3,
    expiry_date: "2026-06-30",
    status: "ACTIVE",
    stackable: true,
    issued_at: "2025-02-01T10:00:00Z",
  },
  {
    id: "v3",
    code: "LONG5",
    description: "300 THB off (5+ days)",
    type: "FIXED",
    value: 300,
    minimum_days: 5,
    expiry_date: "2026-09-15",
    status: "ACTIVE",
    stackable: true,
    issued_at: "2025-02-10T10:00:00Z",
  },
  {
    id: "v4",
    code: "EXTRA15",
    description: "15% off",
    type: "PERCENT",
    value: 15,
    minimum_days: 1,
    expiry_date: "2026-08-31",
    status: "ACTIVE",
    stackable: true,
    issued_at: "2025-03-01T10:00:00Z",
  },
  {
    id: "v9",
    code: "FREESEAT",
    description: "Free child seat",
    benefit: "Free child seat",
    type: "FREE_ADDON",
    minimum_days: 2,
    expiry_date: "2026-12-31",
    status: "ACTIVE",
    stackable: true,
    issued_at: "2025-03-15T10:00:00Z",
  },
  {
    id: "v10",
    code: "INSFREE",
    description: "Free premium insurance upgrade",
    benefit: "Free premium insurance upgrade",
    type: "FREE_INSURANCE",
    minimum_days: 3,
    expiry_date: "2026-08-31",
    status: "ACTIVE",
    stackable: false,
    issued_at: "2025-04-01T10:00:00Z",
  },
  {
    id: "v11",
    code: "NODROP",
    description: "Free one-way drop fee",
    benefit: "Free one-way drop fee",
    type: "FREE_DROP_FEE",
    minimum_days: 1,
    expiry_date: "2026-10-01",
    status: "ACTIVE",
    stackable: true,
    issued_at: "2025-04-10T10:00:00Z",
  },
  {
    id: "v12",
    code: "UPGRADE1",
    description: "Free vehicle class upgrade",
    benefit: "Free vehicle class upgrade",
    type: "FREE_UPGRADE",
    minimum_days: 2,
    expiry_date: "2026-09-01",
    status: "ACTIVE",
    stackable: false,
    issued_at: "2025-05-01T10:00:00Z",
  },
  {
    id: "v5",
    code: "USED100",
    description: "100 THB off (used)",
    type: "FIXED",
    value: 100,
    minimum_days: 1,
    expiry_date: "2026-12-31",
    status: "USED",
    stackable: true,
    issued_at: "2024-11-01T10:00:00Z",
  },
  {
    id: "v6",
    code: "USED20PCT",
    description: "20% off (used)",
    type: "PERCENT",
    value: 20,
    minimum_days: 2,
    expiry_date: "2026-12-31",
    status: "USED",
    stackable: true,
    issued_at: "2024-12-01T10:00:00Z",
  },
  {
    id: "v7",
    code: "OLD500",
    description: "500 THB off (expired)",
    type: "FIXED",
    value: 500,
    minimum_days: 1,
    expiry_date: "2024-01-15",
    status: "EXPIRED",
    stackable: true,
    issued_at: "2023-06-01T10:00:00Z",
  },
  {
    id: "v8",
    code: "OLD10PCT",
    description: "10% off (expired)",
    type: "PERCENT",
    value: 10,
    minimum_days: 1,
    expiry_date: "2024-06-30",
    status: "EXPIRED",
    stackable: true,
    issued_at: "2023-12-01T10:00:00Z",
  },
];

type SortKey =
  | "expiry_asc"
  | "expiry_desc"
  | "value_asc"
  | "value_desc"
  | "issued_desc";

function filterAndSort(
  list: MyVoucher[],
  status: VoucherStatus,
  search: string,
  type: string,
  minDays: number | null,
  expiringSoon: boolean,
  valueMin: number | null,
  valueMax: number | null,
  sort: SortKey
): MyVoucher[] {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  let out = list.filter((v) => v.status === status);

  if (search) {
    const q = search.trim().toUpperCase();
    out = out.filter((v) => v.code.toUpperCase().includes(q));
  }

  if (type) {
    const t = type.toUpperCase();
    out = out.filter((v) => v.type === t);
  }

  if (minDays != null && minDays > 0) {
    out = out.filter((v) => v.minimum_days >= minDays);
  }

  if (expiringSoon) {
    out = out.filter((v) => {
      const exp = new Date(v.expiry_date);
      return exp >= now && exp <= in30Days;
    });
  }

  if (valueMin != null && valueMin >= 0) {
    out = out.filter((v) => (v.value ?? 0) >= valueMin);
  }
  if (valueMax != null && valueMax > 0) {
    out = out.filter((v) => (v.value ?? 0) <= valueMax);
  }

  out = [...out].sort((a, b) => {
    switch (sort) {
      case "expiry_asc":
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
      case "expiry_desc":
        return new Date(b.expiry_date).getTime() - new Date(a.expiry_date).getTime();
      case "value_asc":
        return (a.value ?? 0) - (b.value ?? 0);
      case "value_desc":
        return (b.value ?? 0) - (a.value ?? 0);
      case "issued_desc":
        return new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime();
      default:
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
    }
  });

  return out;
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = (searchParams.get("status") ?? "ACTIVE") as VoucherStatus;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(
    50,
    Math.max(10, parseInt(searchParams.get("page_size") ?? "10", 10) || 10)
  );
  const search = searchParams.get("search") ?? "";
  const sort = (searchParams.get("sort") ?? "expiry_asc") as SortKey;
  const type = searchParams.get("type") ?? "";
  const minDaysParam = searchParams.get("min_days");
  const minDays =
    minDaysParam !== null && minDaysParam !== ""
      ? parseInt(minDaysParam, 10)
      : null;
  const expiringSoon = searchParams.get("expiring_soon") === "1";
  const valueMinParam = searchParams.get("value_min");
  const valueMin =
    valueMinParam !== null && valueMinParam !== ""
      ? parseInt(valueMinParam, 10)
      : null;
  const valueMaxParam = searchParams.get("value_max");
  const valueMax =
    valueMaxParam !== null && valueMaxParam !== ""
      ? parseInt(valueMaxParam, 10)
      : null;

  const filtered = filterAndSort(
    MOCK_MY_VOUCHERS,
    status,
    search,
    type,
    minDays,
    expiringSoon,
    valueMin,
    valueMax,
    sort
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageClamped = Math.min(page, totalPages);
  const start = (pageClamped - 1) * pageSize;
  const vouchers = filtered.slice(start, start + pageSize);

  return Response.json({
    total,
    page: pageClamped,
    page_size: pageSize,
    total_pages: totalPages,
    vouchers,
  });
}
