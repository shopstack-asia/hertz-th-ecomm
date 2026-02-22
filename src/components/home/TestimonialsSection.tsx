"use client";

import { FadeInSection } from "./FadeInSection";

const testimonials = [
  {
    quote: "Smooth booking process and excellent vehicle condition. Will use again.",
    author: "James L.",
    rating: 5,
  },
  {
    quote: "Great service at Phuket airport. Car was ready when we arrived.",
    author: "Sarah K.",
    rating: 5,
  },
  {
    quote: "Transparent pricing, no surprises. Hertz Thailand is my go-to.",
    author: "Michael T.",
    rating: 5,
  },
];

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5 text-hertz-yellow" aria-label={`${stars} out of 5 stars`}>
      {Array.from({ length: stars }).map((_, i) => (
        <span key={i} aria-hidden>★</span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-[#FAFAFA] py-12 lg:py-16">
        <div className="mx-auto max-w-container px-6">
          <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
            What our customers say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="border border-hertz-border bg-white p-6 transition-all duration-200 ease-out hover:shadow-elevated"
              >
                <StarRating stars={t.rating} />
                <blockquote className="mt-4 text-hertz-black-80">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-bold text-black">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
