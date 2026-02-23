"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const SCROLL_THRESHOLD_PX = 24;

export interface ConsentModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  title: string;
  children: React.ReactNode;
}

export function ConsentModal({
  open,
  onClose,
  onAccept,
  title,
  children,
}: ConsentModalProps) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD_PX;
    setScrolledToBottom(atBottom);
  }, []);

  useEffect(() => {
    if (!open) {
      setScrolledToBottom(false);
      return;
    }
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
    };
  }, [open, checkScroll]);

  const handleAccept = useCallback(() => {
    if (!scrolledToBottom) return;
    onAccept();
    onClose();
  }, [scrolledToBottom, onAccept, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-gray-200 bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="consent-modal-title" className="text-lg font-semibold text-hertz-black-90">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-hertz-black-60 hover:bg-gray-100 hover:text-hertz-black-90"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-6 py-4"
          style={{ maxHeight: "50vh" }}
        >
          <div className="max-w-none text-sm leading-relaxed text-hertz-black-80">
            {children}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2 border-t border-gray-200 px-6 py-4">
          {!scrolledToBottom && (
            <p className="text-xs text-hertz-black-60" role="status">
              Please scroll to the bottom to accept.
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 py-3 font-medium text-hertz-black-80 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={!scrolledToBottom}
              className="flex-1 rounded-xl bg-hertz-yellow py-3 font-semibold text-hertz-black-90 transition-opacity disabled:opacity-50"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
