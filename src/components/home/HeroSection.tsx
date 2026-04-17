"use client";

import { useCallback, useEffect, useState } from "react";
import { BookingForm } from "@/components/booking/BookingForm";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HomeHeroCarouselResolved } from "@/lib/cms/websiteHomeHeroCarousel";

type HeroSectionProps = {
  carousel: HomeHeroCarouselResolved;
};

export function HeroSection({ carousel }: HeroSectionProps) {
  const { t } = useLanguage();
  const { slides, autoPlay, intervalMs } = carousel;
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((i) => (slides.length <= 1 ? 0 : (i + 1) % slides.length));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || !autoPlay) return;
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = window.setInterval(advance, intervalMs);
    return () => window.clearInterval(id);
  }, [advance, autoPlay, intervalMs, slides.length]);

  return (
    <section
      id="booking"
      className="relative z-30 min-h-[min(88vh,760px)] overflow-hidden bg-black text-white"
      aria-roledescription="carousel"
      aria-label={t("home.hero.carousel_aria")}
    >
      <div className="absolute inset-0 z-0 bg-black" aria-hidden />

      {slides.map((slide, i) => (
        <div
          key={`${slide.src}-${i}`}
          className={`absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat transition-opacity duration-[900ms] ease-in-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.src})` }}
          role="img"
          aria-hidden={i !== activeIndex}
          aria-label={slide.alt}
        />
      ))}

      <div
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(to_right,rgba(0,0,0,0.97)_0%,rgba(0,0,0,0.92)_18%,rgba(0,0,0,0.82)_32%,rgba(0,0,0,0.62)_48%,rgba(0,0,0,0.38)_62%,rgba(0,0,0,0.14)_76%,rgba(0,0,0,0)_88%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[min(88vh,760px)] max-w-container flex-col px-6 pb-10 pt-8 lg:pb-14 lg:pt-10">
        <div className="animate-fade-in rounded-md border border-white/25 bg-black/55 p-4 shadow-elevated backdrop-blur-md">
          <h2 className="text-base font-bold text-white">{t("home.hero.search_availability")}</h2>

          <div className="hidden lg:block lg:mt-3">
            <BookingForm dark layout="horizontal" />
          </div>
          <div className="mt-3 lg:hidden">
            <BookingForm dark layout="vertical" />
          </div>
        </div>

        <div className="min-h-6 flex-1" aria-hidden />

        <div className="animate-fade-in-delay mt-8 max-w-xl lg:mt-0">
          <p className="text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
            {t("home.hero.headline_explore")}
          </p>
          <div className="mt-2 inline-flex max-w-full flex-col items-stretch gap-2 sm:gap-2.5">
            <div className="h-1 w-full bg-hertz-yellow" aria-hidden />
            <p className="text-3xl font-bold leading-[1.12] tracking-tight text-hertz-yellow drop-shadow-sm sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
              {t("home.hero.headline_country")}
            </p>
          </div>
          <p className="mt-4 max-w-md text-sm font-normal leading-snug text-white/95 drop-shadow-sm sm:text-base md:text-lg">
            {t("home.hero.tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
