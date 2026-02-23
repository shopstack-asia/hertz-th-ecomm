"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

interface VoucherOrder {
  order_ref: string;
  voucher_title: string;
  quantity: number;
  total: number;
  voucher_code?: string;
  expiry_date?: string;
  status: string;
}

function VoucherThankYouContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("order_ref") ?? "";

  const [order, setOrder] = useState<VoucherOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderRef) {
      setError("Missing order reference");
      setLoading(false);
      return;
    }
    fetch(`/api/voucher-order/by-ref?order_ref=${encodeURIComponent(orderRef)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setOrder(data);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderRef]);

  const handleDownload = () => {
    if (!order?.voucher_code) return;
    const text = `Hertz Voucher\nOrder: ${order.order_ref}\nCode: ${order.voucher_code}\nValid until: ${order.expiry_date ?? "—"}\n\n${order.voucher_title}\n\nThis is a mock PDF. In production, generate a proper PDF.`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hertz-voucher-${order.order_ref}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8">
          <p className="text-hertz-black-80">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8 text-center">
          <p className="text-red-600">{error ?? "Order not found"}</p>
          <Link
            href="/vouchers"
            className="mt-4 inline-block border border-black px-4 py-2 font-medium text-black"
          >
            Back to vouchers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-6 py-12">
      <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8">
        <h1 className="text-2xl font-bold text-black">Thank you</h1>
        <p className="mt-2 text-hertz-black-80">
          Your voucher purchase has been confirmed.
        </p>

        <dl className="mt-8 space-y-4 border-b border-hertz-border pb-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Order reference
            </dt>
            <dd className="mt-1 font-bold text-black">{order.order_ref}</dd>
          </div>
          {order.voucher_code && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
                Voucher code
              </dt>
              <dd className="mt-1 font-mono text-lg font-bold text-black">
                {order.voucher_code}
              </dd>
            </div>
          )}
          {order.expiry_date && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
                Expiry date
              </dt>
              <dd className="mt-1 text-black">{order.expiry_date}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Voucher
            </dt>
            <dd className="mt-1 text-black">{order.voucher_title}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Total paid
            </dt>
            <dd className="mt-1 text-xl font-bold text-black">
              ฿{order.total.toLocaleString()}
            </dd>
          </div>
        </dl>

        <p className="mt-6 text-sm text-hertz-black-80">
          A confirmation email has been sent to your email address with your
          voucher code and details.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="flex h-12 w-full items-center justify-center border-2 border-black bg-white font-medium text-black"
          >
            Download voucher
          </button>
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center bg-[#FFCC00] font-bold text-black"
          >
            Back to home
          </Link>
          <Link
            href="/vouchers"
            className="flex h-12 w-full items-center justify-center border border-hertz-border font-medium text-hertz-black-80"
          >
            Buy another voucher
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VoucherThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-container px-6 py-12">
          <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8">
            <p className="text-hertz-black-80">Loading...</p>
          </div>
        </div>
      }
    >
      <VoucherThankYouContent />
    </Suspense>
  );
}
