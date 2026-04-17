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
    <FadeInSection>
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

        <div className="relative z-[1] mx-auto max-w-container px-12">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-2 text-sm text-white/75 lg:text-base">{subheading}</p>
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
                      className="group flex h-full min-h-0 flex-col gap-3 text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070707]"
                    >
                      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#E8E8E8] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300 ease-out motion-safe:group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] sm:p-5">
                        <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-neutral-400">
                          <OfferImage src={item.imageSrc} alt={item.imageAlt} />
                        </div>
                        <div className="mt-4 flex min-h-0 flex-1 flex-col text-left">
                          <p className="text-sm font-black uppercase leading-tight tracking-wide text-black sm:text-[0.9375rem]">
                            {item.cardTitle.trim() || t("home.exclusive_offers.card_heading")}
                          </p>
                          <p className="mt-2.5 line-clamp-3 text-sm font-normal leading-relaxed text-black/90 sm:text-[0.9375rem]">
                            {item.cardDescription?.trim() ||
                              t("home.exclusive_offers.card_description")}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 rounded-2xl border border-black/10 bg-[#E8E8E8] px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-shadow duration-300 ease-out motion-safe:group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] sm:px-5 sm:py-3.5">
                        <span className="text-sm font-black uppercase leading-none tracking-wide text-black sm:text-base">
                          {rowCta(item)}
                          <span aria-hidden className="ml-1.5 inline-block translate-y-px font-black">
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
