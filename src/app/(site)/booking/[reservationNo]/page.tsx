"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Reservation } from "@/types";

export default function BookingConfirmationPage() {
  const params = useParams();
  const reservationNo = params.reservationNo as string;

  const [booking, setBooking] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/booking/${reservationNo}`)
      .then((r) => r.json())
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [reservationNo]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-hertz-black-80">Booking not found.</p>
        <Link href="/" className="mt-4 text-hertz-yellow underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-6">
      <div className="rounded-2xl bg-hertz-yellow p-6 text-center">
        <h1 className="text-2xl font-bold text-hertz-black-90">
          Booking confirmed
        </h1>
        <p className="mt-2 text-hertz-black-80">
          Your reservation number
        </p>
        <p className="mt-2 text-3xl font-bold text-hertz-black-90">
          {booking.reservationNo}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-hertz-black-90">
            Trip details
          </h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-hertz-black-60">Vehicle</dt>
              <dd className="text-hertz-black-90">{booking.vehicleName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-hertz-black-60">Pick-up</dt>
              <dd className="text-right text-hertz-black-90">
                {booking.pickupLocation}
                <br />
                {new Date(booking.pickupAt).toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-hertz-black-60">Drop-off</dt>
              <dd className="text-right text-hertz-black-90">
                {booking.dropoffLocation}
                <br />
                {new Date(booking.dropoffAt).toLocaleString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-hertz-black-60">Payment status</dt>
              <dd className="text-hertz-black-90">
                {booking.bookingType === "PAY_LATER"
                  ? "Pay at counter"
                  : booking.paymentStatus ?? "Pending"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-hertz-black-90">
            Price breakdown
          </h2>
          <div className="space-y-2">
            {booking.pricing.lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-hertz-black-80">{item.description}</span>
                <span>
                  {item.amount >= 0 ? "฿" : "-฿"}
                  {Math.abs(item.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between border-t border-gray-100 pt-2 text-sm">
            <span className="text-hertz-black-60">VAT (7%)</span>
            <span>฿{booking.pricing.vatAmount.toLocaleString()}</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-200 pt-4">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">
              ฿{booking.pricing.total.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-hertz-black-90">
            Required documents
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-hertz-black-80">
            <li>Valid driving license (international if applicable)</li>
            <li>Credit card for security deposit</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-card">
          <h2 className="mb-3 text-lg font-semibold text-hertz-black-90">
            Cancellation policy
          </h2>
          <p className="text-sm text-hertz-black-60">
            Free cancellation up to 24 hours before pick-up. Cancellations
            within 24 hours may incur fees. See terms for full details.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/account/bookings/upcoming"
          className="flex h-12 items-center justify-center rounded-xl border-2 border-hertz-yellow font-semibold text-hertz-black-90"
        >
          View my bookings
        </Link>
        <Link
          href="/"
          className="flex h-12 items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90"
        >
          Book another car
        </Link>
      </div>
    </div>
  );
}
