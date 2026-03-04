"use client";

import { useRef, useEffect } from "react";
import { LOCATION_IMAGE_FALLBACK } from "@/lib/locationImages";
import { ImageCarousel } from "./ImageCarousel";

type TFunction = (key: string) => string;

export interface BranchDetail {
  id: string;
  code?: string;
  name: string;
  branch_type: string;
  province: string;
  district?: string;
  address: string;
  phone: string;
  opening_hours: string;
  latitude: number;
  longitude: number;
  /** Location-type image (airport, downtown, mall, beach). */
  image?: string;
}

interface BranchDetailViewProps {
  branch: BranchDetail | null;
  t: TFunction;
  onClose?: () => void;
  onUseForFilter?: (code: string, name: string) => void;
}

const GOOGLE_MAPS_EMBED_URL = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
const GOOGLE_MAPS_SEARCH_URL = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

export function BranchDetailView({ branch, t, onClose, onUseForFilter }: BranchDetailViewProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (branch && panelRef.current) {
      panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [branch?.id]);

  if (!branch) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-hertz-border bg-hertz-gray/30 p-12 text-center">
        <p className="text-hertz-black-70">{t("locations.select_branch_prompt")}</p>
      </div>
    );
  }

  const images = branch.image ? [branch.image] : [LOCATION_IMAGE_FALLBACK];
  const isAirport = branch.branch_type === "Airport";

  return (
    <div
      ref={panelRef}
      className="branch-detail-fade-in flex flex-1 flex-col overflow-y-auto rounded-xl border border-hertz-border bg-white"
    >
      {/* Section 1 – Header */}
      <div className="flex items-start justify-between gap-3 border-b border-hertz-border px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-black sm:text-2xl">{branch.name}</h2>
          {isAirport && (
            <span className="bg-[#FFCC00] px-2 py-0.5 text-xs font-bold text-black">
              {t("locations.airport_badge")}
            </span>
          )}
          {branch.branch_type === "Downtown" && (
            <span className="rounded bg-hertz-gray px-2 py-0.5 text-xs font-medium text-hertz-black-80">
              {t("locations.type_downtown")}
            </span>
          )}
          {branch.branch_type === "Mall" && (
            <span className="rounded bg-hertz-gray px-2 py-0.5 text-xs font-medium text-hertz-black-80">
              {t("locations.type_mall")}
            </span>
          )}
          </div>
          <p className="mt-1 text-sm text-hertz-black-70">{branch.province}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-tap min-w-tap shrink-0 rounded p-2 text-hertz-black-70 transition hover:bg-hertz-gray hover:text-black focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
            aria-label={t("common.close")}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Section 2 – Gallery */}
      <div className="p-4 sm:p-6">
        <ImageCarousel images={images} alt={branch.name} className="w-full" />
      </div>

      {/* Section 3 – Two columns: details + map. Buttons in same row at bottom. */}
      <div className="grid flex-1 gap-6 border-t border-hertz-border p-4 sm:grid-cols-1 sm:p-6 lg:grid-cols-2">
        <div className="flex flex-col lg:h-full lg:min-h-0">
          <div className="flex-1 space-y-4 min-h-0">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-hertz-black-60">
                {t("locations.detail_address")}
              </p>
              <p className="mt-1 text-sm text-hertz-black-90">{branch.address}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-hertz-black-60">
                {t("locations.detail_opening_hours")}
              </p>
              <p className="mt-1 text-sm text-hertz-black-90">{branch.opening_hours}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-hertz-black-60">
                {t("locations.detail_phone")}
              </p>
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                className="mt-1 block text-sm font-medium text-black underline-offset-2 hover:underline"
              >
                {branch.phone}
              </a>
            </div>
          </div>
          {onUseForFilter && branch.code && (
            <div className="mt-4 shrink-0 lg:mt-6">
              <button
                type="button"
                onClick={() => onUseForFilter(branch.code!, branch.name)}
                className="min-h-tap w-full bg-[#FFCC00] px-4 py-3 text-sm font-bold text-black transition hover:bg-[#FFCC00]/90 focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
              >
                {t("locations.select_location")}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-hertz-gray lg:min-h-[200px]">
            <iframe
              title={branch.name}
              src={GOOGLE_MAPS_EMBED_URL(branch.latitude, branch.longitude)}
              width="100%"
              height="100%"
              className="h-full min-h-[200px] w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={GOOGLE_MAPS_SEARCH_URL(branch.latitude, branch.longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-tap w-full shrink-0 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-[#FFCC00] hover:bg-hertz-gray focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {t("locations.open_in_google_maps")}
          </a>
        </div>
      </div>
    </div>
  );
}
