import { NextRequest } from "next/server";
import { getLocaleFromRequest } from "@/lib/request-locale";
import type { ApiLocale } from "@/lib/request-locale";
import { voucherPaymentSessions, voucherOrders } from "@/lib/mock/voucherPaymentSessions";

function generateOrderRef(): string {
  return `VCH${Math.floor(100000 + Math.random() * 900000)}`;
}

function generateSessionId(): string {
  return `VCH${Math.floor(100000 + Math.random() * 900000)}`;
}

const CATALOG_BASE: Record<string, { selling_price: number }> = {
  gv2000: { selling_price: 1800 },
  gv5000: { selling_price: 4500 },
  discount15: { selling_price: 499 },
  gv1000: { selling_price: 950 },
  corp3000: { selling_price: 2700 },
  discount20: { selling_price: 699 },
  "free-child-seat": { selling_price: 199 },
  "free-gps": { selling_price: 149 },
  "free-easy-pass": { selling_price: 99 },
  "free-additional-driver": { selling_price: 299 },
  "free-premium-insurance": { selling_price: 499 },
  "free-drop-fee": { selling_price: 399 },
  "free-vehicle-upgrade": { selling_price: 699 },
};

const CATALOG_TITLES: Record<string, Record<ApiLocale, string>> = {
  gv2000: { en: "฿2,000 Travel Voucher", th: "Voucher ท่องเที่ยว ฿2,000", zh: "฿2,000 旅行券" },
  gv5000: { en: "฿5,000 Gift Voucher", th: "บัตรของขวัญ ฿5,000", zh: "฿5,000 礼品券" },
  discount15: { en: "15% Rental Discount Voucher", th: "คูปองส่วนลดค่าเช่า 15%", zh: "15% 租车折扣券" },
  gv1000: { en: "฿1,000 Travel Voucher", th: "Voucher ท่องเที่ยว ฿1,000", zh: "฿1,000 旅行券" },
  corp3000: { en: "฿3,000 Corporate Voucher", th: "Voucher สำหรับองค์กร ฿3,000", zh: "฿3,000 企业券" },
  discount20: { en: "20% Rental Discount Voucher", th: "คูปองส่วนลดค่าเช่า 20%", zh: "20% 租车折扣券" },
  "free-child-seat": { en: "Free Child Seat Voucher", th: "คูปองเก้าอี้เด็กฟรี", zh: "免费儿童座椅券" },
  "free-gps": { en: "Free GPS Voucher", th: "คูปอง GPS ฟรี", zh: "免费 GPS 券" },
  "free-easy-pass": { en: "Free Easy Pass Voucher", th: "คูปองอีซีพาสฟรี", zh: "免费易通卡券" },
  "free-additional-driver": { en: "Free Additional Driver Voucher", th: "คูปองคนขับเพิ่มฟรี", zh: "免费增驾员券" },
  "free-premium-insurance": { en: "Free Premium Insurance Upgrade", th: "อัปเกรดประกันพรีเมียมฟรี", zh: "免费升级保险券" },
  "free-drop-fee": { en: "Free One-way Drop Fee", th: "ค่าคืนต่างจุดฟรี", zh: "免异地还车费券" },
  "free-vehicle-upgrade": { en: "Free Vehicle Class Upgrade", th: "อัปเกรดระดับรถฟรี", zh: "免费车型升级券" },
};

function getCatalog(voucherId: string, locale: ApiLocale): { title: string; selling_price: number } | null {
  const base = CATALOG_BASE[voucherId];
  const titles = CATALOG_TITLES[voucherId];
  if (!base || !titles) return null;
  return { title: titles[locale] ?? titles.en, selling_price: base.selling_price };
}

export async function POST(request: NextRequest) {
  const locale = getLocaleFromRequest(request);
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

  const catalog = getCatalog(voucherId, locale);
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
