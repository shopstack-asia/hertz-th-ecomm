"use client";

import { useState, useEffect, useCallback } from "react";
import { isValidOtpCode } from "@/services/otp.service";

const LENGTH = 6;
const EXPIRY_SEC = 5 * 60;
const RESEND_COOLDOWN_SEC = 60;

export interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  type: "email" | "phone";
  newValue: string;
  onSuccess: () => void;
  onRequestOtp: () => Promise<void>;
  onVerifyOtp: (otp: string) => Promise<void>;
}

export function OtpModal({
  open,
  onClose,
  type,
  newValue,
  onSuccess,
  onRequestOtp,
  onVerifyOtp,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  const canConfirm = isValidOtpCode(otp);

  const requestOtp = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await onRequestOtp();
      setCountdown(EXPIRY_SEC);
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setOtp("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, [onRequestOtp]);

  useEffect(() => {
    if (!open) return;
    setOtp("");
    setError(null);
    requestOtp();
  }, [open, type, newValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (!canConfirm) return;
    setError(null);
    setVerifying(true);
    try {
      await onVerifyOtp(otp);
      onSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  if (!open) return null;

  const maskValue = type === "email" ? newValue.replace(/(.{2})(.*)(@.*)/, "$1***$3") : newValue.replace(/(\d{3})\d+(\d{3})/, "$1***$2");

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-modal-title"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-hertz-border bg-white p-6 shadow-xl"
      >
        <h2 id="otp-modal-title" className="text-lg font-bold text-black">
          Verify {type === "email" ? "email" : "phone"}
        </h2>
        <p className="mt-2 text-sm text-hertz-black-80">
          We sent a 6-digit code to {maskValue}. Enter it below.
        </p>
        {countdown > 0 && (
          <p className="mt-1 text-xs text-hertz-black-60">
            Code expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
          </p>
        )}
        <div className="mt-4">
          <label htmlFor="otp-input" className="sr-only">
            6-digit code
          </label>
          <input
            id="otp-input"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={LENGTH}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, LENGTH))}
            className="w-full border border-hertz-border px-4 py-3 text-center text-2xl tracking-[0.5em] text-black focus:border-hertz-yellow focus:ring-2 focus:ring-hertz-yellow/30"
            placeholder="000000"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleVerify}
            disabled={!canConfirm || verifying}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-hertz-yellow font-bold text-black disabled:opacity-50"
          >
            {verifying ? "Verifying…" : "Confirm"}
          </button>
          <button
            type="button"
            onClick={requestOtp}
            disabled={loading || resendCooldown > 0}
            className="text-sm font-medium text-hertz-black-80 hover:underline disabled:opacity-50"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : "Resend code"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-hertz-black-60 hover:text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
