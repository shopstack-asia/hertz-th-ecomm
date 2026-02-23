import { NextRequest } from "next/server";
import { voucherOrders } from "@/lib/mock/voucherPaymentSessions";

function generateVoucherCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(request: NextRequest) {
  let body: { order_ref?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderRef = body.order_ref?.trim();
  if (!orderRef) {
    return Response.json({ error: "order_ref required" }, { status: 400 });
  }

  const order = voucherOrders[orderRef];
  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "paid") {
    return Response.json({
      status: "paid",
      order_ref: orderRef,
      voucher_code: order.voucher_code,
      expiry_date: order.expiry_date,
    });
  }

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 365);
  const expiryDate = expiry.toISOString().slice(0, 10);
  const voucherCode = generateVoucherCode();

  order.status = "paid";
  order.voucher_code = voucherCode;
  order.expiry_date = expiryDate;
  order.paid_at = new Date().toISOString();

  return Response.json({
    status: "paid",
    order_ref: orderRef,
    voucher_code: voucherCode,
    expiry_date: expiryDate,
  });
}
