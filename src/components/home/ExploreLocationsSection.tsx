"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ExploreLocationsSectionResolved } from "@/lib/cms/websiteHomeExploreLocations";

type ExploreLocationsSectionProps = {
  data: ExploreLocationsSectionResolved;
};

/**
 * Desktop: 12×6 grid matching reference proportions (~3+4+2+3 cols):
 * col1 portrait stack | col2–5 center (pair landscape / wide / pair portrait) |
 * narrow ultra-tall Krabi | wide right (landscape + tall).
 * CMS index: 0,8 left; 2,3,4,5,6 center; 1 Krabi; 7,9 right.
 */
const DESKTOP_TILE_LAYOUT = [
  "lg:col-start-1 lg:col-end-4 lg:row-start-1 lg:row-end-4",
  "lg:col-start-8 lg:col-end-10 lg:row-start-1 lg:row-end-7",
  "lg:col-start-4 lg:col-end-6 lg:row-start-1 lg:row-end-2",
  "lg:col-start-6 lg:col-end-8 lg:row-start-1 lg:row-end-2",
  "lg:col-start-4 lg:col-end-8 lg:row-start-2 lg:row-end-5",
  "lg:col-start-4 lg:col-end-6 lg:row-start-5 lg:row-end-7",
  "lg:col-start-6 lg:col-end-8 lg:row-start-5 lg:row-end-7",
  "lg:col-start-10 lg:col-end-13 lg:row-start-1 lg:row-end-2",
  "lg:col-start-1 lg:col-end-4 lg:row-start-4 lg:row-end-7",
  "lg:col-start-10 lg:col-end-13 lg:row-start-2 lg:row-end-7",
] as const;

/** Balance sharpness vs decode cost: avoid oversized srcset (reduces scroll jank on mid devices). */
const TILE_IMAGE_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 48vw, (max-width: 1536px) 32vw, 640px";

const EXPLORE_LOCATIONS_BG = "/images/explore_locations/explore-locations-bg.webp";

/** Outer yellow frame on hover/focus-within (`border-2` reserved so layout does not shift). */
const TILE_ARTICLE =
  "group relative isolate min-h-[168px] overflow-hidden rounded-2xl border-2 border-transparent transition-[border-color,transform] duration-200 ease-out hover:border-hertz-yellow focus-within:border-hertz-yellow sm:min-h-[180px] lg:min-h-0";

function isSameOriginPath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

function ExploreTileImage({ src, alt }: { src: string; alt: string }) {
  if (!isSameOriginPath(src)) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={TILE_IMAGE_SIZES}
      quality={82}
      className="object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
      loading="lazy"
      decoding="async"
      fetchPriority="low"
    />
  );
}

export function ExploreLocationsSection({ data }: ExploreLocationsSectionProps) {
  const { t } = useLanguage();

  if (data.tiles.length === 0) {
    return null;
  }

  const heading = data.sectionTitle?.trim() || t("home.explore_locations.title");
  const subheading = data.sectionSubtitle?.trim();
  const contactLabel = data.contactCtaLabel?.trim() || t("home.explore_locations.contact");
  const headingMarginClass = subheading ? "mb-2" : "mb-6";

  return (
    <section
      className="relative overflow-hidden bg-black px-0 pb-10 pt-5 text-white sm:pb-12 sm:pt-6 lg:pb-16 lg:pt-8"
      aria-labelledby="explore-locations-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-z-0 bg-cover bg-center bg-no-repeat opacity-[0.42]"
        style={{ backgroundImage: `url(${EXPLORE_LOCATIONS_BG})` }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/65 to-black"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-container px-12">
        <h2
          id="explore-locations-heading"
          className={`${headingMarginClass} max-w-3xl text-2xl font-bold tracking-tight text-hertz-yellow lg:text-3xl`}
        >
          {heading}
        </h2>
        {subheading ? (
          <p className="mb-6 max-w-2xl text-sm text-white/80 lg:mb-8 lg:text-base">{subheading}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:min-h-[min(640px,72svh)] lg:grid-cols-12 lg:gap-2.5 lg:[grid-template-rows:repeat(6,minmax(0,1fr))]">
          {data.tiles.map((tile, index) => {
            const placement = DESKTOP_TILE_LAYOUT[index] ?? "";
            return (
              <article key={tile.uid} className={`${TILE_ARTICLE} ${placement}`}>
                <Link
                  href={tile.href}
                  className="absolute inset-0 z-0 block min-h-[168px] sm:min-h-[180px] lg:min-h-0"
                  aria-label={t("home.explore_locations.tile_book_aria", { title: tile.title })}
                >
                  <span className="relative block h-full w-full min-h-[168px] sm:min-h-[180px] lg:absolute lg:inset-0 lg:min-h-0 lg:h-full lg:w-full">
                    <ExploreTileImage src={tile.imageSrc} alt={tile.imageAlt} />
                    <span
                      className="pointer-events-none absolute inset-0 bg-black/20 motion-safe:transition-colors motion-safe:duration-200 group-hover:bg-black/45 group-focus-within:bg-black/45"
                      aria-hidden
                    />
                  </span>
                </Link>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-black/92 via-black/45 to-transparent px-3 pb-3 pt-10 opacity-0 motion-safe:transition-opacity motion-safe:duration-200 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:group-hover:opacity-100 sm:px-4 sm:pb-4 sm:pt-14">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                    <p className="pointer-events-none min-w-0 max-w-full text-left text-sm font-bold leading-snug text-hertz-yellow [overflow-wrap:anywhere] line-clamp-2 sm:max-w-[min(100%,calc(100%-6.5rem))] sm:text-base sm:leading-tight sm:line-clamp-3 lg:line-clamp-none lg:text-xl">
                      {tile.title}
                    </p>
                    <Link
                      href={data.contactCtaHref}
                      className="pointer-events-auto inline-flex min-h-tap w-fit shrink-0 items-center justify-center self-start rounded-full border border-hertz-yellow bg-black/90 px-3 py-1 text-xs font-semibold text-hertz-yellow shadow-sm transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hertz-yellow sm:self-end"
                    >
                      {contactLabel}
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
