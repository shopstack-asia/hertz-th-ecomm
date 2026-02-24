"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { CheckoutPricePanel } from "@/components/vehicle/CheckoutPricePanel";
import { EnhanceYourRentalSection } from "@/components/vehicle/EnhanceYourRentalSection";
import { RentalDetailsSection } from "@/components/vehicle/RentalDetailsSection";
import {
  PromotionsSection,
  type VoucherDetail,
  type PointsRedemptionSelection,
} from "@/components/vehicle/PromotionsSection";
import { RenterFormSection } from "@/components/vehicle/RenterFormSection";
import { StickyBottomBar } from "@/components/layout/StickyBottomBar";
import { LoginModal } from "@/components/auth/LoginModal";
import { useAuth } from "@/contexts/auth_context";
import { proxyFetch } from "@/lib/api/proxy_fetch";
import type { VehicleDetail } from "@/types";
import type { Location } from "@/types";
import type { PointsRedemptionOption } from "@/types/loyalty";

interface PriceResponse {
  base_price: number;
  line_items: { description: string; amount: number }[];
  vat_rate: number;
  vat_amount: number;
  pay_later_total: number;
  pay_now_total: number;
  currency: string;
  rental_days: number;
  product_promo?: { label: string; amount: number };
  promo_code?: { code: string; amount: number };
  voucher_discounts: { code: string; amount: number }[];
  benefit_vouchers_applied?: boolean;
  promo_code_error?: string;
  breakdown?: {
    rental: { description: string; amount: number };
    addons: { description: string; amount: number; key?: string }[];
    subtotal: number;
    voucher_lines: { description: string; amount: number }[];
    points_line?: { description: string; amount: number };
    campaign_line?: { description: string; amount: number };
    vat: { description: string; amount: number };
    total: number;
  };
  applied_vouchers?: { code: string; label: string; amount: number }[];
  applied_campaign?: { label: string; amount: number };
  points_used?: { id: string; label: string; amount: number };
}

const defaultPickup = () => new Date(Date.now()).toISOString().slice(0, 16);
const defaultDropoff = () =>
  new Date(Date.now() + 86400000).toISOString().slice(0, 16);

function VehicleDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const groupCode = params.groupCode as string;

  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickup = searchParams.get("pickup") ?? "";
  const dropoff = searchParams.get("dropoff") ?? pickup;
  const pickupAtParam = searchParams.get("pickupAt") ?? "";
  const dropoffAtParam = searchParams.get("dropoffAt") ?? "";
  const pickupNameParam = searchParams.get("pickupName") ?? pickup;
  const dropoffNameParam = searchParams.get("dropoffName") ?? dropoff;

  const [pickupAt, setPickupAt] = useState(pickupAtParam || defaultPickup());
  const [dropoffAt, setDropoffAt] = useState(dropoffAtParam || defaultDropoff());
  const [pickupCode, setPickupCode] = useState(pickup);
  const [dropoffCode, setDropoffCode] = useState(dropoff);
  const [pickupName, setPickupName] = useState(pickupNameParam);
  const [dropoffName, setDropoffName] = useState(dropoffNameParam);

  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [appliedVouchers, setAppliedVouchers] = useState<VoucherDetail[]>([]);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [selectedPointsRedemption, setSelectedPointsRedemption] = useState<PointsRedemptionSelection | null>(null);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [pointsRedemptionOptions, setPointsRedemptionOptions] = useState<PointsRedemptionOption[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [coveredByVoucher, setCoveredByVoucher] = useState<string[]>([]);
  const [campaign, setCampaign] = useState<{
    type: "percent_off_rental" | "percent_off_total" | "free_insurance";
    value?: number;
    label?: string;
  } | null>(null);

  const [renterName, setRenterName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [driverName, setDriverName] = useState("");

  const rentalDays = useMemo(() => {
    if (!pickupAt || !dropoffAt) return 1;
    const ms = new Date(dropoffAt).getTime() - new Date(pickupAt).getTime();
    return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  }, [pickupAt, dropoffAt]);

  const [pricing, setPricing] = useState<PriceResponse | null>(null);

  const { authenticated, user: authUser } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"PAY_LATER" | "PAY_NOW" | null>(null);

  // Pre-fill Renter & contact from logged-in user when fields are empty
  useEffect(() => {
    if (!authenticated || !authUser) return;
    setRenterName((prev) =>
      prev.trim() ? prev : `${authUser.first_name} ${authUser.last_name}`.trim()
    );
    setContactEmail((prev) => (prev.trim() ? prev : authUser.email || ""));
  }, [authenticated, authUser]);

  // Pre-fill phone from account profile when logged in and phone empty
  useEffect(() => {
    if (!authenticated || contactPhone.trim()) return;
    fetch("/api/account/profile", { credentials: "include" })
      .then((r) => r.json())
      .then((profile: { phone?: string }) => {
        if (profile?.phone) {
          setContactPhone((prev) => (prev.trim() ? prev : profile.phone || ""));
        }
      })
      .catch(() => {});
  }, [authenticated, contactPhone]);

  const fetchPrice = useCallback(async () => {
    setPriceLoading(true);
    setPromoCodeError(null);
    try {
      const res = await fetch("/api/checkout/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: groupCode,
          rental_days: rentalDays,
          promotion_code: appliedPromoCode || undefined,
          vouchers: appliedVouchers.map((v) => ({
            code: v.code,
            type: v.type,
            value: v.value,
            benefit: v.benefit,
          })),
          addon_ids: selectedAddonIds,
          campaign: campaign || undefined,
          points_redemption: selectedPointsRedemption
            ? {
                id: selectedPointsRedemption.id,
                type: selectedPointsRedemption.type,
                label: selectedPointsRedemption.label,
                discount_amount: selectedPointsRedemption.discount_amount,
                addon_key: selectedPointsRedemption.addon_key,
              }
            : undefined,
        }),
      });
      const data = await res.json();
      if (data.promo_code_error) setPromoCodeError(data.promo_code_error);
      setPricing(data);
    } catch {
      setPricing(null);
    } finally {
      setPriceLoading(false);
    }
  }, [groupCode, rentalDays, appliedPromoCode, appliedVouchers, selectedAddonIds, campaign, selectedPointsRedemption]);

  useEffect(() => {
    fetch(`/api/vehicle/${groupCode}`)
      .then((r) => r.json())
      .then(setVehicle)
      .finally(() => setLoading(false));
  }, [groupCode]);

  useEffect(() => {
    if (pickupAtParam) setPickupAt(pickupAtParam);
    if (dropoffAtParam) setDropoffAt(dropoffAtParam);
    if (pickup) setPickupCode(pickup);
    if (dropoff) setDropoffCode(dropoff);
    if (pickupNameParam) setPickupName(pickupNameParam);
    if (dropoffNameParam) setDropoffName(dropoffNameParam);
  }, [pickupAtParam, dropoffAtParam, pickup, dropoff, pickupNameParam, dropoffNameParam]);

  useEffect(() => {
    if (vehicle && pickupAt && dropoffAt && new Date(dropoffAt) > new Date(pickupAt)) {
      fetchPrice();
    } else {
      setPricing(null);
    }
  }, [vehicle, pickupAt, dropoffAt, fetchPrice]);

  useEffect(() => {
    if (!authenticated) {
      setAvailablePoints(0);
      setPointsRedemptionOptions([]);
      return;
    }
    Promise.all([
      fetch("/api/loyalty/points", { credentials: "include" }).then((r) => r.json()),
      fetch(
        `/api/loyalty/redemption-options?vehicleGroupCode=${encodeURIComponent(groupCode)}&rentalDays=${rentalDays}&addonIds=${selectedAddonIds.join(",")}`,
        { credentials: "include" }
      ).then((r) => r.json()),
    ]).then(([pointsRes, optionsRes]) => {
      setAvailablePoints(pointsRes.available_points ?? 0);
      setPointsRedemptionOptions((Array.isArray(optionsRes) ? optionsRes : []) as PointsRedemptionOption[]);
    }).catch(() => {
      setAvailablePoints(0);
      setPointsRedemptionOptions([]);
    });
  }, [authenticated, groupCode, rentalDays, selectedAddonIds.join(",")]);

  useEffect(() => {
    const types = appliedVouchers.map((v) => v.type);
    if (types.length === 0) {
      setCoveredByVoucher([]);
      return;
    }
    fetch("/api/voucher-benefits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voucher_types: types }),
    })
      .then((r) => r.json())
      .then((data: { covered_addon_ids?: string[] }) => {
        const ids = Array.isArray(data.covered_addon_ids) ? data.covered_addon_ids : [];
        setCoveredByVoucher(ids);
        setSelectedAddonIds((prev) => [...new Set([...prev, ...ids])]);
      })
      .catch(() => setCoveredByVoucher([]));
  }, [appliedVouchers]);

  useEffect(() => {
    const code = appliedPromoCode?.trim().toUpperCase();
    if (!code) {
      setCampaign(null);
      return;
    }
    fetch(`/api/campaign-logic?code=${encodeURIComponent(code)}`)
      .then((r) => r.json())
      .then((data: { campaign?: { type: string; value?: number; label?: string } }) => {
        if (data.campaign && ["percent_off_rental", "percent_off_total", "free_insurance"].includes(data.campaign.type)) {
          setCampaign({
            type: data.campaign.type as "percent_off_rental" | "percent_off_total" | "free_insurance",
            value: data.campaign.value,
            label: data.campaign.label,
          });
        } else {
          setCampaign(null);
        }
      })
      .catch(() => setCampaign(null));
  }, [appliedPromoCode]);

  const handlePickupChange = useCallback((code: string, loc?: Location) => {
    setPickupCode(code);
    if (loc) setPickupName(loc.name);
  }, []);

  const handleDropoffChange = useCallback((code: string, loc?: Location) => {
    setDropoffCode(code);
    if (loc) setDropoffName(loc.name);
  }, []);

  const handleVoucherAdd = useCallback(
    async (code: string) => {
      setVoucherError(null);
      const trimmed = code.trim().toUpperCase();
      if (appliedVouchers.some((v) => v.code === trimmed)) {
        setVoucherError("Voucher already applied");
        return;
      }
      if (appliedVouchers.some((v) => v.stackable === false)) {
        setVoucherError("This voucher cannot be combined with other offers.");
        return;
      }
      try {
        const res = await fetch("/api/voucher/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setVoucherError(data.error ?? "Failed to apply voucher");
          return;
        }
        if (data.voucher) {
          const v = data.voucher;
          if (v.stackable === false && appliedVouchers.length > 0) {
            setVoucherError("This voucher cannot be combined with other offers.");
            return;
          }
          setAppliedVouchers((prev) => [...prev, v]);
        }
      } catch {
        setVoucherError("Failed to apply voucher");
      }
    },
    [appliedVouchers]
  );

  const handleApplyMyVouchers = useCallback((vouchers: VoucherDetail[]) => {
    setVoucherError(null);
    const existingCodes = new Set(appliedVouchers.map((v) => v.code));
    const now = new Date().toISOString();
    const toAdd: VoucherDetail[] = [];
    const invalid: string[] = [];
    for (const v of vouchers) {
      if (existingCodes.has(v.code)) continue;
      if (v.expired_at < now) {
        invalid.push(`${v.code} (expired)`);
        continue;
      }
      toAdd.push(v);
      existingCodes.add(v.code);
    }
    const combined = [...appliedVouchers, ...toAdd];
    if (combined.length > 1 && combined.some((v) => v.stackable === false)) {
      setVoucherError("This voucher cannot be combined with other offers.");
      return;
    }
    if (toAdd.length > 0) {
      setAppliedVouchers((prev) => [...prev, ...toAdd]);
    }
    if (invalid.length > 0) {
      setVoucherError(`Could not apply: ${invalid.join(", ")}`);
    }
  }, [appliedVouchers]);

  const buildBookingPayload = useCallback(() => {
    const voucherCode = appliedVouchers[0]?.code;
    return {
      vehicleGroupCode: groupCode,
      pickupLocation: pickupName,
      pickupAt,
      dropoffLocation: dropoffName,
      dropoffAt,
      renterName: renterName.trim(),
      driverName: driverName.trim() || undefined,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      voucherCode,
    };
  }, [
    groupCode,
    pickupName,
    dropoffName,
    pickupAt,
    dropoffAt,
    renterName,
    driverName,
    contactEmail,
    contactPhone,
    appliedVouchers,
  ]);

  const executePendingAction = useCallback(
    async (action: "PAY_LATER" | "PAY_NOW" | null) => {
      const runAction = action ?? pendingAction;
      setPendingAction(null);
      if (!runAction) return;
      if (!renterName.trim() || !contactEmail.trim() || !contactPhone.trim()) return;
      if (!pickupAt || !dropoffAt || !pickupName || !dropoffName) return;
      if (new Date(dropoffAt) <= new Date(pickupAt)) return;

      setSubmitting(true);
      try {
        const payload = buildBookingPayload();
        if (runAction === "PAY_LATER") {
          const payLaterTotal = pricing?.pay_later_total ?? 0;
          const res = await proxyFetch<{ booking_ref: string }>("/api/booking/create", {
            method: "POST",
            body: JSON.stringify({ ...payload, total: payLaterTotal }),
          });
          router.push(`/thank-you?booking_ref=${encodeURIComponent(res.booking_ref)}&type=pay_later`);
        } else {
          const payNowTotal = pricing?.pay_now_total ?? 0;
          const res = await proxyFetch<{ payment_url: string }>("/api/payment/create-session", {
            method: "POST",
            body: JSON.stringify({ ...payload, total: payNowTotal }),
          });
          window.location.href = res.payment_url;
        }
      } catch {
        setSubmitting(false);
      }
    },
    [
      pendingAction,
      buildBookingPayload,
      pricing?.pay_later_total,
      pricing?.pay_now_total,
      renterName,
      contactEmail,
      contactPhone,
      pickupAt,
      dropoffAt,
      pickupName,
      dropoffName,
      router,
    ]
  );

  const handlePay = useCallback(
    async (type: "PAY_LATER" | "PAY_NOW") => {
      if (!renterName.trim() || !contactEmail.trim() || !contactPhone.trim()) return;
      if (!pickupAt || !dropoffAt || !pickupName || !dropoffName) return;
      if (new Date(dropoffAt) <= new Date(pickupAt)) return;

      if (!authenticated) {
        setPendingAction(type);
        setLoginModalOpen(true);
        return;
      }

      setSubmitting(true);
      try {
        const payload = buildBookingPayload();
        if (type === "PAY_LATER") {
          const payLaterTotal = pricing?.pay_later_total ?? 0;
          const res = await proxyFetch<{ booking_ref: string }>("/api/booking/create", {
            method: "POST",
            body: JSON.stringify({ ...payload, total: payLaterTotal }),
          });
          router.push(`/thank-you?booking_ref=${encodeURIComponent(res.booking_ref)}&type=pay_later`);
        } else {
          const payNowTotal = pricing?.pay_now_total ?? 0;
          const res = await proxyFetch<{ payment_url: string }>("/api/payment/create-session", {
            method: "POST",
            body: JSON.stringify({ ...payload, total: payNowTotal }),
          });
          window.location.href = res.payment_url;
        }
      } catch {
        setSubmitting(false);
      } finally {
        setSubmitting(false);
      }
    },
    [
      authenticated,
      renterName,
      contactEmail,
      contactPhone,
      pickupAt,
      dropoffAt,
      pickupName,
      dropoffName,
      buildBookingPayload,
      pricing?.pay_later_total,
      pricing?.pay_now_total,
      groupCode,
      router,
    ]
  );

  const handleLoginSuccess = useCallback(() => {
    setLoginModalOpen(false);
    const action = pendingAction;
    if (action) executePendingAction(action);
  }, [pendingAction, executePendingAction]);

  const isValid =
    !!vehicle &&
    !!pickupAt &&
    !!dropoffAt &&
    new Date(dropoffAt) > new Date(pickupAt) &&
    !!pickupName &&
    !!dropoffName &&
    !!renterName.trim() &&
    !!contactEmail.trim() &&
    !!contactPhone.trim();

  const lineItems = pricing?.line_items ?? [
    {
      description: `Rental (${rentalDays} day${rentalDays > 1 ? "s" : ""})`,
      amount: 0,
    },
    { description: "VAT (7%)", amount: 0 },
  ];
  const payLaterTotal = pricing?.pay_later_total ?? 0;
  const payNowTotal = pricing?.pay_now_total ?? 0;
  const currency = pricing?.currency ?? "THB";
  const hasProductPromo = !!(pricing?.product_promo);
  const benefitVouchersApplied = !!(pricing?.benefit_vouchers_applied);

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-6 py-12">
        <div className="h-96 animate-pulse bg-hertz-gray" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-container px-6 py-12 text-center">
        <p className="text-hertz-black-80">Vehicle not found.</p>
        <Link href="/vehicles" className="mt-4 inline-block font-bold text-black underline">
          Browse vehicles
        </Link>
      </div>
    );
  }

  const images =
    vehicle.images?.length > 0
      ? vehicle.images
      : [{ url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800" }];

  const pricePanel = (
    <>
      {benefitVouchersApplied && (
        <div className="mb-3 flex items-center gap-2 border border-[#FFCC00] bg-[#FFCC00]/10 px-3 py-2">
          <span className="text-sm font-medium text-black">
            Benefit Voucher Applied
          </span>
        </div>
      )}
      <CheckoutPricePanel
        lineItems={lineItems}
        payLaterTotal={payLaterTotal}
        payNowTotal={payNowTotal}
        currency={currency}
        onPayLater={() => handlePay("PAY_LATER")}
        onPayNow={() => handlePay("PAY_NOW")}
        isValid={isValid}
        loading={submitting || priceLoading}
        breakdown={pricing?.breakdown}
        appliedVouchers={pricing?.applied_vouchers}
        appliedCampaign={pricing?.applied_campaign}
        pointsUsed={pricing?.points_used}
        benefitVouchersApplied={benefitVouchersApplied}
      />
    </>
  );

  return (
    <div className="mx-auto max-w-container px-6 py-8 pb-28 lg:pb-12 lg:py-12">
      <div className="lg:grid lg:grid-cols-[65%_35%] lg:gap-8">
        {/* Left column 65% */}
        <div className="space-y-6">
          {/* 1. Vehicle overview */}
          <section className="border border-hertz-border bg-white p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <div className="aspect-[4/3] bg-hertz-gray">
                  <div
                    className="h-full w-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(${images[imageIndex]?.url ?? images[0].url})`,
                    }}
                  />
                </div>
                {images.length > 1 && (
                  <div className="mt-2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        className={`h-16 w-20 border-2 ${
                          i === imageIndex ? "border-black" : "border-hertz-border"
                        }`}
                      >
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${images[i].url})` }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black lg:text-3xl">{vehicle.name}</h1>
                <p className="mt-1 text-sm uppercase tracking-wide text-hertz-black-60">
                  {vehicle.category}
                </p>
                {vehicle.description && (
                  <p className="mt-4 text-hertz-black-80">{vehicle.description}</p>
                )}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-hertz-black-60">Seats</span>
                    <p className="font-bold">{vehicle.seats}</p>
                  </div>
                  <div>
                    <span className="text-xs text-hertz-black-60">Transmission</span>
                    <p className="font-bold">
                      {vehicle.transmission === "A" ? "Automatic" : "Manual"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-hertz-black-60">Luggage</span>
                    <p className="font-bold">{vehicle.luggage}</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-hertz-border pt-6">
                  <h2 className="text-lg font-bold text-black">Inclusions</h2>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-hertz-black-80">
                    {vehicle.inclusions.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Rental details */}
          <RentalDetailsSection
            pickup={pickupCode}
            dropoff={dropoffCode}
            pickupAt={pickupAt}
            dropoffAt={dropoffAt}
            pickupName={pickupName}
            dropoffName={dropoffName}
            onPickupChange={handlePickupChange}
            onDropoffChange={handleDropoffChange}
            onPickupAtChange={setPickupAt}
            onDropoffAtChange={setDropoffAt}
          />

          {/* 3. Renter & contact */}
          <RenterFormSection
            renterName={renterName}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            driverName={driverName}
            onRenterNameChange={setRenterName}
            onContactEmailChange={setContactEmail}
            onContactPhoneChange={setContactPhone}
            onDriverNameChange={setDriverName}
            isAuthed={authenticated}
            authUser={authUser}
            onLoginClick={() => {
              const returnUrl =
                pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
              router.push(`/account/login?returnUrl=${encodeURIComponent(returnUrl)}`);
            }}
          />

          {/* 4. Enhance your rental — optional add-ons */}
          <EnhanceYourRentalSection
            vehicleId={groupCode}
            seats={vehicle?.seats ?? 0}
            rentalDays={rentalDays}
            oneWay={pickupCode !== dropoffCode}
            selectedAddonIds={selectedAddonIds}
            coveredByVoucher={[
              ...coveredByVoucher,
              ...(selectedPointsRedemption?.addon_key ? [selectedPointsRedemption.addon_key] : []),
            ]}
            onSelectionChange={setSelectedAddonIds}
          />

          {/* 5. Promotions & discounts */}
          <PromotionsSection
            appliedPromoCode={appliedPromoCode}
            promoCodeError={promoCodeError}
            appliedVouchers={appliedVouchers}
            onPromoCodeApply={setAppliedPromoCode}
            onPromoCodeRemove={() => setAppliedPromoCode(null)}
            onVoucherAdd={handleVoucherAdd}
            onVoucherRemove={(i) =>
              setAppliedVouchers((prev) => prev.filter((_, idx) => idx !== i))
            }
            onApplyMyVouchers={handleApplyMyVouchers}
            voucherError={voucherError}
            hasProductPromo={hasProductPromo}
            authenticated={authenticated}
            rentalDays={rentalDays}
            availablePoints={availablePoints}
            pointsRedemptionOptions={pointsRedemptionOptions}
            selectedPointsRedemption={selectedPointsRedemption}
            onPointsRedemptionChange={(opt) => {
              const prevAddonKey = selectedPointsRedemption?.addon_key;
              setSelectedPointsRedemption(opt);
              if (opt?.addon_key) {
                setSelectedAddonIds((prev) =>
                  prev.includes(opt.addon_key!) ? prev : [...prev, opt.addon_key!]
                );
              } else if (prevAddonKey) {
                setSelectedAddonIds((prev) => prev.filter((id) => id !== prevAddonKey));
              }
            }}
          />
        </div>

        {/* Right column 35% - sticky price panel */}
        <div className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24 hidden lg:block">{pricePanel}</div>
        </div>
      </div>

      {/* Mobile: price summary in stack + sticky Pay buttons */}
      <div className="mt-6 lg:hidden">
        <div className="border border-hertz-border bg-white p-4 transition-opacity duration-150">
          {benefitVouchersApplied && (
            <div className="mb-3 flex items-center gap-2 border border-[#FFCC00] bg-[#FFCC00]/10 px-3 py-2">
              <span className="text-sm font-medium text-black">
                Benefit Voucher Applied
              </span>
            </div>
          )}
          <h3 className="text-lg font-bold text-black">Price summary</h3>
          <dl className="mt-3 space-y-2">
            {lineItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <dt className="text-hertz-black-80">{item.description}</dt>
                <dd className={`transition-opacity duration-150 ${item.amount < 0 ? "text-green-700" : ""}`}>
                  {item.amount < 0 ? "-" : ""}
                  ฿{Math.abs(item.amount).toLocaleString()}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 flex justify-between gap-4 border-t border-hertz-border pt-3">
            <span className="text-sm font-medium text-hertz-black-80">
              Pay later: ฿{payLaterTotal.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-hertz-black-80">
              Pay now: ฿{payNowTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <LoginModal
        open={loginModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleLoginSuccess}
      />

      {/* Mobile: sticky Pay buttons with totals */}
      <StickyBottomBar>
        <div className="flex gap-3 transition-opacity duration-150">
          <button
            type="button"
            onClick={() => handlePay("PAY_LATER")}
            disabled={!isValid || submitting || priceLoading}
            className="flex h-12 flex-1 items-center justify-center border-2 border-black bg-white font-bold text-black disabled:opacity-50"
          >
            Pay later - ฿{payLaterTotal.toLocaleString()}
          </button>
          <button
            type="button"
            onClick={() => handlePay("PAY_NOW")}
            disabled={!isValid || submitting || priceLoading}
            className="flex h-12 flex-1 items-center justify-center bg-[#FFCC00] font-bold text-black disabled:opacity-50"
          >
            {submitting ? "Processing..." : `Pay now - ฿${payNowTotal.toLocaleString()}`}
          </button>
        </div>
      </StickyBottomBar>
    </div>
  );
}

export default function VehicleDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-container px-6 py-12">
          <div className="h-96 animate-pulse bg-hertz-gray" />
        </div>
      }
    >
      <VehicleDetailContent />
    </Suspense>
  );
}
