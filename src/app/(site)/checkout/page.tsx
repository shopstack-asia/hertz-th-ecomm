"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormField } from "@/components/ui/FormField";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { PriceSummaryCard } from "@/components/checkout/PriceSummaryCard";
import { StickyBottomBar } from "@/components/layout/StickyBottomBar";
import { proxyFetch } from "@/lib/api/proxy_fetch";
import type { PricingBreakdown } from "@/types";

type Step = "details" | "extras" | "review" | "payment";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  return (
    <div className="mx-auto max-w-container px-6 py-8 pb-28 lg:pb-12 lg:py-12">
      <StepIndicator current={step} />

      <div className="mt-8 lg:flex lg:gap-12">
        <div className="flex-1">
          {/* Step 1: Details */}
          {step === "details" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-black">
                Renter & contact details
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Full name (renter)"
                  value={renterName}
                  onChange={(e) => setRenterName(e.target.value)}
                  required
                />
                <FormField
                  label="Driver name (if different)"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Optional"
                />
                <FormField
                  label="Email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
                <FormField
                  label="Phone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Extras */}
          {step === "extras" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-black">
                Promo & extras
              </h2>
              <div>
                <label className="text-sm font-medium text-hertz-black-80">
                  Voucher code
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter voucher code"
                    className="min-h-tap flex-1 border border-hertz-border px-4 py-3 text-hertz-black-80"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="min-h-tap border-2 border-black px-6 font-bold text-black"
                  >
                    Apply
                  </button>
                </div>
                <p className="mt-2 text-sm text-hertz-black-60">
                  Try &quot;HERTZ10&quot; for 10% off
                </p>
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-bold text-black">
                  Optional add-ons
                </h3>
                <p className="mt-2 text-sm text-hertz-black-80">
                  Add-ons can be selected at pick-up.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="border border-hertz-border bg-white p-6">
              <h2 className="mb-6 text-xl font-bold text-black">
                Review your booking
              </h2>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-hertz-black-60">Renter</dt>
                  <dd className="font-medium">{renterName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">Email</dt>
                  <dd className="font-medium">{contactEmail}</dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">Phone</dt>
                  <dd className="font-medium">{contactPhone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">Pick-up</dt>
                  <dd className="font-medium">{pickupLocationName}</dd>
                  <dd className="text-sm text-hertz-black-80">
                    {new Date(pickupAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-hertz-black-60">Drop-off</dt>
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
                {bookingType === "PAY_NOW" ? "Payment" : "Confirm"}
              </h2>
              {bookingType === "PAY_NOW" ? (
                <p className="text-hertz-black-80">
                  You will be redirected to complete payment.
                </p>
              ) : (
                <p className="text-hertz-black-80">
                  Pay at counter when you collect your vehicle.
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
                  {submitting ? "Processing..." : "Confirm booking"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setStep(steps[Math.min(stepIndex + 1, steps.length - 1)])
                  }
                  disabled={step === "details" ? !canProceedDetails : false}
                  className="flex h-12 w-full items-center justify-center border-2 border-black font-bold text-black disabled:opacity-50"
                >
                  Continue
                </button>
              )}
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(steps[stepIndex - 1])}
                  className="mt-3 w-full py-2 text-sm font-medium text-hertz-black-80 hover:text-black"
                >
                  Back
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
            {submitting ? "Processing..." : "Confirm booking"}
          </button>
        ) : (
          <div className="flex gap-3">
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={() => setStep(steps[stepIndex - 1])}
                className="flex h-12 flex-1 items-center justify-center border-2 border-black font-bold text-black"
              >
                Back
              </button>
            )}
            <button
              onClick={() =>
                setStep(steps[Math.min(stepIndex + 1, steps.length - 1)])
              }
              disabled={step === "details" ? !canProceedDetails : false}
              className="flex h-12 flex-1 items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
            >
              Continue
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
