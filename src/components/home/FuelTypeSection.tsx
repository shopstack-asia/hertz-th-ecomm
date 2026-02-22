"use client";

import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

const fuelTypes = [
  { name: "Petrol", slug: "petrol" },
  { name: "Hybrid", slug: "hybrid" },
  { name: "Electric", slug: "ev" },
  { name: "Diesel", slug: "diesel" },
];

export function FuelTypeSection() {
  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-container px-6">
          <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
            Browse by fuel type
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fuelTypes.map((fuel) => (
              <Link
                key={fuel.slug}
                href={`/vehicles?fuel=${fuel.slug}`}
                className={`group flex min-h-tap items-center justify-between border p-6 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-elevated ${
                  fuel.slug === "ev"
                    ? "border-[#22c55e]/30 bg-[#22c55e]/5 hover:border-[#22c55e]/50"
                    : "border-hertz-border"
                }`}
              >
                <span className="text-lg font-bold text-black">{fuel.name}</span>
                <span className="text-hertz-black-60 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
