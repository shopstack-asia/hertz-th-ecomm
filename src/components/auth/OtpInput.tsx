"use client";

import { useRef, useCallback, KeyboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  "aria-label"?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  error,
  "aria-label": ariaLabel = "One-time password",
}: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const setDigit = useCallback(
    (index: number, char: string) => {
      const next = digits.slice();
      next[index] = char.replace(/\D/g, "").slice(-1);
      onChange(next.join("").slice(0, length));
    },
    [digits, length, onChange]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        refs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    },
    [digits, setDigit]
  );

  const handleChange = useCallback(
    (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/\D/g, "").slice(-1);
      setDigit(index, v);
      if (v && index < length - 1) refs.current[index + 1]?.focus();
    },
    [length, setDigit]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      onChange(pasted);
      const nextIndex = Math.min(pasted.length, length - 1);
      refs.current[nextIndex]?.focus();
    },
    [length, onChange]
  );

  return (
    <div
      className="flex justify-center gap-2"
      role="group"
      aria-label={ariaLabel}
      onPaste={handlePaste}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`h-12 w-11 rounded-xl border text-center text-lg font-semibold tabular-nums transition-colors focus:border-hertz-yellow focus:outline-none focus:ring-2 focus:ring-hertz-yellow/30 disabled:bg-gray-100 ${
            error ? "border-red-500 " : "border-gray-300 "
          }${error ? "shake" : ""}`}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
