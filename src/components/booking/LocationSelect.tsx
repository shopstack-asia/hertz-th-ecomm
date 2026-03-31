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
  hideLabel?: boolean;
  groupVariant?: "single" | "left" | "right";
  borderless?: boolean;
  /** When set, show this name when value is set but location not yet in list (e.g. from BookingContext). */
  displayName?: string;
  hideChevron?: boolean;
  popupStyle?: boolean;
  fullTextDisplay?: boolean;
}

export function LocationSelect({
  label,
  value,
  onChange,
  placeholder = "Select location",
  disabled,
  dark = false,
  hideLabel = false,
  groupVariant = "single",
  borderless = false,
  hideChevron = false,
  popupStyle = false,
  fullTextDisplay = false,
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
  const hasSelectedValue = Boolean(displayValue && displayValue.trim() !== "");

  const groupBorderClass =
    groupVariant === "left"
      ? "rounded-l"
      : groupVariant === "right"
        ? "rounded-r"
        : "rounded";

  const bgClass = borderless ? "bg-transparent" : dark ? "bg-white/10" : "bg-white";

  const heightClass = borderless ? "h-10" : "min-h-tap";
  const paddingClass = borderless ? "px-4 py-1 pr-10" : "px-4 py-2 pr-10";
  const valueStyleClass = borderless ? "text-[16px] font-semibold leading-none" : "";
  const baseInput = dark
    ? `${heightClass} w-full ${paddingClass} text-white placeholder:text-white/90 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30 ${bgClass} ${valueStyleClass}`
    : `${heightClass} w-full ${paddingClass} text-hertz-black-80 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30 ${bgClass} ${valueStyleClass}`;

  const borderClass = borderless
    ? "border-0"
    : dark
      ? "border border-white/40"
      : "border border-gray-300 disabled:bg-gray-100";

  const affordanceClass = borderless
    ? "cursor-pointer rounded-none bg-transparent hover:bg-black/[0.02] focus:border-transparent focus:ring-0 focus:outline-none shadow-none"
    : "";

  const inputClass = `${baseInput} ${borderClass} ${groupBorderClass} ${affordanceClass}`;

  return (
    <div className={`relative flex flex-col ${hideLabel ? "gap-0" : "gap-1"}`}>
      <label
        className={`${hideLabel ? "sr-only" : "text-sm font-medium"} ${dark ? "text-white/90" : "text-hertz-black-80"}`}
      >
        {label}
      </label>
      <div className="relative">
        {fullTextDisplay ? (
          <button
            type="button"
            onClick={() => !disabled && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            disabled={disabled}
            className={`${inputClass} text-left`}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          >
            <span
              className={`block ${
                hasSelectedValue
                  ? dark
                    ? "text-white"
                    : "text-hertz-black-80"
                  : dark
                    ? "text-white"
                    : "text-hertz-black-60"
              } ${hasSelectedValue ? "whitespace-normal break-words font-semibold leading-none text-[16px]" : "truncate whitespace-nowrap font-semibold leading-none text-[16px]"}`}
            >
              {displayValue || placeholder}
            </span>
          </button>
        ) : (
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
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
        )}
        {!hideChevron && (
          <span
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
              dark ? "text-white/70" : "text-hertz-black-70"
            }`}
            aria-hidden
          >
            ▼
          </span>
        )}
      </div>
      {open && (popupStyle ? (
        <div className="absolute left-0 top-full z-[999] mt-1 w-[920px] max-w-[95vw] overflow-hidden rounded border border-gray-200 bg-white text-hertz-black-80 shadow-card">
          <div className="flex items-center justify-between border-b border-gray-200 bg-[#f7f7fb] px-6 py-3">
            <span className="text-sm font-medium text-hertz-black-80">Top destinations</span>
            <button
              type="button"
              onMouseDown={() => setOpen(false)}
              className="text-2xl leading-none text-hertz-black-40 hover:text-hertz-black-70"
              aria-label="Close destinations popup"
            >
              ×
            </button>
          </div>
          <div className="px-6 py-4">
            {loading ? (
              <p className="text-sm text-hertz-black-60">Loading...</p>
            ) : locations.length === 0 ? (
              <p className="text-sm text-hertz-black-60">No locations found</p>
            ) : (
              <ul className="grid grid-cols-3 gap-x-8 gap-y-3" role="listbox">
                {locations.slice(0, 15).map((loc) => (
                  <li
                    key={loc.code}
                    role="option"
                    aria-selected={value === loc.code}
                    onMouseDown={() => {
                      onChange(loc.code, loc);
                      setQuery("");
                      setOpen(false);
                    }}
                    className={`cursor-pointer text-sm leading-tight p-2 ${
                      value === loc.code
                        ? "font-semibold text-black bg-hertz-yellow"
                        : "text-hertz-black-80 hover:bg-hertz-yellow hover:text-black"
                    }`}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
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
      ))}
    </div>
  );
}
