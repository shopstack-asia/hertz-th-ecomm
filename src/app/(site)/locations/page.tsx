"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { BranchCard } from "@/components/locations/BranchCard";
import { BranchDetailView, type BranchDetail } from "@/components/locations/BranchDetailView";
import { LocationsMap } from "@/components/locations/LocationsMap";
import { FadeInSection } from "@/components/home/FadeInSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { useBooking } from "@/contexts/BookingContext";

function toDateString(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

interface ApiBranch {
  id: string;
  code?: string;
  name: string;
  branch_type: string;
  province: string;
  district: string;
  address: string;
  phone: string;
  opening_hours: string;
  latitude: number;
  longitude: number;
  is_24_hours: boolean;
  image?: string;
}

const PROVINCES = [
  "",
  "Bangkok",
  "Chiang Mai",
  "Phuket",
  "Khon Kaen",
  "Udon Thani",
  "Songkhla",
  "Surat Thani",
  "Chonburi",
  "Phitsanulok",
  "Krabi",
];

const BRANCH_TYPES: { value: string; key: string }[] = [
  { value: "", key: "locations.type_all" },
  { value: "Airport", key: "locations.type_airport" },
  { value: "Downtown", key: "locations.type_downtown" },
  { value: "Mall", key: "locations.type_mall" },
];

function LocationsContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setPickupLocation, setPickupDateTime, setDropoffDateTime } = useBooking();
  const [branches, setBranches] = useState<ApiBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [province, setProvince] = useState("");
  const [branchType, setBranchType] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [keywordDebounced, setKeywordDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setKeywordDebounced(keyword), 400);
    return () => clearTimeout(t);
  }, [keyword]);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("list", "1");
    if (province) params.set("province", province);
    if (branchType) params.set("branch_type", branchType);
    if (keywordDebounced.trim()) params.set("keyword", keywordDebounced.trim());
    const res = await fetch(`/api/locations?${params}`);
    const data = await res.json();
    setBranches(data.data ?? []);
    setLoading(false);
  }, [province, branchType, keywordDebounced]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const isMobile = useIsMobile();

  const selectedBranch: BranchDetail | null = selectedId
    ? (branches.find((b) => b.id === selectedId) as BranchDetail | undefined) ?? null
    : null;

  const handlePinClick = useCallback((id: string) => {
    setSelectedId(id);
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const handleSelectBranch = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleUseForFilter = useCallback(
    (code: string, name: string) => {
      setPickupLocation(code, name);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dropoffDate = new Date(tomorrow);
      dropoffDate.setDate(dropoffDate.getDate() + 2);

      const pickupDateStr = toDateString(tomorrow);
      const dropoffDateStr = toDateString(dropoffDate);
      const pickupTime = "10:00";
      const dropoffTime = "10:00";
      setPickupDateTime(pickupDateStr, pickupTime);
      setDropoffDateTime(dropoffDateStr, dropoffTime);

      const pickupAt = `${pickupDateStr}T${pickupTime}:00`;
      const dropoffAt = `${dropoffDateStr}T${dropoffTime}:00`;
      const params = new URLSearchParams({
        pickup: code,
        dropoff: code,
        pickupAt,
        dropoffAt,
        pickupName: name || code,
        dropoffName: name || code,
      });
      router.push(`/search?${params}`);
    },
    [setPickupLocation, setPickupDateTime, setDropoffDateTime, router]
  );

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <PageTemplate
      title={t("locations.page_title")}
      breadcrumb={[{ label: t("common.home"), href: "/" }, { label: t("locations.breadcrumb") }]}
    >
      <p className="text-hertz-black-80">
        {t("locations.intro")}
      </p>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left: filters + list (40%) */}
        <div className="flex w-full flex-col lg:w-[40%] lg:shrink-0">
          <div className="space-y-3">
            <input
              type="search"
              placeholder={t("locations.search_placeholder")}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchBranches()}
              className="min-h-tap w-full border border-hertz-border px-4 py-3 text-hertz-black-90 placeholder:text-hertz-black-60 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30"
              aria-label={t("locations.search_aria")}
            />
            <div className="flex flex-wrap gap-3">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="min-h-tap flex-1 border border-hertz-border bg-white px-4 py-3 text-sm font-medium text-hertz-black-90 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30 sm:min-w-[140px]"
                aria-label={t("locations.filter_province")}
              >
                {PROVINCES.map((p) => (
                  <option key={p || "all"} value={p}>
                    {p || t("locations.all_provinces")}
                  </option>
                ))}
              </select>
              <select
                value={branchType}
                onChange={(e) => setBranchType(e.target.value)}
                className="min-h-tap flex-1 border border-hertz-border bg-white px-4 py-3 text-sm font-medium text-hertz-black-90 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30 sm:min-w-[140px]"
                aria-label={t("locations.filter_type")}
              >
                {BRANCH_TYPES.map((typeOpt) => (
                  <option key={typeOpt.value || "all"} value={typeOpt.value}>
                    {t(typeOpt.key)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={fetchBranches}
                className="min-h-tap shrink-0 border border-hertz-border px-5 font-bold text-black transition-colors hover:border-black hover:bg-hertz-gray"
              >
                {t("locations.search_btn")}
              </button>
            </div>
          </div>

          {/* Mobile: map toggle */}
          <button
            type="button"
            onClick={() => setMapModalOpen(true)}
            className="mt-4 flex min-h-tap w-full items-center justify-center gap-2 border border-hertz-border bg-white font-semibold text-black transition-colors hover:border-black lg:hidden"
          >
            {t("locations.view_map")}
          </button>

          {/* Branch list */}
          <div className="mt-6 max-h-[600px] overflow-y-auto lg:max-h-[calc(100vh-320px)]">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-40 animate-pulse bg-hertz-gray" />
                ))}
              </div>
            ) : branches.length === 0 ? (
              <div className="border border-hertz-border bg-white p-12 text-center">
                <p className="text-hertz-black-80">{t("locations.no_locations")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {branches.map((b, i) => (
                  <FadeInSection key={b.id} delay={i * 50}>
                    <div ref={(el) => { cardRefs.current[b.id] = el; }}>
                      <BranchCard
                        branch={b}
                        isSelected={selectedId === b.id}
                        isExpanded={expandedId === b.id}
                        onSelect={handleSelectBranch}
                        onUseForFilter={handleUseForFilter}
                        onToggleExpand={isMobile ? handleToggleExpand : undefined}
                        t={t}
                      />
                    </div>
                  </FadeInSection>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right (60%): map by default; detail panel when branch selected - desktop */}
        <div className="hidden min-h-[500px] lg:block lg:flex-1">
          <div className="sticky top-24 flex h-[calc(100vh-7rem)] min-h-[500px] flex-col">
            {selectedId && selectedBranch ? (
              <BranchDetailView
                branch={selectedBranch}
                t={t}
                onClose={() => setSelectedId(null)}
                onUseForFilter={handleUseForFilter}
              />
            ) : (
              <div className="h-full overflow-hidden rounded-xl border border-hertz-border">
                <LocationsMap
                  branches={branches.map((b) => ({
                    id: b.id,
                    name: b.name,
                    latitude: b.latitude,
                    longitude: b.longitude,
                  }))}
                  selectedId={selectedId}
                  onPinClick={handlePinClick}
                  className="h-full min-h-[400px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: detail panel below list when a branch is selected */}
      {isMobile && selectedId && selectedBranch && (
        <div className="mt-6 lg:hidden">
          <BranchDetailView
            branch={selectedBranch}
            t={t}
            onClose={() => setSelectedId(null)}
            onUseForFilter={handleUseForFilter}
          />
        </div>
      )}

      {/* Mobile map modal */}
      {mapModalOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setMapModalOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-4 top-16 z-50 flex flex-col overflow-hidden border border-hertz-border bg-white lg:hidden">
            <div className="flex items-center justify-between border-b border-hertz-border px-4 py-3">
              <h3 className="font-bold text-black">{t("locations.map_title")}</h3>
              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                className="min-h-tap min-w-tap p-2 text-hertz-black-80 hover:text-black"
                aria-label={t("locations.close_map")}
              >
                ✕
              </button>
            </div>
            <div className="relative flex-1 min-h-0">
              <LocationsMap
                branches={branches.map((b) => ({
                  id: b.id,
                  name: b.name,
                  latitude: b.latitude,
                  longitude: b.longitude,
                }))}
                selectedId={selectedId}
                onPinClick={(id) => {
                  handlePinClick(id);
                  setMapModalOpen(false);
                }}
                className="absolute inset-0 h-full"
              />
            </div>
          </div>
        </>
      )}
    </PageTemplate>
  );
}

export default function LocationsPage() {
  return <LocationsContent />;
}
