"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const bookingRef = searchParams.get("booking_ref") ?? "";
  const orderRef = searchParams.get("order_ref") ?? "";
  const type = searchParams.get("type") ?? "";

  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "success" && type === "voucher" && orderRef) {
      setConfirming(true);
      fetch("/api/voucher-order/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_ref: orderRef }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          router.replace(`/voucher-thank-you?order_ref=${encodeURIComponent(orderRef)}`);
        })
        .catch(() => setError("Confirmation failed"))
        .finally(() => setConfirming(false));
      return;
    }
    if (status === "success" && bookingRef) {
      setConfirming(true);
      fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_ref: bookingRef }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            return;
          }
          router.replace(`/thank-you?booking_ref=${encodeURIComponent(bookingRef)}&type=pay_now`);
        })
        .catch(() => setError("Confirmation failed"))
        .finally(() => setConfirming(false));
      return;
    }
    if (status === "cancel") {
      router.replace("/vehicles?payment=cancelled");
      return;
    }
  }, [status, bookingRef, orderRef, type, router]);

  if (status === "cancel") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hertz-gray p-4">
        <div className="border border-hertz-border bg-white p-6 text-center">
          <p className="font-medium text-black">Payment cancelled</p>
          <p className="mt-2 text-sm text-hertz-black-80">
            You will be redirected back to checkout.
          </p>
        </div>
      </div>
    );
  }

  if (confirming || (status === "success" && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hertz-gray p-4">
        <div className="border border-hertz-border bg-white p-6 text-center">
          <p className="text-hertz-black-80">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hertz-gray p-4">
        <div className="border border-hertz-border bg-white p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 border border-black px-4 py-2 font-medium text-black"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hertz-gray p-4">
      <p className="text-hertz-black-80">Processing...</p>
    </div>
  );
}
