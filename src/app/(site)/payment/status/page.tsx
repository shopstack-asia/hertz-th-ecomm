"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { proxyFetch } from "@/lib/api/proxy_fetch";

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "pending";
  const reservationNo = searchParams.get("reservationNo") ?? "";

  const [processing, setProcessing] = useState(true);
  const [result, setResult] = useState<"success" | "fail" | null>(null);

  useEffect(() => {
    if (!reservationNo) {
      setProcessing(false);
      setResult(status === "success" ? "success" : "fail");
      return;
    }
    proxyFetch<{ success: boolean }>("/api/payment/callback", {
      method: "POST",
      body: JSON.stringify({
        reservationNo,
        status: status === "success" ? "success" : status === "cancel" ? "cancel" : "fail",
      }),
    })
      .then((r) => setResult(r.success ? "success" : "fail"))
      .catch(() => setResult("fail"))
      .finally(() => setProcessing(false));
  }, [reservationNo, status]);

  useEffect(() => {
    if (!processing && result === "success" && reservationNo) {
      router.replace(`/booking/${reservationNo}`);
    }
  }, [processing, result, reservationNo, router]);

  if (processing) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-hertz-yellow border-t-transparent mx-auto" />
        <p className="text-hertz-black-80">Processing payment...</p>
      </div>
    );
  }

  if (result === "success") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-lg font-semibold text-green-600">Redirecting to confirmation...</p>
        <a href={`/booking/${reservationNo}`} className="mt-4 text-hertz-yellow underline">
          Go to booking
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <p className="text-lg font-semibold text-red-600">
        Payment could not be completed
      </p>
      <p className="mt-2 text-hertz-black-80">
        Please try again or contact support.
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-xl bg-hertz-yellow px-6 py-3 font-semibold text-hertz-black-90"
      >
        Back to home
      </a>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16 text-center" />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
