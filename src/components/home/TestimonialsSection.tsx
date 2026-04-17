"use client";

import { ThumbsUp } from "lucide-react";
import { HOME_TESTIMONIALS_CARD_ORDER } from "@/lib/mock/testimonialsSection";
import { FadeInSection } from "./FadeInSection";
import { useLanguage } from "@/contexts/LanguageContext";

function ThumbsUpBadge() {
  return (
    <div
      className="absolute left-1/2 top-0 z-[1] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#FAFAFA] bg-hertz-yellow shadow-sm"
      aria-hidden
    >
      <ThumbsUp className="h-7 w-7 text-black" strokeWidth={2} aria-hidden />
    </div>
  );
}

function StarRating({ stars }: { stars: number }) {
  const { t } = useLanguage();
  return (
    <div
      className="flex justify-center gap-0.5 text-hertz-yellow"
      aria-label={t("home.testimonials.rating_aria", { n: stars })}
    >
      {Array.from({ length: stars }).map((_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-[#FAFAFA] py-12 lg:py-16">
        <div className="mx-auto max-w-container px-12">
          <h2 className="mb-10 text-left text-2xl font-bold text-black lg:mb-12 lg:text-3xl">
            {t("home.testimonials.title")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {HOME_TESTIMONIALS_CARD_ORDER.map((id) => (
              <article
                key={id}
                className="relative flex flex-col items-center rounded-2xl border-2 border-hertz-yellow bg-white px-5 pb-6 pt-10 text-center shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-200 ease-out hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
              >
                <ThumbsUpBadge />
                <h3 className="mt-1 text-sm font-bold uppercase leading-snug tracking-wide text-black lg:text-[0.8125rem]">
                  {t(`home.testimonials.cards.${id}.header`)}
                </h3>
                <div className="mt-3">
                  <StarRating stars={5} />
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-hertz-black-80">
                  &ldquo;{t(`home.testimonials.cards.${id}.quote`)}&rdquo;
                </blockquote>
                <div
                  className="mx-auto mt-5 w-full max-w-[220px] border-t border-neutral-200"
                  aria-hidden
                />
                <p className="mt-5 text-sm font-bold uppercase tracking-wide text-black">
                  {t(`home.testimonials.cards.${id}.author`)}
                </p>
                <p className="mt-2 text-[0.65rem] font-medium uppercase leading-snug tracking-wide text-neutral-500 lg:text-xs">
                  {t(`home.testimonials.cards.${id}.location`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
