"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth_context";
import type { VoucherCatalogItem } from "@/app/api/vouchers/catalog/route";

export default function VoucherCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authenticated } = useAuth();
  const voucherId = searchParams.get("voucher_id") ?? "";
  const quantityParam = Math.max(1, Math.min(10, parseInt(searchParams.get("quantity") ?? "1", 10) || 1));

  const [voucher, setVoucher] = useState<VoucherCatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(quantityParam);
  const [recipientName, setRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authenticated) {
      router.replace(`/account/login?returnUrl=${encodeURIComponent(`/voucher-checkout?voucher_id=${voucherId}&quantity=${quantityParam}`)}`);
      return;
    }
    if (!voucherId) {
      setLoading(false);
      return;
    }
    fetch("/api/vouchers/catalog")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.vouchers) ? data.vouchers : [];
        const found = list.find((v: VoucherCatalogItem) => v.id === voucherId);
        setVoucher(found ?? null);
      })
      .catch(() => setVoucher(null))
      .finally(() => setLoading(false));
  }, [authenticated, voucherId, quantityParam, router]);

  const subtotal = voucher ? voucher.selling_price * quantity : 0;
  const vatRate = 0.07;
  const vatAmount = Math.round(subtotal * vatRate);
  const total = subtotal + vatAmount;

  const handlePayNow = async () => {
    if (!voucher) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/voucher-order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voucher_id: voucher.id,
          quantity,
          recipient_name: recipientName.trim() || undefined,
          gift_message: giftMessage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create order");
        return;
      }
      if (data.payment_url) {
        router.push(data.payment_url);
        return;
      }
      setError("Invalid response");
    } catch {
      setError("Failed to create order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <p className="text-hertz-black-80">Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="h-96 animate-pulse bg-hertz-gray" />
      </div>
    );
  }

  if (!voucherId || !voucher) {
    return (
      <div className="mx-auto max-w-container px-6 py-12 text-center">
        <p className="text-hertz-black-80">Voucher not found or missing.</p>
        <Link href="/vouchers" className="mt-4 inline-block font-bold text-black underline">
          Browse vouchers
        </Link>
      </div>
    );
  }

  const valueLabel =
    voucher.type === "FIXED"
      ? `฿${voucher.value.toLocaleString()}`
      : `${voucher.value}% off`;

  return (
    <div className="mx-auto max-w-container px-6 py-8 lg:py-12">
      <h1 className="mb-8 text-2xl font-bold text-black">Voucher checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="border border-hertz-border bg-white p-6">
            <h2 className="text-lg font-bold text-black">{voucher.title}</h2>
            <p className="mt-2 text-sm text-hertz-black-80">
              Value: {valueLabel} · Quantity: {quantity}
            </p>
          </div>
          <div className="mt-6 border border-hertz-border bg-white p-6">
            <h3 className="font-bold text-black">Recipient (optional)</h3>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Recipient name"
              className="mt-2 w-full border border-hertz-border px-4 py-3 text-black"
            />
            <h3 className="mt-4 font-bold text-black">Gift message (optional)</h3>
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Add a personal message"
              rows={3}
              className="mt-2 w-full border border-hertz-border px-4 py-3 text-black"
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="border border-hertz-border bg-white p-6">
            <h3 className="text-lg font-bold text-black">Price summary</h3>
            <dl className="mt-4 space-y-2 border-b border-hertz-border pb-4">
              <div className="flex justify-between text-sm">
                <dt className="text-hertz-black-80">Subtotal ({quantity} × ฿{voucher.selling_price.toLocaleString()})</dt>
                <dd className="text-black">฿{subtotal.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-hertz-black-80">VAT (7%)</dt>
                <dd className="text-black">฿{vatAmount.toLocaleString()}</dd>
              </div>
            </dl>
            <div className="flex justify-between py-4 text-lg font-bold text-black">
              <span>Total</span>
              <span>฿{total.toLocaleString()}</span>
            </div>
            {error && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center bg-[#FFCC00] font-bold text-black disabled:opacity-70"
            >
              {submitting ? "Processing…" : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
