"use client";

import Link from "next/link";
import type { CmsHero } from "@/types/cms";

interface HeroSectionProps {
  hero: CmsHero;
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="relative min-h-[320px] lg:min-h-[400px]">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero.background_image})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative mx-auto flex min-h-[320px] max-w-container flex-col justify-center px-6 py-16 lg:min-h-[400px] lg:py-24">
        <h1 className="text-3xl font-bold text-white drop-shadow-md lg:text-5xl">
          {hero.heading}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/95 lg:text-xl">
          {hero.subheading}
        </p>
        <Link
          href={hero.cta_link}
          className="mt-8 inline-block min-h-tap bg-[#FFCC00] px-8 py-4 font-bold text-black transition-colors hover:bg-[#FFCC00]/90"
        >
          {hero.cta_label}
        </Link>
      </div>
    </section>
  );
}
