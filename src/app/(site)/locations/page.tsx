"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Link from "next/link";
import { PageTemplate } from "@/components/layout/PageTemplate";
import { BranchCard } from "@/components/locations/BranchCard";
import { LocationsMap } from "@/components/locations/LocationsMap";
import { FadeInSection } from "@/components/home/FadeInSection";

interface ApiBranch {
  id: string;
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

const BRANCH_TYPES = [
  { value: "", label: "All types" },
  { value: "Airport", label: "Airport" },
  { value: "Downtown", label: "Downtown" },
  { value: "Mall", label: "Mall" },
];

function LocationsContent() {
  const [branches, setBranches] = useState<ApiBranch[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [province, setProvince] = useState("");
  const [branchType, setBranchType] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (province) params.set("province", province);
    if (branchType) params.set("branch_type", branchType);
    if (keyword.trim()) params.set("keyword", keyword.trim());
    const res = await fetch(`/api/locations?${params}`);
    const data = await res.json();
    setBranches(data.data ?? []);
    setLoading(false);
  }, [province, branchType, keyword]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const isMobile = useIsMobile();

  const handlePinClick = useCallback((id: string) => {
    setSelectedId(id);
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const handleSelectBranch = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <PageTemplate
      title="Locations"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Locations" }]}
    >
      <p className="text-hertz-black-80">
        Find Hertz rental locations at airports and cities across Thailand.
      </p>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Left: filters + list (40%) */}
        <div className="flex w-full flex-col lg:w-[40%] lg:shrink-0">
          <div className="space-y-3">
            <input
              type="search"
              placeholder="Search by location or address"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchBranches()}
              className="min-h-tap w-full border border-hertz-border px-4 py-3 text-hertz-black-90 placeholder:text-hertz-black-60 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30"
              aria-label="Search locations"
            />
            <div className="flex flex-wrap gap-3">
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="min-h-tap flex-1 border border-hertz-border bg-white px-4 py-3 text-sm font-medium text-hertz-black-90 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30 sm:min-w-[140px]"
                aria-label="Filter by province"
              >
                {PROVINCES.map((p) => (
                  <option key={p || "all"} value={p}>
                    {p || "All provinces"}
                  </option>
                ))}
              </select>
              <select
                value={branchType}
                onChange={(e) => setBranchType(e.target.value)}
                className="min-h-tap flex-1 border border-hertz-border bg-white px-4 py-3 text-sm font-medium text-hertz-black-90 focus:border-[#FFCC00] focus:ring-2 focus:ring-[#FFCC00]/30 sm:min-w-[140px]"
                aria-label="Filter by branch type"
              >
                {BRANCH_TYPES.map((t) => (
                  <option key={t.value || "all"} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={fetchBranches}
                className="min-h-tap shrink-0 border border-hertz-border px-5 font-bold text-black transition-colors hover:border-black hover:bg-hertz-gray"
              >
                Search
              </button>
            </div>
          </div>

          {/* Mobile: map toggle */}
          <button
            type="button"
            onClick={() => setMapModalOpen(true)}
            className="mt-4 flex min-h-tap w-full items-center justify-center gap-2 border border-hertz-border bg-white font-semibold text-black transition-colors hover:border-black lg:hidden"
          >
            View map
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
                <p className="text-hertz-black-80">No locations found. Try different filters.</p>
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
                        onToggleExpand={isMobile ? handleToggleExpand : undefined}
                      />
                    </div>
                  </FadeInSection>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: map (60%) - desktop only */}
        <div className="hidden lg:block lg:flex-1">
          <div className="sticky top-24 h-[500px] overflow-hidden">
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
        </div>
      </div>

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
              <h3 className="font-bold text-black">Map</h3>
              <button
                type="button"
                onClick={() => setMapModalOpen(false)}
                className="min-h-tap min-w-tap p-2 text-hertz-black-80 hover:text-black"
                aria-label="Close map"
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
