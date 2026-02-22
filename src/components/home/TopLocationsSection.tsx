"use client";

import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

const locations = [
  {
    name: "Bangkok",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600",
    href: "/search?pickup=BKK",
  },
  {
    name: "Phuket",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600",
    href: "/search?pickup=HKT",
  },
  {
    name: "Chiang Mai",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600",
    href: "/search?pickup=CNX",
  },
  {
    name: "Pattaya",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=600",
    href: "/search?pickup=UTP",
  },
];

export function TopLocationsSection() {
  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-[#FAFAFA] py-12 lg:py-16">
        <div className="mx-auto max-w-container px-6">
          <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
            Top locations
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((loc) => (
              <Link
                key={loc.name}
                href={loc.href}
                className="group relative block aspect-[4/3] overflow-hidden"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/50" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    {loc.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
