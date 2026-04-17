"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HeroSection } from "@/components/cms/HeroSection";
import { TextSection } from "@/components/cms/TextSection";
import { BenefitsGrid } from "@/components/cms/BenefitsGrid";
import { CTABanner } from "@/components/cms/CTABanner";
import type { CmsPage, CmsSection } from "@/types/cms";

const CMS_SLUG = "hertz-gold-plus-rewards";

function isTextSection(s: CmsSection): s is CmsSection & { type: "text" } {
  return s.type === "text";
}
function isBenefitsSection(s: CmsSection): s is CmsSection & { type: "benefits" } {
  return s.type === "benefits";
}
function isCtaBannerSection(s: CmsSection): s is CmsSection & { type: "cta_banner" } {
  return s.type === "cta_banner";
}

function CmsSectionRenderer({ section, index }: { section: CmsSection; index: number }) {
  if (isTextSection(section)) {
    return <TextSection key={index} section={section} />;
  }
  if (isBenefitsSection(section)) {
    return <BenefitsGrid key={index} section={section} />;
  }
  if (isCtaBannerSection(section)) {
    return <CTABanner key={index} section={section} />;
  }
  return null;
}

function RewardsContent() {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/cms/pages/${CMS_SLUG}`)
      .then((res) => {
        if (!res.ok) {
          setShowNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data: CmsPage | null) => {
        if (data && !data.is_published) {
          setShowNotFound(true);
          return;
        }
        setPage(data ?? null);
      })
      .catch(() => setShowNotFound(true))
      .finally(() => setLoading(false));
  }, []);

  if (showNotFound) {
    notFound();
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-container px-12 py-24">
        <div className="h-12 w-48 animate-pulse bg-hertz-gray" />
        <div className="mt-8 h-64 animate-pulse bg-hertz-gray" />
      </div>
    );
  }

  if (!page) {
    return null;
  }

  return (
    <div>
      <HeroSection hero={page.hero} />

      <div className="mx-auto max-w-container">
        <nav aria-label="Breadcrumb" className="border-b border-hertz-border px-12 py-4">
          <ol className="flex flex-wrap gap-2 text-sm text-hertz-black-60">
            <li>
              <Link href="/" className="hover:text-black hover:underline">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="font-medium text-black">{page.title}</li>
          </ol>
        </nav>
      </div>

      {page.sections.map((section, i) => (
        <CmsSectionRenderer key={i} section={section} index={i} />
      ))}
    </div>
  );
}

export default function RewardsPage() {
  return <RewardsContent />;
}
