"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { FadeInSection } from "./FadeInSection";
import { useCarousel } from "@/hooks/useCarousel";

const promos = [
  {
    title: "Pay now, save 10%",
    description: "Book and pay in advance for the best rate on your rental.",
    discount: 10,
    tag: "Limited time",
    cta: "View offers",
    href: "/vehicles",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600",
  },
  {
    title: "Weekly rental deals",
    description: "Save more on 7+ day rentals. Perfect for long trips.",
    discount: 15,
    tag: "Save up to",
    cta: "Search",
    href: "/search",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600",
  },
  {
    title: "Member exclusive",
    description: "Gold Plus Rewards members get complimentary upgrades.",
    discount: 0,
    tag: "Member only",
    cta: "Join now",
    href: "/account/register",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600",
  },
  {
    title: "Early bird special",
    description: "Book 30 days ahead and enjoy extra savings.",
    discount: 5,
    tag: "Early bird",
    cta: "Book early",
    href: "/vehicles",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600",
  },
  {
    title: "Weekend getaway",
    description: "Special rates for Friday to Sunday rentals.",
    discount: 8,
    tag: "Weekend",
    cta: "View offers",
    href: "/vehicles",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600",
  },
];

function PromoCard({
  promo,
  isCenter,
}: {
  promo: (typeof promos)[0];
  isCenter?: boolean;
}) {
  const badge =
    promo.discount > 0 ? `${promo.discount}% OFF` : promo.tag;

  return (
    <Link
      href={promo.href}
      className={`group flex flex-1 flex-col overflow-hidden border border-hertz-border bg-white transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-elevated ${
        isCenter ? "scale-[1.02] shadow-card" : ""
      }`}
    >
      <div className="relative aspect-[16/10] bg-hertz-gray">
        <img
          src={promo.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute right-3 top-3 bg-hertz-yellow px-2 py-1 text-xs font-bold text-black">
          {badge}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold text-black">{promo.title}</h3>
        <p className="mt-2 flex-1 text-sm text-hertz-black-80">
          {promo.description}
        </p>
        <span className="mt-4 inline-block font-bold text-black transition-transform group-hover:translate-x-1">
          {promo.cta} →
        </span>
      </div>
    </Link>
  );
}

export function SpecialOffersSection() {
  const total = promos.length;
  const {
    index,
    goTo,
    next,
    prev,
    pause,
    resume,
  } = useCarousel({ total, intervalMs: 6000 });

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT"
      ) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }
  };

  const getSlideCards = (i: number) => {
    const cards = [
      promos[(i - 1 + total) % total],
      promos[i],
      promos[(i + 1) % total],
    ];
    return cards;
  };

  return (
    <FadeInSection>
      <section
        className="border-b border-hertz-border bg-white py-12 lg:py-16"
        onMouseEnter={pause}
        onMouseLeave={resume}
        role="region"
        aria-roledescription="carousel"
        aria-label="Special offers this month"
      >
        <div className="mx-auto max-w-container px-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black lg:text-3xl">
              Special offers this month
            </h2>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={prev}
                className="flex min-h-tap min-w-tap items-center justify-center border border-hertz-border text-hertz-black-80 transition-colors hover:border-black hover:text-black"
                aria-label="Previous"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                className="flex min-h-tap min-w-tap items-center justify-center border border-hertz-border text-hertz-black-80 transition-colors hover:border-black hover:text-black"
                aria-label="Next"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Carousel viewport */}
          <div
            className="relative overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {promos.map((_, i) => (
              <div
                key={i}
                className="transition-opacity duration-300 ease-out"
                style={{
                  position: i === index ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  opacity: i === index ? 1 : 0,
                  pointerEvents: i === index ? "auto" : "none",
                }}
              >
                {/* Desktop: 3 cards */}
                <div className="hidden gap-6 lg:grid lg:grid-cols-3">
                  {getSlideCards(i).map((p, j) => (
                    <PromoCard
                      key={p.title + j}
                      promo={p}
                      isCenter={j === 1}
                    />
                  ))}
                </div>
                {/* Tablet: 2 cards */}
                <div className="hidden gap-6 md:grid md:grid-cols-2 lg:hidden">
                  <PromoCard promo={promos[i]} />
                  <PromoCard promo={promos[(i + 1) % total]} />
                </div>
                {/* Mobile: 1 card */}
                <div className="md:hidden">
                  <PromoCard promo={promos[i]} isCenter />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="mt-8 flex justify-center gap-2">
            {promos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ease-out ${
                  i === index
                    ? "w-6 bg-black"
                    : "w-2 bg-hertz-border hover:bg-hertz-black-60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
