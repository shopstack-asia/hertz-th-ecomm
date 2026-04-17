"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConfirmationData {
  reference: string;
  booking_ref: string;
  reservationNo: string;
  vehicleName: string;
  vehicleClass: string;
  pickupLocation: string;
  pickupAt: string;
  dropoffLocation: string;
  dropoffAt: string;
  paymentMethod: string;
  paymentStatus: string;
  addOns: { code: string; name: string; amount: number }[];
  pricing: {
    currency: string;
    rental: number;
    addonsTotal: number;
    discount: number;
    discountLines: { description: string; amount: number }[];
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    total: number;
    lineItems: { description: string; amount: number }[];
  };
}

const CARD_ANIMATION_DELAY = 80;

function getIntlLocale(locale: string): string {
  if (locale === "th") return "th-TH";
  if (locale === "zh") return "zh-CN";
  return "en-GB";
}

function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(getIntlLocale(locale), {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleTimeString(getIntlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(amount: number, currency: string): string {
  return `฿${amount.toLocaleString("th-TH")}`;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const reservationId =
    searchParams.get("reservationId") ?? searchParams.get("booking_ref") ?? "";
  const type = searchParams.get("type") ?? "pay_later";
  const { t, locale } = useLanguage();

  const [data, setData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reservationId) {
      setError("thankYou.missing_reference");
      setLoading(false);
      return;
    }
    fetch(`/api/reservations/${encodeURIComponent(reservationId)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          setError("thankYou.not_found");
          return;
        }
        setData(res);
      })
      .catch(() => setError("thankYou.load_failed"))
      .finally(() => setLoading(false));
  }, [reservationId]);

  const copyRef = useCallback(() => {
    if (!data?.reference) return;
    navigator.clipboard.writeText(data.reference).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data?.reference]);

  const downloadReceipt = useCallback(() => {
    if (!reservationId) return;
    window.open(`/api/reservations/${encodeURIComponent(reservationId)}/receipt`, "_blank");
  }, [reservationId]);

  const isPayLater = type === "pay_later" || data?.paymentStatus === "PAY_AT_COUNTER";
  const isPaid = data?.paymentStatus === "PAID";

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-8 py-12 sm:px-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
          <p className="text-hertz-black-80">{t("thankYou.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-container px-8 py-12 sm:px-12">
        <div className="mx-auto max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error ? t(error) : t("thankYou.not_found")}</p>
          <Link
            href="/"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-hertz-yellow px-6 font-semibold text-hertz-black-90"
          >
            {t("thankYou.back_to_home")}
          </Link>
        </div>
      </div>
    );
  }

  const p = data.pricing;

  return (
    <div className="mx-auto max-w-container px-8 pb-32 pt-8 sm:px-12 sm:pb-12 md:pt-12">
      {/* Top confirmation header */}
      <header className="mx-auto max-w-2xl text-center">
        <div
          className="animate-fade-in mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100"
          role="img"
          aria-hidden
        >
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="animate-fade-in mt-4 text-[32px] font-bold tracking-tight text-hertz-black-90 sm:text-[36px]">
          {t("thankYou.booking_confirmed")}
        </h1>
        <p className="animate-fade-in mt-2 text-hertz-black-80">
          {t("thankYou.we_emailed")}
        </p>
        <div
          className="animate-fade-in mt-6 inline-flex flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-hertz-gray/50 px-4 py-3"
          style={{ animationDelay: `${CARD_ANIMATION_DELAY}ms` }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
            {t("thankYou.booking_reference")}
          </span>
          <span className="font-mono text-lg font-bold tracking-wide text-black">
            {data.reference}
          </span>
          <button
            type="button"
            onClick={copyRef}
            className="ml-2 rounded-lg border border-hertz-border bg-white px-3 py-1.5 text-sm font-medium text-hertz-black-80 hover:bg-gray-50"
          >
            {copied ? t("thankYou.copied") : t("thankYou.copy")}
          </button>
        </div>
      </header>

      {/* Two-column layout */}
      <div className="mx-auto mt-8 max-w-2xl gap-6 lg:max-w-4xl lg:grid lg:grid-cols-[1fr,1fr]">
        {/* Rental summary card */}
        <section
          className="animate-fade-in rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6"
          style={{ animationDelay: `${CARD_ANIMATION_DELAY * 2}ms` }}
        >
          <h2 className="text-base font-semibold text-hertz-black-90 sm:text-lg">
            {t("thankYou.rental_summary")}
          </h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                {t("thankYou.vehicle")}
              </dt>
              <dd className="mt-0.5 font-medium text-black">
                {data.vehicleName}
                <span className="ml-2 text-sm text-hertz-black-60">
                  {data.vehicleClass}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                {t("thankYou.rental_dates")}
              </dt>
              <dd className="mt-0.5 text-black">
                {formatDate(data.pickupAt, locale)} –{" "}
                {formatDate(data.dropoffAt, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                {t("thankYou.pickup")}
              </dt>
              <dd className="mt-0.5 text-black">
                {data.pickupLocation}
                <span className="block text-sm text-hertz-black-60">
                  {formatTime(data.pickupAt, locale)}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                {t("thankYou.drop_off")}
              </dt>
              <dd className="mt-0.5 text-black">
                {data.dropoffLocation}
                <span className="block text-sm text-hertz-black-60">
                  {formatTime(data.dropoffAt, locale)}
                </span>
              </dd>
            </div>
            {data.addOns && data.addOns.length > 0 && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                  {t("thankYou.addons")}
                </dt>
                <dd className="mt-0.5 text-sm text-black">
                  {data.addOns.map((a) => a.name).join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Payment & total card */}
        <section
          className="animate-fade-in rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6"
          style={{ animationDelay: `${CARD_ANIMATION_DELAY * 3}ms` }}
        >
          <h2 className="text-base font-semibold text-hertz-black-90 sm:text-lg">
            {t("thankYou.payment_and_total")}
          </h2>
          <div className="mt-4 space-y-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                {t("thankYou.payment_method")}
              </span>
              <p className="mt-0.5 font-medium text-black">{data.paymentMethod}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-hertz-black-60">
                {t("thankYou.payment_status")}
              </span>
              <p className="mt-1">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                    isPaid
                      ? "bg-green-100 text-green-800"
                      : isPayLater
                        ? "bg-hertz-yellow/30 text-hertz-black-90"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {isPaid
                    ? t("thankYou.paid")
                    : isPayLater
                      ? t("thankYou.pay_at_counter")
                      : t("thankYou.pending")}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-[#E5E7EB] pt-4">
            {p.lineItems.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm text-black"
              >
                <span>{item.description}</span>
                <span>{formatMoney(item.amount, p.currency)}</span>
              </div>
            ))}
            {p.addonsTotal > 0 && (
              <div className="flex justify-between text-sm text-black">
                <span>{t("thankYou.addons")}</span>
                <span>{formatMoney(p.addonsTotal, p.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-black">
              <span>{t("thankYou.vat")}</span>
              <span>{formatMoney(p.vatAmount, p.currency)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-[#E5E7EB] pt-3 text-lg font-bold text-black">
              <span>{t("thankYou.total")}</span>
              <span>{formatMoney(p.total, p.currency)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* CTAs */}
      <div
        className="animate-fade-in mx-auto mt-8 max-w-2xl space-y-3 sm:flex sm:flex-wrap sm:gap-3 sm:space-y-0"
        style={{ animationDelay: `${CARD_ANIMATION_DELAY * 4}ms` }}
      >
        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 sm:w-auto sm:min-w-[180px]"
        >
          {t("thankYou.back_to_home")}
        </Link>
        <button
          type="button"
          onClick={downloadReceipt}
          className="flex h-12 w-full items-center justify-center rounded-xl border-2 border-hertz-border bg-white font-medium text-black hover:bg-hertz-gray sm:w-auto sm:min-w-[180px]"
        >
          {isPayLater
            ? t("thankYou.download_confirmation")
            : t("thankYou.download_receipt")}
        </button>
        <Link
          href={`/account/bookings/upcoming`}
          className="flex h-12 w-full items-center justify-center rounded-xl font-medium text-hertz-black-80 underline hover:text-black sm:w-auto sm:min-w-[180px]"
        >
          {t("thankYou.view_booking_details")}
        </Link>
      </div>

      {/* Toast: Copied */}
      {copied && (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-hertz-black-90 px-4 py-2 text-sm font-medium text-white shadow-lg"
          role="status"
        >
          {t("thankYou.copied")}
        </div>
      )}

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-[#E5E7EB] bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
        <button
          type="button"
          onClick={downloadReceipt}
          className="flex min-h-tap min-w-tap flex-shrink-0 items-center justify-center rounded-xl border border-hertz-border bg-white text-hertz-black-80"
          aria-label={t("thankYou.download_receipt")}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </button>
        <Link
          href="/"
          className="flex flex-1 items-center justify-center rounded-xl bg-hertz-yellow font-semibold text-hertz-black-90 min-h-tap"
        >
          {t("thankYou.back_to_home")}
        </Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-container px-8 py-12 sm:px-12">
          <div className="mx-auto max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
            <p className="text-hertz-black-80">Loading...</p>
          </div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
