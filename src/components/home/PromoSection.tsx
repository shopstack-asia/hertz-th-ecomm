"use client";

import Link from "next/link";

const promos = [
  {
    title: "Pay now, save 10%",
    description: "Book and pay in advance for the best rate.",
    cta: "View offers",
    href: "/vehicles",
  },
  {
    title: "Member exclusive",
    description: "Gold Plus Rewards members get free upgrades.",
    cta: "Join now",
    href: "/account/register",
  },
  {
    title: "Weekly rental deals",
    description: "Save more on 7+ day rentals.",
    cta: "Search",
    href: "/search",
  },
];

export function PromoSection() {
  return (
    <section className="border-b border-hertz-border bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-container px-12">
        <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
          Special offers
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {promos.map((promo) => (
            <div
              key={promo.title}
              className="border border-hertz-border p-6"
            >
              <h3 className="text-lg font-bold text-black">{promo.title}</h3>
              <p className="mt-2 text-sm text-hertz-black-80">
                {promo.description}
              </p>
              <Link
                href={promo.href}
                className="mt-4 inline-block font-bold text-black underline hover:no-underline"
              >
                {promo.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
