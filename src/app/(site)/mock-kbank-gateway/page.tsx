"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function MockKBankGatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id") ?? "";
  const bookingRefParam = searchParams.get("booking_ref") ?? "";
  const orderRefParam = searchParams.get("order_ref") ?? "";
  const typeParam = searchParams.get("type") ?? "";

  const [bookingRef, setBookingRef] = useState(bookingRefParam);
  const [orderRef, setOrderRef] = useState(orderRefParam);
  const [isVoucher, setIsVoucher] = useState(typeParam === "voucher");
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session");
      setLoading(false);
      return;
    }
    fetch(`/api/payment/session/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setIsVoucher(data.type === "voucher");
        if (data.type === "voucher") {
          setOrderRef(data.order_ref ?? orderRefParam);
        } else {
          setBookingRef(data.booking_ref ?? bookingRefParam);
        }
        setAmount(data.amount ?? 0);
      })
      .catch(() => setError("Failed to load session"))
      .finally(() => setLoading(false));
  }, [sessionId, bookingRefParam, orderRefParam]);

  const handleConfirm = () => {
    if (isVoucher && orderRef) {
      router.push(
        `/payment-return?status=success&order_ref=${encodeURIComponent(orderRef)}&type=voucher`
      );
    } else {
      router.push(
        `/payment-return?status=success&booking_ref=${encodeURIComponent(bookingRef)}`
      );
    }
  };

  const handleCancel = () => {
    if (isVoucher && orderRef) {
      router.push("/vouchers?payment=cancelled");
    } else {
      router.push(
        `/payment-return?status=cancel&booking_ref=${encodeURIComponent(bookingRef)}`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hertz-gray">
        <p className="text-hertz-black-80">Loading...</p>
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
    <div className="min-h-screen bg-hertz-gray py-12">
      <div className="mx-auto max-w-md border border-hertz-border bg-white p-8 shadow-card">
        <div className="mb-8 flex justify-center border-b border-hertz-border pb-6">
          <div className="flex h-12 items-center justify-center bg-[#1e4598] px-6 text-xl font-bold text-white">
            KBank
          </div>
        </div>
        <h1 className="mb-6 text-lg font-bold text-black">Payment summary</h1>
        <dl className="space-y-3 border-b border-hertz-border pb-6">
          <div className="flex justify-between text-sm">
            <dt className="text-hertz-black-80">
              {isVoucher ? "Order reference" : "Booking reference"}
            </dt>
            <dd className="font-medium text-black">
              {isVoucher ? orderRef : bookingRef}
            </dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-hertz-black-80">Amount</dt>
            <dd className="text-lg font-bold text-black">
              ฿{amount != null ? amount.toLocaleString() : "—"}
            </dd>
          </div>
        </dl>
        <p className="mb-6 text-xs text-hertz-black-60">
          This is a mock payment gateway for testing.
        </p>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex h-12 w-full items-center justify-center bg-[#FFCC00] font-bold text-black"
          >
            Confirm payment
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-12 w-full items-center justify-center border-2 border-black bg-white font-bold text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MockKBankGatewayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-hertz-gray p-4">
          <p className="text-hertz-black-80">Loading...</p>
        </div>
      }
    >
      <MockKBankGatewayContent />
    </Suspense>
  );
}
