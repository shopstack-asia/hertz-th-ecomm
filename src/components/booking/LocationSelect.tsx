"use client";

import { useEffect, useState, useCallback } from "react";
import type { Location } from "@/types";

interface LocationSelectProps {
  label: string;
  value: string;
  onChange: (code: string, location?: Location) => void;
  placeholder?: string;
  disabled?: boolean;
  dark?: boolean;
  /** When set, show this name when value is set but location not yet in list (e.g. from BookingContext). */
  displayName?: string;
}

export function LocationSelect({
  label,
  value,
  onChange,
  placeholder = "Select location",
  disabled,
  dark = false,
  displayName,
}: LocationSelectProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const fetchLocations = useCallback(async (q?: string) => {
    setLoading(true);
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    const res = await fetch(`/api/locations${params}`);
    const data = await res.json();
    setLocations(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLocations(query);
  }, [query, fetchLocations]);

  const nameFromList = value && locations.length ? locations.find((l) => l.code === value)?.name : null;
  const displayValue = open ? query : (nameFromList ?? (value && displayName ? displayName : value ? value : ""));

  const inputClass = dark
    ? "min-h-tap w-full border border-white/40 bg-white/10 px-4 py-3 pr-10 text-white placeholder:text-white/60 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30"
    : "min-h-tap w-full rounded border border-gray-300 px-4 py-3 pr-10 text-hertz-black-80 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30 disabled:bg-gray-100";

  return (
    <div className="relative flex flex-col gap-1">
      <label className={`text-sm font-medium ${dark ? "text-white/90" : "text-hertz-black-80"}`}>{label}</label>
      <div className="relative">
        <input
          type="text"
          value={open ? query : displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClass}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <span
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-hertz-black-60"
          aria-hidden
        >
          ▼
        </span>
      </div>
      {open && (
        <ul
          className="absolute top-full z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-2 shadow-card"
          role="listbox"
        >
          {loading ? (
            <li className="px-4 py-3 text-sm text-hertz-black-60">
              Loading...
            </li>
          ) : locations.length === 0 ? (
            <li className="px-4 py-3 text-sm text-hertz-black-60">
              No locations found
            </li>
          ) : (
            locations.map((loc) => (
              <li
                key={loc.code}
                role="option"
                aria-selected={value === loc.code}
                onMouseDown={() => {
                  onChange(loc.code, loc);
                  setQuery("");
                  setOpen(false);
                }}
                className={`cursor-pointer px-4 py-3 text-sm hover:bg-hertz-gray ${
                  value === loc.code
                    ? "bg-hertz-yellow/20 font-medium text-hertz-black-90"
                    : "text-hertz-black-80"
                }`}
              >
                {loc.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
