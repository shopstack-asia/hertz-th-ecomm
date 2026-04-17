"use client";

import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

const categories = [
  { name: "Economy", slug: "economy", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600" },
  { name: "SUV", slug: "suv", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600" },
  { name: "Premium", slug: "premium", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=600" },
  { name: "Luxury", slug: "luxury", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600" },
  { name: "Van", slug: "van", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600" },
  { name: "Electric", slug: "ev", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600" },
];

export function CategorySection() {
  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-[#FAFAFA] py-12 lg:py-16">
        <div className="mx-auto max-w-container px-12">
          <h2 className="mb-8 text-2xl font-bold text-black lg:text-3xl">
            Browse by category
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/vehicles?category=${cat.slug}`}
                className="group relative block aspect-[2/1] overflow-hidden"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors duration-300 group-hover:from-black/90 group-hover:via-black/40" />
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    {cat.name}
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
