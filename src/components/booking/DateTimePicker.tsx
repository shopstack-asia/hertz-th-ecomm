"use client";

interface DateTimePickerProps {
  label: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  minDate?: string;
  minTime?: string;
  id?: string;
  disabled?: boolean;
  dark?: boolean;
}

const inputBase = "min-h-tap px-4 py-3 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30";
const inputLight = "border border-gray-300 text-hertz-black-80 disabled:bg-gray-100";
const inputDark = "border border-white/40 bg-white/10 text-white";

export function DateTimePicker({
  label,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  minDate,
  minTime,
  id,
  disabled,
  dark = false,
}: DateTimePickerProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const inputClass = `${inputBase} ${dark ? inputDark : inputLight}`;
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={fieldId}
        className={`text-sm font-medium ${dark ? "text-white/90" : "text-hertz-black-80"}`}
      >
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={fieldId}
          type="date"
          value={dateValue}
          onChange={(e) => onDateChange(e.target.value)}
          min={minDate}
          disabled={disabled}
          className={`flex-1 ${inputClass}`}
        />
        <input
          type="time"
          value={timeValue}
          onChange={(e) => onTimeChange(e.target.value)}
          min={minTime}
          disabled={disabled}
          className={`w-28 ${inputClass}`}
        />
      </div>
    </div>
  );
}
