"use client";

type TFunction = (key: string) => string;

interface BranchCardProps {
  branch: {
    id: string;
    code?: string;
    name: string;
    branch_type: string;
    province: string;
    address: string;
    phone: string;
    opening_hours: string;
  };
  isSelected?: boolean;
  isExpanded?: boolean;
  onSelect?: (id: string) => void;
  onUseForFilter?: (code: string, name: string) => void;
  onToggleExpand?: (id: string) => void;
  t: TFunction;
}

export function BranchCard({
  branch,
  isSelected = false,
  isExpanded = false,
  onSelect,
  onUseForFilter,
  onToggleExpand,
  t,
}: BranchCardProps) {
  const isAirport = branch.branch_type === "Airport";

  return (
    <div
      className={`border bg-white transition-all duration-200 ease-out ${
        isSelected ? "border-[#FFCC00] shadow-[0_0_0_1px_#FFCC00]" : "border-hertz-border hover:border-[#FFCC00]/60 hover:shadow-sm"
      }`}
    >
      <div
        className="flex cursor-pointer flex-col gap-3 p-4 lg:p-5"
        onClick={() => onToggleExpand?.(branch.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggleExpand?.(branch.id);
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-black">{branch.name}</h3>
              {isAirport && (
                <span className="bg-[#FFCC00] px-2 py-0.5 text-xs font-bold text-black">
                  {t("locations.airport_badge")}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-hertz-black-80">{branch.province}</p>
          </div>
          <span className="shrink-0 text-hertz-black-60 lg:hidden">
            {isExpanded ? "−" : "+"}
          </span>
        </div>

        {(isExpanded || !onToggleExpand) && (
          <div className="space-y-2 text-sm text-hertz-black-80">
            <p>{branch.address}</p>
            <p>
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                onClick={(e) => e.stopPropagation()}
                className="min-h-tap inline-flex font-semibold text-black underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
              >
                {branch.phone}
              </a>
            </p>
            <p>{branch.opening_hours}</p>
          </div>
        )}

        {(isExpanded || !onToggleExpand) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {onUseForFilter && branch.code && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onUseForFilter(branch.code!, branch.name);
                }}
                className="min-h-tap bg-[#FFCC00] px-5 font-bold text-black transition-colors hover:bg-[#FFCC00]/90"
              >
                {t("locations.select_location")}
              </button>
            )}
            {onSelect && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(branch.id);
                }}
                className="min-h-tap border border-hertz-border bg-white px-5 font-bold text-black transition-colors hover:border-black hover:bg-hertz-gray"
              >
                {t("locations.view_details")} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
