"use client";

import { useState, useRef, useCallback } from "react";
import {
  uploadDocument,
  validateDocumentFile,
  type DocumentType,
} from "@/services/profile.service";

/** Format YYYY-MM-DD to dd/mm/yyyy for display */
function formatExpiryDisplay(iso: string): string {
  if (!iso?.trim()) return "—";
  const [y, m, d] = iso.split("-");
  if (!d || !m || !y) return iso;
  return `${d}/${m}/${y}`;
}

interface DocumentTypeOption {
  value: string;
  label: string;
}

interface DocumentUploadWithExpiryProps {
  label: string;
  hint: string;
  documentUrl: string | null | undefined;
  expiry: string;
  onDocumentChange: (url: string | null) => void;
  onExpiryChange: (value: string) => void;
  docType: DocumentType;
  expiryLabel: string;
  uploadLabel: string;
  uploadedLabel: string;
  removeLabel: string;
  /** When set, show dropdown to select identity document type (id_card / passport) */
  documentTypeDropdown?: {
    value: string;
    options: DocumentTypeOption[];
    placeholder: string;
    onChange: (value: "id_card" | "passport") => void;
  };
  /** When true, expiry is readonly and shown in top-right of card (read from document) */
  expiryReadonly?: boolean;
}

export function DocumentUploadWithExpiry({
  label,
  hint,
  documentUrl,
  expiry,
  onDocumentChange,
  onExpiryChange,
  docType,
  expiryLabel,
  uploadLabel,
  uploadedLabel,
  removeLabel,
  documentTypeDropdown,
  expiryReadonly = false,
}: DocumentUploadWithExpiryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setError(null);
      const validation = validateDocumentFile(file);
      if (!validation.ok) {
        setError(validation.error ?? "Invalid file");
        return;
      }
      setUploading(true);
      try {
        const { url, extracted_expiry } = await uploadDocument(docType, file);
        onDocumentChange(url);
        if (extracted_expiry) onExpiryChange(extracted_expiry);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [docType, onDocumentChange, onExpiryChange]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const hasDocument = !!documentUrl?.trim();

  return (
    <div className="relative flex flex-col gap-3 rounded-xl border border-hertz-border bg-hertz-gray/30 p-4">
      {/* Readonly expiry in top-right (e.g. identity document – read from upload) */}
      {expiryReadonly && (
        <div className="absolute right-4 top-4 text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-hertz-black-60">
            {expiryLabel}
          </p>
          <p className="mt-0.5 text-sm font-medium text-hertz-black-90 tabular-nums">
            {formatExpiryDisplay(expiry)}
          </p>
        </div>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-hertz-black-60">
          {label}
        </p>
        <p className="mt-0.5 text-sm text-hertz-black-70">{hint}</p>
      </div>

      {documentTypeDropdown && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase tracking-wide text-hertz-black-60">
            {documentTypeDropdown.placeholder}
          </label>
          <select
            value={documentTypeDropdown.value}
            onChange={(e) =>
              documentTypeDropdown.onChange(
                e.target.value as "id_card" | "passport"
              )
            }
            className="min-h-tap w-full max-w-xs rounded-xl border border-gray-300 px-4 py-3 text-sm text-hertz-black-80 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30 focus:ring-offset-0"
          >
            <option value="">{documentTypeDropdown.placeholder}</option>
            {documentTypeDropdown.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={onInputChange}
          disabled={uploading}
        />
        {hasDocument ? (
          <>
            <span className="text-sm font-medium text-green-700">
              {uploadedLabel}
            </span>
            <button
              type="button"
              onClick={() => onDocumentChange(null)}
              className="text-sm font-medium text-hertz-black-70 underline hover:text-black"
            >
              {removeLabel}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex min-h-tap items-center justify-center rounded-xl border border-hertz-border bg-white px-4 py-2.5 text-sm font-medium text-hertz-black-80 transition-colors hover:bg-hertz-gray focus:outline-none focus:ring-2 focus:ring-hertz-yellow disabled:opacity-50"
          >
            {uploading ? "Uploading…" : uploadLabel}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!expiryReadonly && (
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`expiry-${docType}`}
            className="text-xs font-bold uppercase tracking-wide text-hertz-black-60"
          >
            {expiryLabel}
          </label>
          <input
            id={`expiry-${docType}`}
            type="date"
            value={expiry}
            onChange={(e) => onExpiryChange(e.target.value)}
            className="min-h-tap rounded-xl border border-gray-300 px-4 py-3 text-hertz-black-80 focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30 focus:ring-offset-0"
          />
        </div>
      )}
    </div>
  );
}
