"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FadeInSection } from "./FadeInSection";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HomeExclusiveOffersResolved } from "@/lib/cms/websiteHomeExclusiveOffers";

type ExclusiveOffersSectionProps = {
  data: HomeExclusiveOffersResolved;
};

const EXCLUSIVE_OFFERS_BG = "/images/exclusive_offers/exclusive-offers-bg.webp";

function isSameOriginPath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

function OfferImage({ src, alt }: { src: string; alt: string }) {
  if (!isSameOriginPath(src)) {
    return (
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-cover"
      quality={85}
    />
  );
}

function usePerPage(): number {
  const [perPage, setPerPage] = useState(4);
  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const update = () => {
      if (mqLg.matches) setPerPage(4);
      else if (mqMd.matches) setPerPage(2);
      else setPerPage(1);
    };
    update();
    mqLg.addEventListener("change", update);
    mqMd.addEventListener("change", update);
    return () => {
      mqLg.removeEventListener("change", update);
      mqMd.removeEventListener("change", update);
    };
  }, []);
  return perPage;
}

function chunkItems<T>(arr: T[], size: number): T[][] {
  if (size <= 0 || arr.length === 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function ExclusiveOffersSection({ data }: ExclusiveOffersSectionProps) {
  const { t } = useLanguage();
  const { items, autoPlay, intervalMs, ctaLabel, sectionTitle, sectionSubtitle } = data;
  const perPage = usePerPage();
  const pages = useMemo(() => chunkItems(items, perPage), [items, perPage]);
  const pageCount = Math.max(1, pages.length);

  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const [tabHidden, setTabHidden] = useState(false);
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const effectiveAutoPlay = autoPlay && !reduceMotion && !tabHidden;

  /** Extra first page at end for seamless forward wrap (same direction). */
  const { loopPages, slideCount } = useMemo(() => {
    if (pageCount <= 1) {
      return { loopPages: pages, slideCount: Math.max(1, pages.length) };
    }
    return { loopPages: [...pages, pages[0]!], slideCount: pageCount + 1 };
  }, [pages, pageCount]);

  const [slideIndex, setSlideIndex] = useState(0);
  const [disableTransition, setDisableTransition] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideIndexRef = useRef(0);
  slideIndexRef.current = slideIndex;

  useEffect(() => {
    setSlideIndex(0);
  }, [perPage, items.length, pageCount]);

  const goNext = useCallback(() => {
    if (pageCount <= 1) return;
    setSlideIndex((i) => {
      if (i >= pageCount) return 0;
      if (i < pageCount - 1) return i + 1;
      return pageCount;
    });
  }, [pageCount]);

  const goPrev = useCallback(() => {
    if (pageCount <= 1) return;
    setSlideIndex((i) => {
      if (i > 0) return i - 1;
      return pageCount - 1;
    });
  }, [pageCount]);

  const goToPage = useCallback(
    (i: number) => {
      if (i < 0 || i >= pageCount) return;
      setSlideIndex(i);
    },
    [pageCount]
  );

  useEffect(() => {
    if (!effectiveAutoPlay || pageCount <= 1) return;
    const id = window.setInterval(() => {
      setSlideIndex((i) => {
        if (i >= pageCount) return i;
        if (i < pageCount - 1) return i + 1;
        return pageCount;
      });
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [effectiveAutoPlay, pageCount, intervalMs]);

  const snapToRealStart = useCallback(() => {
    setDisableTransition(true);
    setSlideIndex(0);
    void trackRef.current?.offsetWidth;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setDisableTransition(false);
      });
    });
  }, []);

  const handleTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "transform") return;
      if (pageCount <= 1) return;
      if (slideIndexRef.current !== pageCount) return;
      snapToRealStart();
    },
    [pageCount, snapToRealStart]
  );

  useLayoutEffect(() => {
    if (!reduceMotion || pageCount <= 1) return;
    if (slideIndex !== pageCount) return;
    snapToRealStart();
  }, [reduceMotion, pageCount, slideIndex, snapToRealStart]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      )
        return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX.current;
      const threshold = 50;
      if (Math.abs(diff) > threshold) {
        if (diff > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev]
  );

  const dotActiveIndex = pageCount > 1 ? slideIndex % pageCount : 0;

  if (items.length === 0) return null;

  const heading =
    sectionTitle?.trim() || t("home.exclusive_offers.section_title");
  const subheading = sectionSubtitle?.trim() || null;

  const rowCta = (item: (typeof items)[number]) =>
    item.itemCtaLabel?.trim() || ctaLabel?.trim() || t("home.exclusive_offers.learn_more");

  return (
    <FadeInSection className="mt-[-1px]">
      <section
        className="relative overflow-hidden border-b border-white/10 bg-[#070707] py-12 text-white lg:py-16"
        role="region"
        aria-roledescription="carousel"
        aria-label={t("home.exclusive_offers.section_aria")}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${EXCLUSIVE_OFFERS_BG})` }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/88 via-black/78 to-black/90"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 100% 55% at 20% 30%, rgba(212,175,55,0.12), transparent 50%),
              radial-gradient(ellipse 90% 50% at 85% 60%, rgba(234,179,8,0.08), transparent 48%)
            `,
          }}
        />

        <div className="relative z-[1] mx-auto max-w-container px-6">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                {heading}
              </h2>
              {subheading ? (
                <p className="mt-2 text-sm text-white/75 lg:text-base">{subheading}</p>
              ) : null}
            </div>
            {pageCount > 1 ? (
              <div className="flex shrink-0 items-center gap-3 sm:pt-1">
                <button
                  type="button"
                  onClick={goPrev}
                  className="flex min-h-tap min-w-tap items-center justify-center border border-white/30 bg-black/30 text-white/90 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-black/45 hover:text-white"
                  aria-label={t("common.previous")}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="flex min-h-tap min-w-tap items-center justify-center border border-white/30 bg-black/30 text-white/90 backdrop-blur-sm transition-colors hover:border-white/50 hover:bg-black/45 hover:text-white"
                  aria-label={t("common.next")}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>

          <div
            className="relative isolate overflow-hidden touch-pan-x"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              ref={trackRef}
              onTransitionEnd={handleTrackTransitionEnd}
              className={`flex gap-0 ${disableTransition || reduceMotion ? "" : "transition-transform duration-500 ease-out motion-reduce:transition-none"}`}
              style={{
                width: `${slideCount * 100}%`,
                transform: `translate3d(-${(100 * slideIndex) / slideCount}%, 0, 0)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {loopPages.map((pageItems, pageIndex) => (
                <div
                  key={`page-${pageIndex}-${pageItems[0]?.uid ?? pageIndex}`}
                  className="grid min-w-0 shrink-0 grid-cols-1 gap-4 border-0 bg-transparent sm:gap-5 md:grid-cols-2 lg:grid-cols-4"
                  style={{
                    flex: `0 0 calc(100% / ${slideCount})`,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {pageItems.map((item) => (
                    <Link
                      key={
                        pageIndex < pageCount
                          ? item.uid
                          : `${item.uid}-loop`
                      }
                      href={item.href}
                      className="group flex min-h-0 flex-col gap-2 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
                    >
                      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#BDBDBD] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300 ease-out motion-safe:group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
                        <div className="relative aspect-square w-full shrink-0 bg-neutral-400">
                          <OfferImage src={item.imageSrc} alt={item.imageAlt} />
                        </div>
                        <div className="flex min-h-0 flex-col px-4 py-4 lg:px-5 lg:py-5">
                          <p className="text-xs font-bold uppercase tracking-wide text-black lg:text-[0.7rem]">
                            {item.cardTitle.trim() || t("home.exclusive_offers.card_heading")}
                          </p>
                          <p className="mt-2 line-clamp-3 text-sm leading-snug text-black/90">
                            {item.cardDescription?.trim() ||
                              t("home.exclusive_offers.card_description")}
                          </p>
                        </div>
                      </div>
                      <div className="flex min-h-0 shrink-0 items-center rounded-xl bg-[#BDBDBD] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300 ease-out motion-safe:group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] lg:px-5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-black">
                          {rowCta(item)}
                          <span aria-hidden className="ml-1 inline-block">
                            →
                          </span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {pageCount > 1 ? (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: pageCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i)}
                  className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                    i === dotActiveIndex ? "bg-white" : "bg-white/35 hover:bg-white/55"
                  }`}
                  aria-label={t("home.exclusive_offers.dot_aria", { n: i + 1 })}
                  aria-current={i === dotActiveIndex ? "true" : undefined}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </FadeInSection>
  );
}
