"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookingData {
  booking_ref?: string;
  reservationNo: string;
  vehicleName: string;
  pickupLocation: string;
  pickupAt: string;
  dropoffLocation: string;
  dropoffAt: string;
  pricing?: {
    total: number;
    currency: string;
  };
  status: string;
  paymentStatus?: string;
  bookingType?: string;
}

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get("booking_ref") ?? "";
  const type = searchParams.get("type") ?? "pay_later";

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingRef) {
      setError("Missing booking reference");
      setLoading(false);
      return;
    }
    fetch(`/api/booking/by-ref/${encodeURIComponent(bookingRef)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setBooking(data);
      })
      .catch(() => setError("Failed to load booking"))
      .finally(() => setLoading(false));
  }, [bookingRef]);

  const paymentMethod = type === "pay_now" ? "Pay now (card)" : "Pay at counter";
  const paymentStatus =
    type === "pay_now" && booking?.paymentStatus === "PAID"
      ? "Paid"
      : type === "pay_later"
        ? "Pay at pickup"
        : booking?.paymentStatus ?? "—";

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8">
          <p className="text-hertz-black-80">Loading your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8 text-center">
          <p className="text-red-600">{error ?? "Booking not found"}</p>
          <Link
            href="/"
            className="mt-4 inline-block border border-black px-4 py-2 font-medium text-black"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const total = booking.pricing?.total ?? 0;
  const currency = booking.pricing?.currency ?? "THB";

  return (
    <div className="mx-auto max-w-container px-6 py-12">
      <div className="mx-auto max-w-lg border border-hertz-border bg-white p-8">
        <h1 className="text-2xl font-bold text-black">Thank you</h1>
        <p className="mt-2 text-hertz-black-80">
          Your booking has been confirmed.
        </p>

        <dl className="mt-8 space-y-4 border-b border-hertz-border pb-6">
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Booking reference
            </dt>
            <dd className="mt-1 font-bold text-black">{bookingRef || booking.reservationNo}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Vehicle
            </dt>
            <dd className="mt-1 text-black">{booking.vehicleName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Rental dates
            </dt>
            <dd className="mt-1 text-black">
              {new Date(booking.pickupAt).toLocaleDateString()} –{" "}
              {new Date(booking.dropoffAt).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Pick-up
            </dt>
            <dd className="mt-1 text-black">{booking.pickupLocation}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Drop-off
            </dt>
            <dd className="mt-1 text-black">{booking.dropoffLocation}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Payment method
            </dt>
            <dd className="mt-1 text-black">{paymentMethod}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Payment status
            </dt>
            <dd className="mt-1 text-black">{paymentStatus}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-hertz-black-60">
              Total amount
            </dt>
            <dd className="mt-1 text-xl font-bold text-black">
              {currency} {total.toLocaleString()}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            className="flex h-12 w-full items-center justify-center border-2 border-black bg-white font-medium text-black"
          >
            Download receipt
          </button>
          <Link
            href="/"
            className="flex h-12 w-full items-center justify-center bg-[#FFCC00] font-bold text-black"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
