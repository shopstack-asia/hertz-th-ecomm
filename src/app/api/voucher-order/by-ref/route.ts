import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import { voucherOrders } from "@/lib/mock/voucherPaymentSessions";

export async function GET(request: NextRequest) {
  getLocaleFromRequest(request);
  const orderRef = request.nextUrl.searchParams.get("order_ref")?.trim();
  if (!orderRef) {
    return Response.json({ error: "order_ref required" }, { status: 400 });
  }

  const order = voucherOrders[orderRef];
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  return Response.json(order);
}
