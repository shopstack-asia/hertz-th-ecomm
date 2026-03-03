"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePromotionOptional } from "@/contexts/PromotionContext";
import { useLanguage } from "@/contexts/LanguageContext";

const BAR_HEIGHT = 44;

/**
 * Global promotion bar below main navigation.
 * Visible when promoCode is set; never auto-removes invalid promo.
 */
export function PromotionBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const promotion = usePromotionOptional();
  const { t } = useLanguage();

  if (!promotion || promotion.promoCode === null) return null;

  const { promoCode, validation, clearPromotion } = promotion;
  const isValid = validation?.status === "valid";
  const message = validation?.message ?? promoCode;
  const reason = validation?.reason ?? validation?.message;
  const discountLabel = validation?.discountLabel ?? t("promotion.discount");

  const handleRemove = () => {
    clearPromotion();
    const next = new URLSearchParams(searchParams.toString());
    next.delete("promo");
    const query = next.toString();
    router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
  };

  return (
    <div
      className="flex w-full items-center justify-between border-b border-[#E6D98A] px-4 lg:px-6"
      style={{
        minHeight: BAR_HEIGHT,
        maxHeight: BAR_HEIGHT,
        backgroundColor: "#FFF6CC",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        {isValid ? (
          <>
            <span className="font-semibold text-black">
              {t("promotion.applied_with_discount", { code: promoCode, discount: discountLabel })}
            </span>
          </>
        ) : (
          <>
            <span className="text-hertz-black-90" aria-hidden>
              ⚠
            </span>
            <span className="font-medium text-black">{t("promotion.not_applicable", { code: promoCode })}</span>
            {reason && (
              <span className="truncate text-hertz-black-70">
                {t("promotion.reason")}: {reason}
              </span>
            )}
          </>
        )}
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="ml-3 shrink-0 border-0 bg-transparent py-2 text-sm font-semibold text-black underline decoration-black/50 underline-offset-2 hover:decoration-black focus:outline-none focus:ring-2 focus:ring-black/20"
      >
        {t("common.remove")}
      </button>
    </div>
  );
}
