"use client";

import { coordsToPosition } from "@/lib/mock/locationsBranches";

interface BranchPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface MapPlaceholderProps {
  branches: BranchPin[];
  selectedId: string | null;
  onPinClick: (id: string) => void;
  className?: string;
}

export function MapPlaceholder({
  branches,
  selectedId,
  onPinClick,
  className = "",
}: MapPlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden bg-hertz-gray ${className}`}
      aria-label="Map showing branch locations"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%23434244' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        }}
      />
      {branches.map((b) => {
        const pos = coordsToPosition(b.latitude, b.longitude);
        const isSelected = selectedId === b.id;
        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onPinClick(b.id)}
            className={`absolute z-10 -translate-x-1/2 -translate-y-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:ring-offset-2 ${
              isSelected ? "scale-110" : ""
            }`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            aria-label={`${b.name} - View on map`}
          >
            <svg
              width="32"
              height="40"
              viewBox="0 0 32 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isSelected ? "drop-shadow-md" : ""}
            >
              <path
                d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z"
                fill={isSelected ? "#FFCC00" : "#000"}
                stroke="#fff"
                strokeWidth="1.5"
              />
              <circle cx="16" cy="16" r="4" fill="#fff" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
