"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { MembersLoyaltyProgramSectionResolved } from "@/lib/cms/websiteHomeMembersLoyalty";

type MembersLoyaltyProgramSectionProps = {
  data: MembersLoyaltyProgramSectionResolved;
};

/**
 * CMS banner is often a full-bleed creative (copy and faux buttons baked into the image).
 * We render the asset at natural aspect ratio (`w-full` + `h-auto`) and apply one real
 * link from `config.config.link` over the whole banner.
 */
export function MembersLoyaltyProgramSection({ data }: MembersLoyaltyProgramSectionProps) {
  const { t } = useLanguage();
  const alt = data.backgroundAlt || t("home.members.loyalty.bg_aria");

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
