"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { PriceSummaryCard } from "@/components/checkout/PriceSummaryCard";
import { StickyBottomBar } from "@/components/layout/StickyBottomBar";
import { useAuth } from "@/contexts/auth_context";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePromotionOptional } from "@/contexts/PromotionContext";
import { proxyFetch } from "@/lib/api/proxy_fetch";
import type { PricingBreakdown } from "@/types";

type Step = "details" | "extras" | "review" | "payment";

function CheckoutContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { user: authUser, isAuthed } = useAuth();
  const promotion = usePromotionOptional();

  const groupCode = searchParams.get("groupCode") ?? "";
  const bookingType = (searchParams.get("bookingType") ?? "PAY_LATER") as
    | "PAY_LATER"
    | "PAY_NOW";
  const pickup = searchParams.get("pickup") ?? "";
  const dropoff = searchParams.get("dropoff") ?? pickup;
  const pickupAt = searchParams.get("pickupAt") ?? "";
  const dropoffAt = searchParams.get("dropoffAt") ?? "";

  const [step, setStep] = useState<Step>("details");
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const [renterName, setRenterName] = useState("");
  const [driverName, setDriverName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const pickupLocationName = searchParams.get("pickupName") ?? pickup;
  const dropoffLocationName = searchParams.get("dropoffName") ?? dropoff;

  const prefillFromAuth = useCallback(() => {
    if (!authUser) return;
    setRenterName((prev) =>
      prev.trim() ? prev : `${authUser.first_name} ${authUser.last_name}`.trim()
    );
    setContactEmail((prev) => (prev.trim() ? prev : authUser.email ?? ""));
    setContactPhone((prev) => (prev.trim() ? prev : authUser.phone ?? ""));
  }, [authUser]);

  useEffect(() => {
    if (!isAuthed || !authUser) return;
    prefillFromAuth();
  }, [isAuthed, authUser, prefillFromAuth]);

  const loginReturnUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const promoCodeForValidate = promotion?.promoCode ?? null;
  useEffect(() => {
    if (
      !promoCodeForValidate ||
      !pickupAt ||
      !dropoffAt ||
      !pickupLocationName ||
      !dropoffLocationName
    )
      return;
    promotion?.validatePromotion(
      {
        pickup_location: pickupLocationName,
        dropoff_location: dropoffLocationName,
        pickup_date: pickupAt,
        dropoff_date: dropoffAt,
      },
      promoCodeForValidate
    );
  }, [
    promoCodeForValidate,
    pickupAt,
    dropoffAt,
    pickupLocationName,
    dropoffLocationName,
  ]);

  useEffect(() => {
    proxyFetch<{ valid: boolean; breakdown?: PricingBreakdown }>(
      "/api/pricing/validate",
      {
        method: "POST",
        body: JSON.stringify({
          vehicleGroupCode: groupCode,
          pickupAt,
          dropoffAt,
          voucherCode: voucherCode || undefined,
          bookingType,
        }),
      }
    )
      .then((r) => r.breakdown && setPricing(r.breakdown))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [groupCode, pickupAt, dropoffAt, voucherCode, bookingType]);

  const handleApplyVoucher = () => {
    setLoading(true);
    proxyFetch<{ valid: boolean; breakdown?: PricingBreakdown }>(
      "/api/pricing/validate",
      {
        method: "POST",
        body: JSON.stringify({
          vehicleGroupCode: groupCode,
          pickupAt,
          dropoffAt,
          voucherCode: voucherCode || undefined,
          bookingType,
        }),
      }
    )
      .then((r) => r.breakdown && setPricing(r.breakdown))
      .finally(() => setLoading(false));
  };

  const canProceedDetails = renterName && contactEmail && contactPhone;

  const handleSubmit = async () => {
    if (!renterName || !contactEmail || !contactPhone) return;
    setSubmitting(true);
    try {
      const res = await proxyFetch<{ reservationNo: string; status: string }>(
        "/api/reservation/create",
        {
          method: "POST",
          body: JSON.stringify({
            vehicleGroupCode: groupCode,
            pickupLocation: pickupLocationName,
            pickupAt,
            dropoffLocation: dropoffLocationName,
            dropoffAt,
            bookingType,
            renterName,
            driverName: driverName || undefined,
            contactEmail,
            contactPhone,
            voucherCode: voucherCode || undefined,
          }),
        }
      );

      if (bookingType === "PAY_LATER") {
        router.push(`/booking/${res.reservationNo}`);
      } else {
        const payRes = await proxyFetch<{ paymentRedirectUrl: string }>(
          "/api/payment/initiate",
          {
            method: "POST",
            body: JSON.stringify({ reservationNo: res.reservationNo }),
          }
        );
        const url = new URL(payRes.paymentRedirectUrl);
        url.searchParams.set("reservationNo", res.reservationNo);
        router.push(url.pathname + url.search);
      }
    } catch {
      // error handling
    } finally {
      setSubmitting(false);
    }
  };

  const steps: Step[] = ["details", "extras", "review", "payment"];
  const stepIndex = steps.indexOf(step);
  const canContinue =
    step === "details"
      ? canProceedDetails
      : step === "review"
        ? true
        : true;

  const stepLabels = [
    { id: "details" as const, label: t("checkout.step_details") },
    { id: "extras" as const, label: t("checkout.step_extras") },
    { id: "review" as const, label: t("checkout.step_review") },
    { id: "payment" as const, label: t("checkout.payment_step") },
  ];

  return (
    <div className="mx-auto max-w-container px-6 py-8 pb-28 lg:pb-12 lg:py-12">
      <StepIndicator current={step} steps={stepLabels} />

      <div className="mt-8 lg:flex lg:gap-12">
        <div className="flex-1">
          {/* Step 1: Details */}
          {step === "details" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="text-xl font-bold text-black">
                {t("checkout.renter_contact_title")}
              </h2>

              {!isAuthed ? (
                <div className="mt-6 rounded-xl border border-hertz-border bg-white p-4 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hertz-gray/60 text-hertz-black-80">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-black">
                          {t("checkout.login_title")}
                        </p>
                        <p className="mt-1 text-sm text-hertz-black-60">
                          {t("checkout.login_body")}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/account/login?returnUrl=${encodeURIComponent(loginReturnUrl)}`
                          )
                        }
                        className="flex h-12 min-w-[120px] items-center justify-center rounded-xl bg-hertz-yellow font-bold text-hertz-black-90"
                      >
                        {t("checkout.log_in")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-hertz-black-60">
                  {t("checkout.signed_in_as").replace(
                    "{name}",
                    authUser ? `${authUser.first_name} ${authUser.last_name}`.trim() : ""
                  )}
                </p>
              )}

              {isAuthed && (
                <div className="mt-6 space-y-4">
                  <FormField
                    label={t("checkout.full_name_renter")}
                    value={renterName}
                    onChange={(e) => setRenterName(e.target.value)}
                    required
                  />
                  <FormField
                    label={t("checkout.driver_name_optional")}
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder={t("checkout.optional")}
                  />
                  <FormField
                    label={t("checkout.email")}
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                  <FormField
                    label={t("checkout.phone")}
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Extras */}
          {step === "extras" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-black">
                {t("checkout.promo_extras")}
              </h2>
              {promotion?.promoCode && (
                <div className="mb-6 border border-hertz-border bg-white p-4">
                  {promotion.validation?.status === "valid" ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-green-700">
                        ✓ {t("promotion.applied_with_discount", { code: promotion.promoCode, discount: promotion.validation?.discountLabel ?? t("promotion.discount") })}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          promotion.clearPromotion();
                          const next = new URLSearchParams(searchParams.toString());
                          next.delete("promo");
                          router.replace(pathname + (next.toString() ? `?${next.toString()}` : ""));
                        }}
                        className="text-sm font-medium text-hertz-black-80 hover:underline"
                      >
                        {t("common.remove")}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-medium text-amber-800">
                          ⚠ {t("promotion.not_applicable", { code: promotion.promoCode })}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            promotion.clearPromotion();
                            const next = new URLSearchParams(searchParams.toString());
                            next.delete("promo");
                            router.replace(pathname + (next.toString() ? `?${next.toString()}` : ""));
                          }}
                          className="text-sm font-medium text-hertz-black-80 hover:underline"
                        >
                          {t("common.remove")}
                        </button>
                      </div>
                      {promotion.validation?.reason && (
                        <p className="text-sm text-hertz-black-70">
                          {t("promotion.reason")}: {promotion.validation.reason}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-hertz-black-80">
                  {t("booking.promotion_code")}
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder={t("checkout.voucher_placeholder")}
                    className="min-h-tap flex-1 border border-hertz-border px-4 py-3 text-hertz-black-80"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="min-h-tap border-2 border-black px-6 font-bold text-black"
                  >
                    {t("checkout.apply_voucher")}
                  </button>
                </div>
                <p className="mt-2 text-sm text-hertz-black-60">
                  {t("checkout.try_hertz10")}
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-bold text-black">
                  {t("checkout.optional_addons")}
                </h3>
                <p className="mt-2 text-sm text-hertz-black-80">
                  {t("checkout.addons_at_pickup")}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-black">
                {t("checkout.review_title")}
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-hertz-black-60">{t("checkout.renter")}</dt>
                  <dd className="font-medium">{renterName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">{t("checkout.email")}</dt>
                  <dd className="font-medium">{contactEmail}</dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">{t("checkout.phone")}</dt>
                  <dd className="font-medium">{contactPhone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">{t("thankYou.pickup")}</dt>
                  <dd className="font-medium">{pickupLocationName}</dd>
                  <dd className="text-sm text-hertz-black-80">
                    {new Date(pickupAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">{t("thankYou.drop_off")}</dt>
                  <dd className="font-medium">{dropoffLocationName}</dd>
                  <dd className="text-sm text-hertz-black-80">
                    {new Date(dropoffAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === "payment" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-black">
                {bookingType === "PAY_NOW" ? t("checkout.payment_step") : t("checkout.confirm_step")}
              </h2>
              {bookingType === "PAY_NOW" ? (
                <p className="text-hertz-black-80">
                  {t("checkout.redirect_payment")}
                </p>
              ) : (
                <p className="text-hertz-black-80">
                  {t("thankYou.pay_at_counter")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: summary (desktop) */}
        <div className="mt-8 lg:mt-0 lg:w-96">
          <div className="lg:sticky lg:top-24">
            {pricing && <PriceSummaryCard pricing={pricing} />}

            {/* Desktop: continue / submit */}
            <div className="mt-6 hidden lg:block">
              {step === "payment" ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex h-12 w-full items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
                >
                  {submitting ? t("checkout.processing") : t("checkout.confirm_booking")}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setStep(steps[Math.min(stepIndex + 1, steps.length - 1)])
                  }
                  disabled={step === "details" ? !canProceedDetails : false}
                  className="flex h-12 w-full items-center justify-center border-2 border-black font-bold text-black disabled:opacity-50"
                >
                  {t("common.continue")}
                </button>
              )}
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(steps[stepIndex - 1])}
                  className="mt-3 w-full py-2 text-sm font-medium text-hertz-black-80 hover:text-black"
                >
                  {t("checkout.back")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: sticky bottom bar */}
      <StickyBottomBar>
        {step === "payment" ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-12 w-full items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
          >
            {submitting ? t("checkout.processing") : t("checkout.confirm_booking")}
          </button>
        ) : (
          <div className="flex gap-3">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStep(steps[stepIndex - 1])}
                className="flex h-12 flex-1 items-center justify-center border-2 border-black font-bold text-black"
              >
                {t("checkout.back")}
              </button>
            )}
            <button
              onClick={() =>
                setStep(steps[Math.min(stepIndex + 1, steps.length - 1)])
              }
              disabled={step === "details" ? !canProceedDetails : false}
              className="flex h-12 flex-1 items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
            >
              {t("common.continue")}
            </button>
          </div>
        )}
      </StickyBottomBar>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-container px-6 py-12" />}>
      <CheckoutContent />
    </Suspense>
  );
}
