"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LocationSelect } from "./LocationSelect";
import { DateTimePicker } from "./DateTimePicker";
import { useBooking } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePromotionOptional } from "@/contexts/PromotionContext";

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDisplayDate(dateValue: string): string {
  if (!dateValue) return "Select date";
  const d = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateValue;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function parseDateKey(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return null;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function isBeforeDateKey(a: string, b: string): boolean {
  return a < b;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, "0");
  const m = i % 2 === 0 ? "00" : "30";
  return `${h}:${m}`;
});

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOLIDAYS_BY_MONTH: Record<string, string[]> = {
  "2026-05": ["May 1 Labour Day", "May 4 Coronation Day", "May 31 Visakha Bucha Day"],
  "2026-06": ["Jun 1 Substitute Holiday for Visakha Bucha", "Jun 3 Queen Suthida's Birthday"],
  "2026-07": ["Jul 28 King's Birthday", "Jul 29 Asanha Bucha Day", "Jul 30 Buddhist Lent Day"],
};

function getHolidayDaySet(monthKey: string): Set<number> {
  const items = HOLIDAYS_BY_MONTH[monthKey] ?? [];
  const result = new Set<number>();
  for (const item of items) {
    const m = item.match(/^[A-Za-z]{3}\s+(\d{1,2})\b/);
    if (!m) continue;
    const day = Number(m[1]);
    if (!Number.isNaN(day)) result.add(day);
  }
  return result;
}

interface BookingFormProps {
  onSearch?: () => void;
  dark?: boolean;
  layout?: "vertical" | "horizontal";
}

export function BookingForm({ onSearch, dark = false, layout = "vertical" }: BookingFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const promotion = usePromotionOptional();
  const {
    pickupLocation,
    pickupLocationName,
    dropoffLocation,
    dropoffLocationName,
    sameAsPickup,
    pickupDate,
    pickupTime,
    dropoffDate,
    dropoffTime,
    setPickupLocation,
    setDropoffLocation,
    setSameAsPickup,
    setPickupDateTime,
    setDropoffDateTime,
  } = useBooking();

  const [promoInput, setPromoInput] = useState("");
  const today = new Date();

  useEffect(() => {
    const fromContext = promotion?.promoCode ?? "";
    if (fromContext && promoInput === "") setPromoInput(fromContext);
  }, [promotion?.promoCode]);

  const promoDisplay = promoInput || (promotion?.promoCode ?? "");
  const minDate = toDatetimeLocal(today).slice(0, 10);

  const handleSearch = async () => {
    const pickupAt = `${pickupDate}T${pickupTime}:00`;
    const dropoffAt = `${dropoffDate}T${dropoffTime}:00`;
    const dropoff = sameAsPickup ? pickupLocation : dropoffLocation;
    const dropoffName = sameAsPickup ? pickupLocationName : dropoffLocationName;
    const params = new URLSearchParams({
      pickup: pickupLocation,
      dropoff,
      pickupAt,
      dropoffAt,
      pickupName: pickupLocationName || pickupLocation,
      dropoffName: dropoffName || dropoff,
    });

    const code = (promoInput || (promotion?.promoCode ?? "")).trim().toUpperCase();
    if (code && promotion) {
      promotion.setPromoCode(code);
      await promotion.validatePromotion(
        {
          pickup_location: pickupLocationName || pickupLocation,
          dropoff_location: dropoffName || dropoff,
          pickup_date: pickupAt,
          dropoff_date: dropoffAt,
        },
        code
      );
      params.set("promo", code);
    }

    router.push(`/search?${params}`);
    onSearch?.();
  };

  const dropoff = sameAsPickup ? pickupLocation : dropoffLocation;

  const isHorizontal = layout === "horizontal";
  const labelHidden = isHorizontal;

  // Match Trip.com-style grouped blocks:
  // - DateTimeGroup renders separate date + time in one block (with divider + chevron)
  // - LocationGroup renders pickup + drop-off side-by-side with a single arrow between them
  const inputBase = "min-h-tap px-4 py-3 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30";
  const inputLight = "border border-gray-300 text-hertz-black-80 disabled:bg-gray-100";
  const inputDark = "border border-white/40 bg-white/10 text-white";
  const dateTimeValueClass = dark ? "text-white" : "text-[#12284B]";
  const barFrameClass = dark ? "border border-white/40 bg-black/20" : "border border-hertz-border bg-white";

  function DateTimeGroupBlock({
    label,
    dateValue,
    timeValue,
    minDateValue,
    onDateChange,
    onTimeChange,
    idPrefix,
  }: {
    label: string;
    dateValue: string;
    timeValue: string;
    minDateValue?: string;
    onDateChange: (nextDate: string) => void;
    onTimeChange: (nextTime: string) => void;
    idPrefix: string;
  }) {
    const dateId = `${idPrefix}-date`;
    const dateInputRef = useRef<HTMLInputElement | null>(null);
    const timeMenuRef = useRef<HTMLDivElement | null>(null);
    const calendarRef = useRef<HTMLDivElement | null>(null);
    const [timeMenuOpen, setTimeMenuOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [viewMonth, setViewMonth] = useState<Date>(() => {
      const parsed = parseDateKey(dateValue);
      return parsed ?? new Date();
    });

    const openPicker = (input: HTMLInputElement | null) => {
      if (!input) return;
      if (typeof input.showPicker === "function") input.showPicker();
      else input.focus();
    };

    useEffect(() => {
      if (!timeMenuOpen) return;
      const onPointerDown = (e: MouseEvent) => {
        if (!timeMenuRef.current?.contains(e.target as Node)) setTimeMenuOpen(false);
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [timeMenuOpen]);

    useEffect(() => {
      if (!calendarOpen) return;
      const onPointerDown = (e: MouseEvent) => {
        if (!calendarRef.current?.contains(e.target as Node)) setCalendarOpen(false);
      };
      document.addEventListener("mousedown", onPointerDown);
      return () => document.removeEventListener("mousedown", onPointerDown);
    }, [calendarOpen]);

    const renderMonthGrid = (monthDate: Date, showTitle = true) => {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();
      const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
      const holidays = HOLIDAYS_BY_MONTH[monthKey] ?? [];
      const holidayDays = getHolidayDaySet(monthKey);
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();
      const cells: Array<{ date: Date; inMonth: boolean }> = [];

      for (let i = firstDay - 1; i >= 0; i--) {
        cells.push({ date: new Date(year, month - 1, prevMonthDays - i), inMonth: false });
      }
      for (let i = 1; i <= daysInMonth; i++) {
        cells.push({ date: new Date(year, month, i), inMonth: true });
      }
      while (cells.length < 42) {
        const day = cells.length - (firstDay + daysInMonth) + 1;
        cells.push({ date: new Date(year, month + 1, day), inMonth: false });
      }

      return (
        <div className="min-w-0">
          {showTitle && (
            <div className="mb-2 text-center text-2xl font-medium text-white">
              {monthDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
          )}
          <div className="grid grid-cols-7 gap-y-1 text-sm font-normal text-white/70">
            {DAY_LABELS.map((d) => (
              <div key={d} className="py-1 text-center">{d}</div>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-y-1">
            {cells.map(({ date: cell, inMonth }) => {
              const key = toDateKey(cell);
              const disabled = minDateValue ? isBeforeDateKey(key, minDateValue) : false;
              const selected = key === dateValue;
              const hasHolidayMarker = inMonth && holidayDays.has(cell.getDate());
              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabled}
                  onMouseDown={() => {
                    onDateChange(key);
                    setCalendarOpen(false);
                  }}
                  className={`relative mx-auto flex h-10 w-10 items-center justify-center text-[14px] font-normal ${
                    disabled
                      ? "cursor-not-allowed text-white/35"
                      : selected
                        ? "bg-hertz-yellow font-semibold text-black"
                        : inMonth
                          ? "text-white hover:bg-hertz-yellow hover:text-black"
                          : "text-white/40 hover:bg-hertz-yellow/60 hover:text-black"
                  }`}
                >
                  {cell.getDate()}
                  {hasHolidayMarker && (
                    <span
                      className={`absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full ${
                        selected ? "bg-black/70" : "bg-white/55"
                      }`}
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 min-h-[72px] border-t border-white/20 pt-3">
            {holidays.map((h) => (
              <p key={h} className="mb-1 text-sm text-white/60">
                • {h}
              </p>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className={`${isHorizontal ? "relative flex h-full flex-col" : `${barFrameClass} relative flex h-full flex-col`}`}>
        <label
          htmlFor={dateId}
          className={`px-4 pt-2 text-sm font-medium ${dark ? "text-white/80" : "text-hertz-black-60"}`}
        >
          {label}
        </label>

        {/* Bottom row: [date] [divider] [time] [chevron] */}
        <div className="flex flex-1 items-center">
          <button
            type="button"
            onClick={() => {
              const parsed = parseDateKey(dateValue);
              setViewMonth(parsed ?? new Date());
              setCalendarOpen((v) => !v);
              setTimeMenuOpen(false);
            }}
            className={`flex h-10 min-w-0 flex-1 items-center px-4 py-1 text-left text-[15px] font-semibold leading-none ${dateTimeValueClass}`}
          >
            <span className="block whitespace-nowrap">
              {formatDisplayDate(dateValue)}
            </span>
          </button>

          <div className={`h-9 w-px shrink-0 ${dark ? "bg-white/40" : "bg-hertz-border"}`} aria-hidden />

          <div ref={timeMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setTimeMenuOpen((v) => !v)}
              className={`flex h-10 w-24 items-center px-3 py-1 text-left text-[16px] font-semibold leading-none whitespace-nowrap ${dateTimeValueClass}`}
            >
              {timeValue || "10:00"}
            </button>
            {timeMenuOpen && (
              <ul
                className="absolute left-0 top-full z-[1200] mt-1 max-h-80 w-32 overflow-y-auto border border-white/40 bg-black py-1 text-white shadow-card"
                role="listbox"
                aria-label={`${label} time options`}
              >
                {TIME_OPTIONS.map((opt) => (
                  <li
                    key={opt}
                    role="option"
                    aria-selected={opt === timeValue}
                    onMouseDown={() => {
                      onTimeChange(opt);
                      setTimeMenuOpen(false);
                    }}
                    className={`cursor-pointer px-3 py-2 text-sm ${
                      opt === timeValue
                        ? "bg-hertz-yellow font-semibold text-black"
                        : "text-white/90 hover:bg-hertz-yellow hover:text-black"
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            ref={dateInputRef}
            id={dateId}
            type="date"
            value={dateValue}
            min={minDateValue}
            onChange={(e) => onDateChange(e.target.value)}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            tabIndex={-1}
            aria-hidden
          />
        </div>

        {calendarOpen && (
          <div
            ref={calendarRef}
            className="absolute left-1/2 top-full z-[1300] -mt-5 w-[860px] max-w-[96vw] -translate-x-1/2 border border-white/30 bg-black p-4 shadow-card"
          >
            <div className="mb-3 grid grid-cols-[40px_1fr_1fr_40px] items-center">
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, -1))}
                className="flex h-8 w-8 items-center justify-center text-2xl text-white/70 hover:text-white"
                aria-label="Previous month"
              >
                ‹
              </button>
              <div className="text-center text-2xl font-medium text-white">
                {viewMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <div className="text-center text-2xl font-medium text-white">
                {addMonths(viewMonth, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
              <button
                type="button"
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
                className="flex h-8 w-8 items-center justify-center justify-self-end text-2xl text-white/70 hover:text-white"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderMonthGrid(viewMonth, false)}
              {renderMonthGrid(addMonths(viewMonth, 1), false)}
            </div>
            <div className="mt-3 border-t border-white/20 pt-3 text-center text-sm text-white/60">
              All dates are in local time
            </div>
          </div>
        )}
      </div>
    );
  }

  function LocationGroup() {
    if (sameAsPickup) {
      return (
        <div className="relative flex h-full flex-1 items-stretch">
          <div
            className={
              dark
                ? "flex flex-1 items-stretch overflow-visible bg-transparent"
                : "flex flex-1 items-stretch overflow-visible bg-transparent"
            }
          >
            <div className="flex flex-1 items-stretch">
              <div className="flex flex-1 flex-col">
                <div className={`px-4 pt-2 text-sm font-medium ${dark ? "text-white/80" : "text-hertz-black-60"}`}>
                  {t("booking.pickup_location")}
                </div>
                <div className="px-0 pb-1">
                  <LocationSelect
                    label={t("booking.pickup_location")}
                    value={pickupLocation}
                    onChange={(code, loc) => setPickupLocation(code, loc?.name ?? "")}
                    placeholder="Airport, city, station, region..."
                    dark={dark}
                    displayName={pickupLocationName}
                    hideLabel
                    borderless
                    hideChevron
                    popupStyle={isHorizontal}
                    fullTextDisplay
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative flex h-full flex-1 items-stretch">
        {/* Outer single border to mimic one block */}
        <div
          className={
            dark
              ? "flex flex-1 items-stretch overflow-visible bg-transparent"
              : "flex flex-1 items-stretch overflow-visible bg-transparent"
          }
        >
          {/* Pickup */}
          <div className="flex flex-1 items-stretch">
            <div className="flex flex-1 flex-col border-r border-white/10">
              <div className={`px-4 pt-2 text-sm font-medium ${dark ? "text-white/80" : "text-hertz-black-60"}`}>
                {t("booking.pickup_location")}
              </div>
              <div className="pb-1">
                <LocationSelect
                  label={t("booking.pickup_location")}
                  value={pickupLocation}
                  onChange={(code, loc) => setPickupLocation(code, loc?.name ?? "")}
                  placeholder="Airport, city, station, region..."
                  dark={dark}
                  displayName={pickupLocationName}
                  hideLabel
                  borderless
                  hideChevron
                  popupStyle={isHorizontal}
                />
              </div>
            </div>
          </div>

          {/* Drop-off */}
          <div className="flex flex-1 items-stretch">
            <div className={`flex flex-1 flex-col ${sameAsPickup ? "opacity-60" : ""}`}>
              <div className={`px-4 pt-2 text-sm font-medium ${dark ? "text-white/80" : "text-hertz-black-60"}`}>
                {t("booking.dropoff_location")}
              </div>
              <div className="pb-1">
                <LocationSelect
                  label={t("booking.dropoff_location")}
                  value={dropoffLocation}
                  onChange={(code, loc) => setDropoffLocation(code, loc?.name ?? "")}
                  placeholder="Airport, city, station, region..."
                  dark={dark}
                  displayName={dropoffLocationName}
                  hideLabel
                  disabled={sameAsPickup}
                  borderless
                  hideChevron
                  popupStyle={isHorizontal}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Arrow overlay in the middle of the block */}
        <div
          className={`pointer-events-none absolute inset-y-0 left-1/2 z-10 flex w-10 -translate-x-1/2 items-center justify-center ${
            dark ? "text-white/90" : "text-hertz-black-80"
          }`}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    );
  }

  function PickupDateTimeGroup() {
    return (
      <DateTimeGroupBlock
        label={t("booking.pickup_date")}
        dateValue={pickupDate}
        timeValue={pickupTime}
        minDateValue={minDate}
        onDateChange={(d) => setPickupDateTime(d, pickupTime)}
        onTimeChange={(time) => setPickupDateTime(pickupDate, time)}
        idPrefix="pickup"
      />
    );
  }

  function DropoffDateTimeGroup() {
    return (
      <DateTimeGroupBlock
        label={t("booking.dropoff_date")}
        dateValue={dropoffDate}
        timeValue={dropoffTime}
        minDateValue={pickupDate}
        onDateChange={(d) => setDropoffDateTime(d, dropoffTime)}
        onTimeChange={(time) => setDropoffDateTime(dropoffDate, time)}
        idPrefix="dropoff"
      />
    );
  }

  function PromotionCodeBlock() {
    return (
      <div className={`${isHorizontal ? "flex h-full min-w-0 flex-col" : `${barFrameClass} flex h-full min-w-0 flex-col`}`}>
        <label className={`px-4 pt-2 text-sm font-medium whitespace-nowrap ${dark ? "text-white/80" : "text-hertz-black-60"}`}>
          Promotion code
        </label>
        <input
          type="text"
          value={promoDisplay}
          onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
          placeholder="Promo code"
          className={
            dark
              ? "h-10 w-full border-0 bg-transparent px-4 py-1 text-[16px] font-semibold leading-none text-white placeholder:text-white/50 focus:outline-none focus:ring-0"
              : "h-10 w-full border-0 bg-transparent px-4 py-1 text-[16px] font-semibold leading-none text-[#12284B] placeholder:text-hertz-black-50 focus:outline-none focus:ring-0"
          }
        />
      </div>
    );
  }

  function SearchButton() {
    return (
      <button
        type="button"
        onClick={handleSearch}
        disabled={!pickupLocation || !dropoff}
        className="flex w-14 min-w-[56px] self-stretch items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
        aria-label={t("booking.continue")}
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>
    );
  }

  return (
    <div className={isHorizontal ? "space-y-2" : "space-y-4"}>
      <div className={`flex items-center gap-2 ${isHorizontal ? "lg:pt-1" : ""}`}>
          <input
            id="same-as-pickup"
            type="checkbox"
            checked={!sameAsPickup}
            onChange={(e) => setSameAsPickup(!e.target.checked)}
            className={dark ? "h-4 w-4 border-white/40" : "h-4 w-4 border-gray-300"}
          />
          <label htmlFor="same-as-pickup" className={dark ? "text-sm text-white/90" : "text-sm text-hertz-black-80"}>
            Drop off at a different location
          </label>
        </div>

      {isHorizontal ? (
          <div className={`${barFrameClass} flex flex-nowrap items-stretch gap-x-0 divide-x ${dark ? "divide-white/30" : "divide-hertz-border"} overflow-visible rounded`}>
          <div className="flex-[2.2] min-w-0">
            <LocationGroup />
          </div>
          <div className="flex-[0.92] min-w-0">
            <PickupDateTimeGroup />
          </div>
          <div className="flex-[0.92] min-w-0">
            <DropoffDateTimeGroup />
          </div>
          <div className="flex-[0.5] min-w-[108px]">
            <PromotionCodeBlock />
          </div>
          <SearchButton />
        </div>
      ) : (
        <>
          <LocationSelect
            label={t("booking.pickup_location")}
            value={pickupLocation}
            onChange={(code, loc) => setPickupLocation(code, loc?.name ?? "")}
            placeholder="Enter city or airport"
            dark={dark}
            displayName={pickupLocationName}
          />
          <DateTimePicker
            label={t("booking.pickup_date")}
            dateValue={pickupDate}
            timeValue={pickupTime}
            onDateChange={(d) => setPickupDateTime(d, pickupTime)}
            onTimeChange={(time) => setPickupDateTime(pickupDate, time)}
            minDate={minDate}
            dark={dark}
          />
          {!sameAsPickup && (
            <LocationSelect
              label={t("booking.dropoff_location")}
              value={dropoffLocation}
              onChange={(code, loc) => setDropoffLocation(code, loc?.name ?? "")}
              placeholder="Enter city or airport"
              dark={dark}
              displayName={dropoffLocationName}
            />
          )}
          <DateTimePicker
            label={t("booking.dropoff_date")}
            id="dropoff-datetime"
            dateValue={dropoffDate}
            timeValue={dropoffTime}
            onDateChange={(d) => setDropoffDateTime(d, dropoffTime)}
            onTimeChange={(time) => setDropoffDateTime(dropoffDate, time)}
            minDate={pickupDate}
            dark={dark}
          />
          <div>
            <label
              className={
                dark
                  ? "mb-1 block text-sm font-medium text-white/90"
                  : "mb-1 block text-sm font-medium text-hertz-black-80"
              }
            >
              Promotion code
            </label>
            <input
              type="text"
              value={promoDisplay}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE10"
              className={
                dark
                  ? "min-h-tap w-full border border-white/40 bg-black/30 px-4 py-3 text-white placeholder:text-white/50 focus:border-hertz-yellow focus:outline-none focus:ring-1 focus:ring-hertz-yellow"
                  : "min-h-tap w-full border border-hertz-border px-4 py-3 text-hertz-black-80 placeholder:text-hertz-black-60 focus:border-[#FFCC00] focus:outline-none focus:ring-1 focus:ring-[#FFCC00]"
              }
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={!pickupLocation || !dropoff}
            className="flex h-12 w-full items-center justify-center bg-hertz-yellow font-bold text-black disabled:opacity-50"
          >
            {t("booking.continue")}
          </button>
        </>
      )}
    </div>
  );
}
