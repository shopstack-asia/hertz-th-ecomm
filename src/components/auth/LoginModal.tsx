"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth_context";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { t } = useLanguage();
  const { refreshAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        setLoading(false);
        return;
      }
      await refreshAuth();
      onSuccess();
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="w-full max-w-md border border-hertz-border bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="login-modal-title" className="text-xl font-bold text-black">
            Log in to continue
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="min-h-tap min-w-tap p-2 text-hertz-black-80 hover:text-black"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex h-12 flex-1 items-center justify-center border-2 border-black bg-white font-bold text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 flex-1 items-center justify-center bg-[#FFCC00] font-bold text-black disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-hertz-black-60">
            {t("auth.mock_phase_credentials")}
          </p>
        </form>
      </div>
    </div>
  );
}
