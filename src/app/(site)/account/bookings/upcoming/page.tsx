"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Reservation } from "@/types";

export default function UpcomingBookingsPage() {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/bookings/upcoming")
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-hertz-black-90">
        Upcoming bookings
      </h1>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-2xl bg-gray-200"
              aria-hidden
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-card">
          <p className="text-hertz-black-80">
            No upcoming bookings.{" "}
            <Link href="/" className="text-hertz-yellow underline">
              Book a car
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Link
              key={b.reservationNo}
              href={`/booking/${b.reservationNo}`}
              className="block rounded-2xl border border-gray-200 bg-white p-4 shadow-card hover:shadow-card-hover"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{b.reservationNo}</span>
                <span className="text-hertz-black-60">{b.vehicleName}</span>
              </div>
              <p className="mt-2 text-sm text-hertz-black-80">
                {new Date(b.pickupAt).toLocaleDateString()} –{" "}
                {new Date(b.dropoffAt).toLocaleDateString()}
              </p>
              <p className="mt-1 text-sm text-hertz-black-60">
                {b.pickupLocation}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
