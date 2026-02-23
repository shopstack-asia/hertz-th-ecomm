"use client";

import type { CardStyle } from "@/app/api/vouchers/catalog/route";

export interface VoucherProductTileProps {
  cardStyle: CardStyle;
  /** For fixed_value / percent; optional for benefit tiles */
  value?: number;
  /** Short label for benefit tiles (e.g. "FREE ADD-ON") */
  label?: string;
  compact?: boolean;
  static?: boolean;
  className?: string;
}

export function VoucherProductTile({
  cardStyle,
  value = 0,
  label,
  compact = false,
  static: isStatic = false,
  className = "",
}: VoucherProductTileProps) {
  const base =
    "relative aspect-video w-full overflow-hidden rounded-t " +
    (isStatic ? "" : "transition-all duration-300 group-hover:scale-[1.01] group-hover:brightness-[1.02] ") +
    className;

  // ---- fixed_value: light grey, bold ฿ value, yellow underline ----
  if (cardStyle === "fixed_value") {
    return (
      <div
        className={`${base} border-b border-[#E5E5E5] bg-[#F2F2F2]`}
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold tracking-tight text-black ${
              compact ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
            }`}
          >
            ฿{value.toLocaleString()}
          </span>
          <span className="mt-1.5 block h-0.5 w-14 bg-[#FFCC00]" aria-hidden />
        </div>
      </div>
    );
  }

  // ---- percent: gradient (no car image), bold % value, yellow bar ----
  if (cardStyle === "percent") {
    return (
      <div
        className={base}
        style={{
          background: "linear-gradient(165deg, #2C2C2C 0%, #1E1E1E 50%, #252525 100%)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-bold tracking-tight text-white ${
              compact ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl"
            }`}
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
          >
            {value}%
          </span>
          <span className="mt-1 block h-0.5 w-12 bg-[#FFCC00]" aria-hidden />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFCC00]" />
      </div>
    );
  }

  // ---- benefit tiles: white/light grey, icon + label, yellow accent ----
  const benefitBase = `${base} bg-white`;
  const accentBar = <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFCC00]" aria-hidden />;

  if (cardStyle === "child_seat") {
    return (
      <div
        className={benefitBase}
        style={{
          border: "1px solid #E5E5E5",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-[#666]">
          {label ?? "FREE ADD-ON"}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-12 w-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-4-6h8M8 14h8M6 8a2 2 0 012-2h8a2 2 0 012 2v10H6V8z" />
          </svg>
          <span className="mt-2 text-sm font-bold text-black">Child Seat</span>
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-[#FFCC00]" aria-hidden />
        {accentBar}
      </div>
    );
  }

  if (cardStyle === "gps") {
    return (
      <div
        className={benefitBase}
        style={{
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 bg-[#2C2C2C]" aria-hidden />
        <div className="absolute inset-0 bottom-0 left-0 right-0 top-1/2 bg-white" aria-hidden />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-14 w-14 text-[#2C2C2C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
          </svg>
          <span className="mt-2 text-sm font-bold text-black">GPS</span>
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-[#FFCC00]" aria-hidden />
        {accentBar}
      </div>
    );
  }

  if (cardStyle === "easy_pass") {
    return (
      <div
        className={benefitBase}
        style={{
          border: "1px solid #E5E5E5",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-[#666]">
          {label ?? "FREE ADD-ON"}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-12 w-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h2m14 0h2M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6M9 12h6" />
          </svg>
          <span className="mt-2 text-sm font-bold text-black">Easy Pass</span>
        </div>
        {accentBar}
      </div>
    );
  }

  if (cardStyle === "additional_driver") {
    return (
      <div
        className={benefitBase}
        style={{
          border: "1px solid #E5E5E5",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-[#666]">
          {label ?? "FREE ADD-ON"}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-12 w-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="mt-2 text-center text-sm font-bold text-black">Additional Driver</span>
        </div>
        <div className="absolute right-0 top-0 h-full w-1 bg-[#FFCC00]" aria-hidden />
        {accentBar}
      </div>
    );
  }

  if (cardStyle === "insurance") {
    return (
      <div
        className={benefitBase}
        style={{
          background: "linear-gradient(180deg, #F8F8F8 0%, #FFFFFF 50%)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-[#666]">
          {label ?? "INSURANCE"}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-14 w-14 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="mt-2 text-center text-sm font-bold text-black">Premium Insurance</span>
        </div>
        {accentBar}
      </div>
    );
  }

  if (cardStyle === "drop_fee") {
    return (
      <div
        className={benefitBase}
        style={{
          border: "1px solid #E5E5E5",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-[#666]">
          {label ?? "SERVICE WAIVER"}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-12 w-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h4" />
          </svg>
          <span className="mt-2 text-center text-sm font-bold text-black">One-way Drop Fee</span>
        </div>
        {accentBar}
      </div>
    );
  }

  if (cardStyle === "upgrade") {
    return (
      <div
        className={benefitBase}
        style={{
          border: "1px solid #E5E5E5",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="absolute left-3 top-3 text-[10px] font-bold uppercase tracking-wider text-[#666]">
          {label ?? "SERVICE WAIVER"}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg className="h-12 w-12 text-[#333]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="mt-2 text-center text-sm font-bold text-black">Vehicle Upgrade</span>
        </div>
        <div className="absolute left-0 top-0 h-full w-1 bg-[#FFCC00]" aria-hidden />
        {accentBar}
      </div>
    );
  }

  // fallback
  return (
    <div className={`${base} bg-[#F2F2F2]`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium text-black">{label ?? "Voucher"}</span>
      </div>
      {accentBar}
    </div>
  );
}
