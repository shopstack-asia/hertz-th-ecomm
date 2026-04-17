"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CorporateCarRentalServicesSectionResolved } from "@/lib/cms/websiteHomeCorporateCarRentalServices";

type CorporateCarRentalServicesSectionProps = {
  data: CorporateCarRentalServicesSectionResolved;
};

/**
 * Full-bleed CMS banner (`CORPORATE_CAR_RENTAL_SERVICES`): one `<Link>` over the creative.
 */
export function CorporateCarRentalServicesSection({
  data,
}: CorporateCarRentalServicesSectionProps) {
  const { t } = useLanguage();
  const alt = data.backgroundAlt || t("home.corporate_car_rental.banner_aria");

  return (
    <section aria-label={alt} className="w-full bg-black">
      <Link
        href={data.ctaHref}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hertz-yellow"
      >
        <img
          src={data.backgroundImageSrc}
          alt={alt}
          className="block h-auto w-full max-w-full align-middle"
          loading="lazy"
          decoding="async"
        />
      </Link>
    </section>
  );
}
