import { NextRequest } from "next/server";
import { voucherPaymentSessions, voucherOrders } from "@/lib/mock/voucherPaymentSessions";

function generateOrderRef(): string {
  return `VCH${Math.floor(100000 + Math.random() * 900000)}`;
}

function generateSessionId(): string {
  return `VCH${Math.floor(100000 + Math.random() * 900000)}`;
}

const CATALOG_IDS: Record<string, { title: string; selling_price: number }> = {
  gv2000: { title: "฿2,000 Travel Voucher", selling_price: 1800 },
  gv5000: { title: "฿5,000 Gift Voucher", selling_price: 4500 },
  discount15: { title: "15% Rental Discount Voucher", selling_price: 499 },
  gv1000: { title: "฿1,000 Travel Voucher", selling_price: 950 },
  corp3000: { title: "฿3,000 Corporate Voucher", selling_price: 2700 },
  discount20: { title: "20% Rental Discount Voucher", selling_price: 699 },
  "free-child-seat": { title: "Free Child Seat Voucher", selling_price: 199 },
  "free-gps": { title: "Free GPS Voucher", selling_price: 149 },
  "free-easy-pass": { title: "Free Easy Pass Voucher", selling_price: 99 },
  "free-additional-driver": { title: "Free Additional Driver Voucher", selling_price: 299 },
  "free-premium-insurance": { title: "Free Premium Insurance Upgrade", selling_price: 499 },
  "free-drop-fee": { title: "Free One-way Drop Fee", selling_price: 399 },
  "free-vehicle-upgrade": { title: "Free Vehicle Class Upgrade", selling_price: 699 },
};

export async function POST(request: NextRequest) {
  let body: {
    voucher_id?: string;
    quantity?: number;
    recipient_name?: string;
    gift_message?: string;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const voucherId = body.voucher_id?.trim();
  const quantity = Math.max(1, Math.min(10, Math.floor(body.quantity ?? 1)));

  if (!voucherId) {
    return Response.json({ error: "voucher_id required" }, { status: 400 });
  }

  const catalog = CATALOG_IDS[voucherId];
  if (!catalog) {
    return Response.json({ error: "Voucher not found" }, { status: 404 });
  }

  const unitPrice = catalog.selling_price;
  const subtotal = unitPrice * quantity;
  const vatRate = 0.07;
  const vatAmount = Math.round(subtotal * vatRate);
  const total = subtotal + vatAmount;

  const orderRef = generateOrderRef();
  const sessionId = generateSessionId();

  voucherPaymentSessions[sessionId] = { order_ref: orderRef, amount: total };
  voucherOrders[orderRef] = {
    order_ref: orderRef,
    voucher_id: voucherId,
    voucher_title: catalog.title,
    quantity,
    total,
    recipient_name: body.recipient_name?.trim() || undefined,
    gift_message: body.gift_message?.trim() || undefined,
    status: "pending",
  };

  const paymentUrl = `/mock-kbank-gateway?session_id=${sessionId}&order_ref=${encodeURIComponent(orderRef)}&type=voucher`;

  return Response.json({
    order_ref: orderRef,
    total,
    subtotal,
    vat_amount: vatAmount,
    payment_url: paymentUrl,
  });
}
