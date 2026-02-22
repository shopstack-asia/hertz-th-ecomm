"use client";

import type { CmsBenefitsSection } from "@/types/cms";

const ICONS: Record<string, React.ReactNode> = {
  speed: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  points: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  upgrade: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  offer: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
};

function getIcon(iconKey: string) {
  return ICONS[iconKey] ?? ICONS.offer;
}

interface BenefitsGridProps {
  section: CmsBenefitsSection;
}

export function BenefitsGrid({ section }: BenefitsGridProps) {
  return (
    <section className="border-b border-hertz-border bg-hertz-gray py-12 lg:py-16">
      <div className="mx-auto max-w-container px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col border border-hertz-border bg-white p-6 transition-colors hover:border-[#FFCC00]/60"
            >
              <div className="text-black">
                {getIcon(item.icon)}
              </div>
              <h3 className="mt-4 text-lg font-bold text-black">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm text-[#434244]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
