"use client";

import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id?: string;
}

export function FormField({
  label,
  error,
  id,
  className = "",
  ...props
}: FormFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-hertz-black-80"
      >
        {label}
      </label>
      <input
        id={fieldId}
        className={`min-h-tap rounded-xl border border-gray-300 px-4 py-3 text-hertz-black-80 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30 focus:ring-offset-0 disabled:bg-gray-100 ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
