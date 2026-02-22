"use client";

import type { CmsTextSection } from "@/types/cms";

interface TextSectionProps {
  section: CmsTextSection;
}

export function TextSection({ section }: TextSectionProps) {
  return (
    <section className="border-b border-hertz-border py-12 lg:py-16">
      <div
        className="cms-text mx-auto max-w-3xl px-6 lg:px-0 text-[#434244] [&_p]:mb-4 [&_p:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: section.content.trim() }}
      />
    </section>
  );
}
