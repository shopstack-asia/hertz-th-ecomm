"use client";

import { useState, useRef, useCallback } from "react";
import { validateAvatarFile, uploadAvatar, AVATAR_RULES } from "@/services/profile.service";

interface ProfileAvatarProps {
  avatarUrl: string | null | undefined;
  onUploaded: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  /** "lg" = 120px, "xl" = 130px for profile inline */
  size?: "default" | "lg" | "xl";
  /** Inline style: circle + small "Change photo" link only, no card UI */
  compact?: boolean;
}

const MAX_DIM = 400;
const JPEG_QUALITY = 0.85;

function compressAndCropToSquare(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const s = Math.min(img.width, img.height, MAX_DIM);
      const canvas = document.createElement("canvas");
      canvas.width = s;
      canvas.height = s;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      const x = (img.width - s) / 2;
      const y = (img.height - s) / 2;
      ctx.drawImage(img, x, y, s, s, 0, 0, s, s);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to compress"));
        },
        "image/jpeg",
        JPEG_QUALITY
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Invalid image"));
    };
    img.src = url;
  });
}

const sizeClasses = {
  default: "h-32 w-32",
  lg: "h-[120px] w-[120px]",
  xl: "h-[130px] w-[130px]",
};

export function ProfileAvatar({
  avatarUrl,
  onUploaded,
  onRemove,
  disabled = false,
  size = "default",
  compact = false,
}: ProfileAvatarProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayUrl = preview ?? avatarUrl ?? null;
  const avatarSize =
    size === "xl"
      ? sizeClasses.xl
      : size === "lg"
        ? sizeClasses.lg
        : sizeClasses.default;

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setError(null);
      const validation = validateAvatarFile(file);
      if (!validation.ok) {
        setError(validation.error ?? "Invalid file");
        return;
      }
      setUploading(true);
      try {
        const blob = await compressAndCropToSquare(file);
        const f = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        const { avatar_url } = await uploadAvatar(f);
        setPreview(null);
        onUploaded(avatar_url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUploaded]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="flex flex-col items-center">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative overflow-hidden rounded-full border border-hertz-border/80 bg-hertz-gray ${avatarSize} ${
          dragging ? "border-hertz-yellow ring-2 ring-hertz-yellow/30" : ""
        } ${disabled ? "opacity-70" : ""} transition-all duration-200`}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-hertz-black-60">
            ?
          </div>
        )}
        {!disabled && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100 disabled:opacity-50"
            aria-label="Upload photo"
          >
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"
              />
            </svg>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_RULES.allowedTypes.join(",")}
        className="sr-only"
        onChange={onInputChange}
      />
      {!disabled && (
        <div className={compact ? "mt-2" : "mt-3 flex flex-col items-center gap-1"}>
          {compact ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-medium text-hertz-black-60 underline hover:text-hertz-black-80 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="min-h-tap rounded-lg border border-hertz-border bg-white px-4 py-2 text-sm font-medium text-hertz-black-80 transition-colors hover:bg-hertz-gray hover:text-black disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload photo"}
              </button>
              {displayUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    onRemove();
                  }}
                  disabled={uploading}
                  className="text-xs font-medium text-hertz-black-60 underline hover:text-red-600 disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </>
          )}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
