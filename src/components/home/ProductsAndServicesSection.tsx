"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ProductsAndServicesSectionResolved } from "@/lib/cms/websiteHomeProductsAndServices";

type ProductsAndServicesSectionProps = {
  data: ProductsAndServicesSectionResolved;
};

/**
 * Full-bleed CMS banner: one `<Link>` over the creative (`config.config.link`).
 * Image: `config.config.image[]` or `/images/home/products-and-services.webp`.
 */
export function ProductsAndServicesSection({ data }: ProductsAndServicesSectionProps) {
  const { t } = useLanguage();
  const alt = data.backgroundAlt || t("home.products_services.banner_aria");

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
