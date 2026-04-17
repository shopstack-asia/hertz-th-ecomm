"use client";

import Link from "next/link";
import { FadeInSection } from "./FadeInSection";

export function AppDownloadSection() {
  return (
    <FadeInSection>
      <section className="border-b border-hertz-border bg-black py-12 text-white lg:py-16">
        <div className="mx-auto flex max-w-container flex-col items-center gap-8 px-12 lg:flex-row lg:justify-between">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold lg:text-3xl">
              Book on the go
            </h2>
            <p className="mt-4 text-white/90">
              Download the Hertz app for faster booking and exclusive offers.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="#"
                className="inline-block"
                aria-label="Download on App Store"
              >
                <span className="flex h-12 min-w-[140px] items-center justify-center rounded border border-white/40 bg-white/10 text-sm font-semibold transition-colors hover:bg-white/20">
                  App Store
                </span>
              </Link>
              <Link
                href="#"
                className="inline-block"
                aria-label="Get it on Google Play"
              >
                <span className="flex h-12 min-w-[140px] items-center justify-center rounded border border-white/40 bg-white/10 text-sm font-semibold transition-colors hover:bg-white/20">
                  Google Play
                </span>
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="flex h-48 w-32 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white/60">
              Phone mockup
            </div>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
