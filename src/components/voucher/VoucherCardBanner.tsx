"use client";

/**
 * Premium voucher card banner — lighter, corporate tone.
 * FIXED: Light grey hero, bold black value, yellow underline.
 * PERCENT: Charcoal gradient + reduced overlay, soft glow, yellow bar only at bottom.
 * 16:9, lazy load, subtle hover.
 */
const PERCENT_BG_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80";

export interface VoucherBannerProps {
  type: "FIXED" | "PERCENT";
  value: number;
  /** Optional badge overlay e.g. "Save ฿200" or "Limited Time" */
  badge?: string;
  /** Compact = smaller typography for listing cards */
  compact?: boolean;
  /** No hover scale (e.g. when inside detail page) */
  static?: boolean;
  /** Show gift ribbon accent on FIXED cards */
  giftAccent?: boolean;
  className?: string;
}

export function VoucherCardBanner({
  type,
  value,
  badge,
  compact = false,
  static: isStatic = false,
  giftAccent = false,
  className = "",
}: VoucherBannerProps) {
  const isFixed = type === "FIXED";

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden ${
        isFixed
          ? "border-b border-[#E5E5E5] bg-[#F2F2F2]"
          : "bg-[#1E1E1E]"
      } ${
        isStatic
          ? ""
          : "transition-all duration-300 group-hover:scale-[1.01] group-hover:brightness-105"
      } ${className}`}
      style={
        !isFixed
          ? { boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }
          : undefined
      }
    >
      {/* FIXED: Light theme — grey top, bold black value, yellow underline */}
      {isFixed && (
        <>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-bold tracking-tight text-black ${
                compact ? "text-2xl lg:text-3xl" : "text-3xl lg:text-4xl"
              }`}
            >
              ฿{value.toLocaleString()}
            </span>
            <span
              className="mt-1.5 block h-0.5 w-14 bg-[#FFCC00]"
              aria-hidden
            />
          </div>
          {badge && (
            <span className="absolute right-2 top-2 bg-[#FFCC00] px-2 py-0.5 text-[10px] font-bold text-black">
              {badge}
            </span>
          )}
          {giftAccent && (
            <div
              className="absolute right-0 top-0 h-10 w-10 border-l-[20px] border-t-[20px] border-l-[#FFCC00]/30 border-t-transparent"
              aria-hidden
            />
          )}
        </>
      )}

      {/* PERCENT: Image + charcoal overlay 40%, subtle radial highlight, yellow bar bottom only */}
      {!isFixed && (
        <>
          <img
            src={PERCENT_BG_IMAGE}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "linear-gradient(165deg, #1E1E1E 0%, #2C2C2C 50%, #252525 100%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(44,44,44,0.6) 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 border border-white/[0.08]"
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFCC00]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={`font-bold tracking-tight text-white ${
                compact ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl"
              }`}
              style={{
                textShadow: "0 0 20px rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              {value}%
            </span>
            <span className="mt-1 block h-0.5 w-12 bg-[#FFCC00]" />
          </div>
          {badge && (
            <span className="absolute right-2 top-2 bg-[#FFCC00] px-2 py-0.5 text-[10px] font-bold text-black">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );
}
