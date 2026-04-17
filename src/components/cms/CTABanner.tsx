"use client";

import Link from "next/link";
import type { CmsCtaBannerSection } from "@/types/cms";

interface CTABannerProps {
  section: CmsCtaBannerSection;
}

export function CTABanner({ section }: CTABannerProps) {
  return (
    <section className="border-b border-hertz-border py-12 lg:py-16">
      <div className="mx-auto max-w-container px-12">
        <div className="flex flex-col items-center justify-center border border-hertz-border bg-black py-16 text-center lg:py-20">
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            {section.heading}
          </h2>
          <p className="mt-4 max-w-xl text-white/90">
            {section.subheading}
          </p>
          <Link
            href={section.button_link}
            className="mt-8 inline-block min-h-tap bg-[#FFCC00] px-10 py-4 font-bold text-black transition-colors hover:bg-[#FFCC00]/90"
          >
            {section.button_label}
          </Link>
        </div>
      </div>
    </section>
  );
}
